require("dotenv").config();
const db = require("./db");
const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const puppeteerCore = require("puppeteer-core");
const path = require("path");
const { fs: fsmemfs } = require("memfs");
const {
  saveLocalHtml,
  saveLocalScreenshot,
  deleteLocalFiles,
  deleteLocalScreenshot,
} = require("./s3Service");
const cron = require("node-cron");
const fs = require("fs");
const { template } = require("./template");
const axios = require("axios");
const jwtAuth = require("./routes/jwtAuth");
const sharp = require("sharp");

const pathName = process.env.NODE_ENV === "production" ? "/mnt" : __dirname;

const imagesFolderPath = path.join(pathName, "views", "images");
const htmlFolderPath = path.join(pathName, "views", "html");
const profilImagesFolderPath = path.join(pathName, "views", "profilImages");

// Create folders only in production
if (process.env.NODE_ENV === "production") {
  [imagesFolderPath, htmlFolderPath, profilImagesFolderPath].forEach(
    (folderPath) => {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    }
  );
}

const app = express();

app.use(express.json());

app.use(cors());

app.use(morgan("dev"));

app.use("/api/v1", jwtAuth);

// GET ALL Projects
// app.get("/api/v1/projects", async (req, res) => {

//     const { rows } = await db.query("SELECT * FROM email_table ORDER BY id DESC;")
//     res.status(200).json({
//         status: "success",
//         results: rows.length,
//         rows
//     })
// })

// GET all Projects with page and limit
app.get("/api/v1/projects", async (req, res) => {
  const category = req.query.category;
  const page = req.query.page;
  const limit = req.query.limit;
  const contentblock = req.query.contentBlock;
  const query = req.query.query;
  const type = req.query.type;

  let SelectQuery = "SELECT * FROM email_table WHERE";
  let dataQuery;

  // Inital values
  const initalFilter = [{ category, contentblock, type }];

  // Checks if inital values are undefined , null or ''
  const fullQuery = Object.entries(initalFilter[0])
    .filter((data) => data[1] !== undefined)
    .filter((data) => data[1] !== "");

  // Creating Dynamic SQL query
  if (fullQuery.length > 0) {
    dataQuery = fullQuery.map((data) => data[1]);
    fullQuery.forEach((data, index) => {
      SelectQuery += ` ${data[0]} = $${index + 1} ${
        index + 1 !== fullQuery.length ? "AND" : ""
      }`;
    });
    SelectQuery += "ORDER BY id DESC;";
  }

  const { rows } =
    query && type
      ? await db.query(
          "SELECT * FROM email_table WHERE LOWER(name) LIKE LOWER($1) AND type = $2 ORDER BY id DESC;",
          ["%" + query + "%", type]
        )
      : query
      ? await db.query(
          "SELECT * FROM email_table WHERE LOWER(name) LIKE LOWER($1) ORDER BY id DESC;",
          ["%" + query + "%"]
        )
      : fullQuery.length > 0
      ? await db.query(SelectQuery, dataQuery)
      : await db.query("SELECT * FROM email_table ORDER BY id DESC;");

  const count = await db.query(
    "SELECT * FROM ( SELECT category, COUNT(*) AS Count FROM   email_table GROUP  BY category UNION SELECT type, COUNT(*) AS Count FROM   email_table GROUP  BY type UNION SELECT 'All', COUNT(*) AS Count FROM   email_table) AS a ORDER BY a.category ASC;"
  );

  let countType;
  if (type) {
    countType = await db.query(
      "SELECT * FROM ( SELECT category, COUNT(*) AS Count FROM email_table WHERE type = 'Email' GROUP BY category UNION SELECT 'All', COUNT(*) AS Count FROM email_table WHERE type = 'Email') AS a ORDER BY a.category ASC;"
    );
  }

  let countContentBlocks;
  let queryCount =
    "SELECT * FROM ( SELECT contentblock AS category, COUNT(*) AS Count FROM email_table WHERE";
  if (type === "Content Block") {
    if (fullQuery.length > 0) {
      const filterQuery = fullQuery.filter(
        (data) => data[0] !== "contentblock"
      );
      dataQuery = filterQuery.map((data) => data[1]);
      filterQuery.forEach((data, index) => {
        queryCount += ` ${data[0]} = $${index + 1} ${
          index + 1 !== filterQuery.length ? "AND" : "GROUP BY contentblock"
        }`;
      });
      queryCount +=
        " UNION SELECT 'All', COUNT(*) AS Count FROM email_table WHERE";
      filterQuery.forEach((data, index) => {
        queryCount += ` ${data[0]} = $${index + 1} ${
          index + 1 !== filterQuery.length ? "AND" : ""
        }`;
      });
      queryCount += ") AS a ORDER BY a.category ASC;";
    }
    countContentBlocks = await db.query(queryCount, dataQuery);
  }

  let hasMore = false;
  let results = rows;

  if (page && limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    hasMore = endIndex < rows.length;
    results = rows.slice(startIndex, endIndex);
  }

  res.status(200).json({
    status: "success",
    length: results.length,
    hasMore,
    rows: results,
    count: count.rows,
    countType: countType && countType.rows,
    countContentBlocks: countContentBlocks && countContentBlocks.rows,
  });
});

