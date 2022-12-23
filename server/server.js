require("dotenv").config();
const db = require("./db");
const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const path = require('path')
const { fs:fsmemfs } = require('memfs')
const { s3Uploadv2, s3Uploadv2Screenshot, s3Uploadv2Database, s3Uploadv2Picture } = require("./s3Service");
const cron = require('node-cron')
const fs = require('fs');
const { template } = require("./template");
const axios = require("axios")
const jwtAuth = require("./routes/jwtAuth")



const app = express();

app.use(express.json())

app.use(cors())


app.use(morgan("dev"))

app.use("/api/v1" , jwtAuth )

// GET all Restaurants
app.get("/api/v1/projects", async (req, res) => {

    const { rows } = await db.query("SELECT * FROM email_table ORDER BY id DESC;")
    res.status(200).json({
        status: "success",
        results: rows.length,
        rows
    })
})

// POST Send Email
app.post("/api/v1/projects/sendEmail", async (req, res) => {

    const {image} = req.body;

    const token = await axios.post("https://mcjz3r7pm1pl-6z7sb0jcxy1k0y4.auth.marketingcloudapis.com/v2/Token", {
        grant_type: "client_credentials",
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        account_id: process.env.account_id
      }, {
        headers: {
          "content-type": "application/json"
        }
    })

    await axios.post("https://mcjz3r7pm1pl-6z7sb0jcxy1k0y4.rest.marketingcloudapis.com/messaging/v1/email/messages/", {
            
        definitionKey: "AddProject_Trigger",
        recipients: [
          {
            contactKey: "test1234569_pr",
            to: "rosiu978@gmail.com",
            attributes: {
              SubscriberKey: "test1234569_pr",
              EmailAddress: "rosiu978@gmail.com",
              image: image
            }
          },
          {
            contactKey: "test123456710env_pr",
            to: "pawel@envertadigital.com",
            attributes: {
              SubscriberKey: "test123456710env_pr",
              EmailAddress: "pawel@envertadigital.com",
              image: image
            }
          }
        ],
        attributes: {
        }
      
  }, {
    headers: {
    "Authorization": `Bearer ${token.data.access_token}`,
      "content-type": "application/json"
    }
})

    res.status(200).json({
        status: "success",
    })
})

// GET idividual Restaurant
app.get("/api/v1/projects/:id", async (req, res) => {

    const id = req.params.id
    
    try {
    const projects = await db.query("SELECT * FROM email_table WHERE id = $1;", [id])

    res.status(200).json({
        status: "success",
        rows: projects.rows[0]
    })
} catch (err) {
    console.log(err)
}
})


// CREATE a Project
app.post("/api/v1/projects", async (req, res) => {
    const { name, category, type, contentblock, user_id } = req.body
    let {html_code} = req.body

    const { rows } = await db.query("INSERT INTO email_table (name, html_code, category, type, contentblock, user_id) VALUES ($1 , $2, $3, $4, $5, $6) returning * ", [name, html_code, category, type, contentblock, user_id]);
    const pathFile = `/html_${rows[0].id}.html`
    const basename = `html_${rows[0].id}.html`

    if (type === "Content Block") {
        html_code = template.replace("%%Content_Block%%", html_code)
    }
    fsmemfs.writeFileSync(pathFile, html_code)
    const result = await s3Uploadv2(pathFile ,basename)

    res.status(201).json({
        status: "success",
        result,
        rows
    })
})
// const basename = path.basename(__dirname + '/views/images/screenshot13.png')
// console.log(basename.split(".").pop())
// const filename = path.join(__dirname + '/views/images/screenshot13.png')
// const result = s3Uploadv2(filename, basename)
// console.log(result)
// const file = fs.readFileSync(path.join(__dirname + '/views/html_13.html'))
// console.log(file)

// UPDATE a Restaurant
app.put("/api/v1/projects/:id", async (req, res) => {

    const id = req.params.id
    const {name , html_code , category} = req.body

    const {rows} = await db.query("UPDATE email_table SET name = $1 , html_code = $2, category = $3 WHERE id = $4 returning *", [name, html_code, category, id])

    res.status(200).json({
        status: "success",
        rows
    })
})

// DELETE a Restaurant
app.delete("/api/v1/projects/:id", async (req, res) => {
    // console.log(req.params)
    try {
    const id = req.params.id;
         await db.query("DELETE FROM email_table WHERE id = $1", [id]);
         res.status(200).send(`Email Template deleted with ID: ${id}`)
    } catch (error) {
        console.log(error)
    }
})


app.get('/views/:filename', (req, res) => {
    const filename= req.params.filename
    console.log(filename)
     res.sendFile(path.join(__dirname + `/views/${filename}`))
})

app.get('/views/images/:filename', (req, res) => {
    const filename= req.params.filename
    console.log(filename)
     res.sendFile(path.join(__dirname + `/views/images/${filename}`))
})

// CREATE a Screenshot
app.get('/api/v1/projects/screenshot/:id', async (req, res) => {
    const id = req.params.id;
    const url = `https://emailpaul-app.s3.eu-central-1.amazonaws.com/views/html_${id}.html`
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width:1280,
        height:1000
    })
    await page.goto(url);
    const pathFile = path.join(__dirname + `/views/images/screenshot${id}.png`)
    // const basename = path.basename(__dirname + `/views/images/screenshot${id}.png`)
    const basename = `screenshot${id}.png`
    const image = `https://emailpaul-app.s3.eu-central-1.amazonaws.com/views/images/screenshot${id}.png`
    // await page.screenshot({path: path.join(__dirname + `/views/images/screenshot${id}.png`), fullPage: true});
    const screenshot = await page.screenshot({fullPage: true});
    const {rows} =  await db.query("UPDATE email_table SET image = $1 WHERE id = $2 returning *", [ image, id])
    await s3Uploadv2Screenshot(screenshot ,basename)
    res.status(201).json({
        status: "success",
        rows,
        image
    })
})

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
    console.log(`Server is up and listening on port ${port}`);
});