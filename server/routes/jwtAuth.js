const db = require("../db");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");
const { s3Uploadv2Picture, saveLocalPicture } = require("../s3Service");
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("File is not of the correct type"), false);
  }
};

// Registrering
const upload = multer({ storage, fileFilter });

router.post(
  "/register",
  upload.single("image"),
  validInfo,
  async (req, res) => {
    try {
      const secretKeyServer = process.env.REGISTER_CODE;
      //1. destructure the req.fields(name, email, password)

      const { name, email, password, secretKey } = req.body;
      const image = req.file;

      //1b. Check if secretKey is correct

      if (secretKey !== secretKeyServer) {
        return res.status(401).send("Secret Key is not correct!");
      }

      //1c. Check if image is not null

      if (!image) {
        return res.status(401).send("Please make sure to add image :)");
      }

      //2. check if user exist (if user exist then throw error)

      const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
        email,
      ]);

      if (user.rows.length !== 0) {
        return res.status(401).send("User already exist!");
      }

      // //3. Bcrypt the user password

      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);

      const bcryptPassword = await bcrypt.hash(password, salt);

      // //4. Enter new user inside database

      const newUser = await db.query(
        "INSERT INTO users (user_name, user_email, user_token) VALUES ($1, $2, $3) RETURNING id, user_name, user_email",
        [name, email, bcryptPassword]
      );

      // // //5. Upload and Create url from AWS

      const { Location } = await saveLocalPicture(
        image,
        `ProfilePicture${newUser.rows[0].id}`
      );

      const updatedUser = await db.query(
        "UPDATE users SET user_image = $1 WHERE id = $2 returning id, user_name, user_email, user_image",
        [Location, newUser.rows[0].id]
      );

      // // //6. Generating our jwt token

      const token = jwtGenerator(updatedUser.rows[0].id);

      res.json({
        token,
        rows: updatedUser.rows[0],
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Login route

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body

    const { email, password } = req.body;

    //2. check if user doesn't exist

    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect!");
    }

    //3. check if incomming password is the same the database password

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_token
    );

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect!");
    }

    //4. give them the jwt token

    const token = jwtGenerator(user.rows[0].id);

    res.json({
      token,
      rows: {
        id: user.rows[0].id,
        user_email: user.rows[0].user_email,
        user_name: user.rows[0].user_name,
        user_image: user.rows[0].user_image,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(false);
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await db.query(
      "SELECT * FROM email_table WHERE user_id = $1 ORDER BY id DESC;",
      [id]
    );
    const countEmails = await db.query(
      "SELECT count(id) as emailsCount from email_table where type = 'Email' AND user_id = $1",
      [id]
    );
    const countCodeSnippets = await db.query(
      "SELECT count(id) as emailsCodeSnippets from email_table where type = 'Content Block' AND user_id = $1",
      [id]
    );

    res.json({
      rows,
      countEmails: countEmails.rows[0].emailscount,
      countCodeSnippets: countCodeSnippets.rows[0].emailscodesnippets,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