// POST Send Email
app.post("/api/v1/projects/sendEmail", async (req, res) => {
  // if (process.env.NODE_ENV === "production") {
  const { image, user_id, email_name } = req.body;

  const { rows } = await db.query("SELECT * FROM users;");

  const userInfo = await db.query("SELECT * FROM users where id = $1", [
    user_id,
  ]);

  const count = await db.query(
    "SELECT sum(case when type = 'Email' then 1 else 0 end) as email_count, sum(case when type = 'Content Block' then 1 else 0 end) as code_count FROM email_table;"
  );

  const { email_count, code_count } = count.rows[0];

  const { user_name } = userInfo.rows[0];

  const users = rows.map((data) => ({
    contactKey: data.id + "_" + data.user_email,
    to: data.user_email,
    attributes: {
      SubscriberKey: data.id + "_" + data.user_email,
      EmailAddress: data.user_email,
      image: image,
      user_name: user_name,
      email_name: email_name,
      email_count: email_count,
      code_count: code_count,
    },
  }));

  const token = await axios.post(
    "https://mcjz3r7pm1pl-6z7sb0jcxy1k0y4.auth.marketingcloudapis.com/v2/Token",
    {
      grant_type: "client_credentials",
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      account_id: process.env.account_id,
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );

  await axios.post(
    "https://mcjz3r7pm1pl-6z7sb0jcxy1k0y4.rest.marketingcloudapis.com/messaging/v1/email/messages/",
    {
      definitionKey: "AddProject_Trigger",
      recipients: users,
      attributes: {},
    },
    {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
        "content-type": "application/json",
      },
    }
  );
  // }

  res.status(200).json({
    status: "success",
  });
});

// GET idividual project
app.get("/api/v1/projects/:id", async (req, res) => {
  const id = req.params.id;
  let updater_user;

  try {
    const projects = await db.query(
      "SELECT * FROM email_table WHERE id = $1;",
      [id]
    );
    const user = await db.query("SELECT * FROM users where id = $1;", [
      projects.rows[0].user_id,
    ]);
    if (projects.rows[0].update_id !== null) {
      updater_user = await db.query("SELECT * FROM users where id = $1", [
        projects.rows[0].update_id,
      ]);
    }

    const nowDate = new Date();
    const updatedDate = new Date(projects.rows[0].updated_at);
    const diffTime = Math.ceil(Math.abs(nowDate - updatedDate) / 1000);

    if (diffTime > 15) {
      const count = Number(projects.rows[0].count) + 1;
      const updatedCount = await db.query(
        "UPDATE email_table SET count = $1  WHERE id = $2 returning *",
        [count, id]
      );

      res.status(200).json({
        status: "success",
        rows: updatedCount.rows[0],
        user: user.rows[0],
        updated_user: updater_user?.rows[0] || false,
      });
    } else {
      res.status(200).json({
        status: "success",
        rows: projects.rows[0],
        user: user.rows[0],
        updated_user: updater_user?.rows[0] || false,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// CREATE a Project
app.post("/api/v1/projects", async (req, res) => {
  const { name, category, type, contentblock, user_id } = req.body;

  let { html_code } = req.body;
  if (![name, category, html_code, type].every(Boolean)) {
    return res.status(401).json("Please put all the details!");
  }

  if (type === "Content Block" && Boolean(contentblock) === false) {
    return res.status(401).json("Please select Library!");
  }

  const { rows } = await db.query(
    "INSERT INTO email_table (name, html_code, category, type, contentblock, user_id) VALUES ($1 , $2, $3, $4, $5, $6) returning * ",
    [name, html_code, category, type, contentblock, user_id]
  );
  //   const pathFile = `/html_${rows[0].id}.html`;
  const basename = `html_${rows[0].id}.html`;

  if (type === "Content Block") {
    html_code = template.replace("%%Content_Block%%", html_code);
  }
  //   fsmemfs.writeFileSync(pathFile, html_code);
  //   const result = await s3Uploadv2(pathFile, basename);

  const result = await saveLocalHtml(html_code, basename);

  res.status(201).json({
    status: "success",
    result,
    rows,
  });
});
// const basename = path.basename(__dirname + '/views/images/screenshot13.png')
// console.log(basename.split(".").pop())
// const filename = path.join(__dirname + '/views/images/screenshot13.png')
// const result = s3Uploadv2(filename, basename)
// console.log(result)
// const file = fs.readFileSync(path.join(__dirname + '/views/html_13.html'))
// console.log(file)

// UPDATE a Project
app.put("/api/v1/projects/:id", async (req, res) => {
  const photoName = req.params.id;
  const id = photoName.split("_")[1];
  const { type, user_id } = req.body;
  let { html_code } = req.body;

  deleteLocalScreenshot(photoName);
  const { rows } = await db.query(
    "UPDATE email_table SET html_code = $1 , update_code = $2, update_id = $3 WHERE id = $4 returning *",
    [html_code, new Date(), user_id, id]
  );

  //   const pathFile = `/html_${id}.html`;
  const basename = `html_${id}.html`;

  if (type === "Content Block") {
    html_code = template.replace("%%Content_Block%%", html_code);
  }
  //   fsmemfs.writeFileSync(pathFile, html_code);
  //   const result = await s3Uploadv2(pathFile, basename);

  const result = await saveLocalHtml(html_code, basename);

  res.status(200).json({
    status: "success",
    rows,
    result,
  });
});

// DELETE a Project
app.delete("/api/v1/projects/:id", async (req, res) => {
  const photoName = req.params.id;
  const id = photoName.split("_")[1];

  try {
    // const results = await s3Delete(id, photoName);
    const results = deleteLocalFiles(id, photoName);
    await db.query("DELETE FROM email_table WHERE id = $1", [id]);
    res.status(200).json({
      status: `Email Template deleted with ID: ${id}`,
      results,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/views/html/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(pathName + `/views/html/${filename}`));
});

app.get("/views/images/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(pathName + `/views/images/${filename}`));
});

app.get("/views/profilImages/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(pathName + `/views/profilImages/${filename}`));
});

// CREATE a Screenshot
app.get("/api/v1/projects/screenshot/:id", async (req, res) => {
  let baseURL = process.env.DEVELOPMENT_BASE_URL; // Default to development base URL http://localhost:3001

  if (process.env.NODE_ENV === "production") {
    baseURL = process.env.PRODUCTION_BASE_URL; // Use production base URL in the production environment
  }

  const id = req.params.id;
  const url = `${baseURL}/views/html/html_${id}.html`;

  const d = new Date();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const yy = d.getFullYear();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  const timestamp = "" + yy + mm + dd + min + sec;

  const browser = await puppeteer.launch({
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(url);
  // const pageHeight = await page.evaluate(() => { window.innerHeight; })
  // const pathFile = path.join(__dirname + `/views/images/screenshot${id}.png`)
  // const basename = path.basename(__dirname + `/views/images/screenshot${id}.png`)
  const basename = `screenshot_${id + "_" + timestamp}.jpeg`;
  const image = `${baseURL}/views/images/screenshot_${
    id + "_" + timestamp
  }.jpeg`;
  // const screenshot = await page.screenshot({fullPage: true});
  const body = await page.$("body");
  const bounding_box = await body.boundingBox();
  const screenshot = await page.screenshot({
    clip: {
      x: bounding_box.x,
      y: bounding_box.y,
      width: bounding_box.width,
      height: bounding_box.height,
    },
  });

  let compressedScreenshot;

  const screenshotSizeInKB = Buffer.from(screenshot).length / 1024; // Convert to kilobytes

  if (screenshotSizeInKB > 150) {
    // Apply compression only if the size is greater than 50KB
    compressedScreenshot = await sharp(screenshot)
      .resize(460, null, {
        fit: "inside",
      })
      .jpeg({
        quality: 80,
        chromaSubsampling: "4:4:4",
        progressive: true,
        overshootDeringing: true,
      })
      .toBuffer();
  } else {
    // Use the original screenshot if it's smaller than or equal to 50KB
    compressedScreenshot = screenshot;
  }

  const { rows } = await db.query(
    "UPDATE email_table SET image = $1 WHERE id = $2 returning *",
    [image, id]
  );
  await saveLocalScreenshot(compressedScreenshot, basename);
  res.status(201).json({
    status: "success",
    rows,
    image,
  });
});

//Create ProfileImage

// app.post('/api/v1/project/test', async (req, res) => {
//     const image = req.body.image
//     console.log(image)
//     const aw3 = await s3Uploadv2Picture(image)

//     res.status(201).json({
//       aw3
//     })

// })

// const today = new Date().toISOString().split("T")[0]

// const fnc = async () => {
//     const filepath = path.join(__dirname + `/data/email_data_${today}.csv`)
//     console.log(filepath)
//     await db.query(`COPY email_table(id, name, category, image) TO '${filepath}'  WITH DELIMITER ',' CSV HEADER`)
//     fs.readFile(filepath, 'utf-8', (err, data) => {
//         if (err) throw err;

//         s3Uploadv2Database(data , `email_data_${today}.csv`)
//         console.log('Data have been uploaded!')

//     })
// }

// fnc()

// cron.schedule("* * * * *" , async () => {
//     const today = new Date().toISOString().split("T")[0]
//     const filepath = path.join(__dirname + `/data/email_data_${today}.csv`)
//     await db.query(`COPY email_table(id, name, category, image) TO '${filepath}'  WITH DELIMITER ',' CSV HEADER`)
//     fs.readFile(filepath, 'utf-8', (err, data) => {
//         if (err) throw err;

//         s3Uploadv2Database(data , `email_data_${today}.csv`)
//         console.log('Data have been uploaded!')

//     })
// })

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(
    `Server is up and listening on port ${port} and is in ${process.env.NODE_ENV} mode`
  );
});
