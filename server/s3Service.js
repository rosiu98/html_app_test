const { S3 } = require("aws-sdk");
const { fs } = require("memfs");
const fileSystem = require("fs");

exports.s3Uploadv2 = async (fileName, basename) => {
  const s3 = new S3();

  const filter = basename.split(".").pop();
  const fileContent = fs.readFileSync(fileName, "utf8");

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filter === "png" ? `views/images/${basename}` : `views/${basename}`,
    Body: fileContent,
    ContentType: filter === "png" ? "image/png" : "text/html; charset=UTF-8",
  };
  return await s3.upload(param).promise();
};

exports.s3Delete = async (id, photoName) => {
  const s3 = new S3();

  // const filter = basename.split(".").pop()

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Delete: {
      Objects: [
        { Key: `views/images/${photoName}` },
        { Key: `views/html_${id}.html` },
      ],
    },
  };
  return await s3.deleteObjects(param).promise();
};

exports.s3DeletePhoto = async (photoName) => {
  const s3 = new S3();

  // const filter = basename.split(".").pop()

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `views/images/${photoName}`,
  };
  return await s3.deleteObject(param).promise();
};

exports.s3Find = async (prefix) => {
  const s3 = new S3();

  // const filter = basename.split(".").pop()

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: prefix,
  };
  return await s3.listObjectsV2(param).promise();
};

// exports.s3Delete = async (id) => {
//     const s3 = new S3()

//     // const filter = basename.split(".").pop()

//     const param = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `views/images/screenshot${id}.png`
//     }
//     s3.deleteObject(param, (err,data) => {
//         if (err) console.error(err);
//         else console.log(data);
//     })
// }

exports.s3Uploadv2Screenshot = async (fileName, basename) => {
  const s3 = new S3();

  const filter = basename.split(".").pop();

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filter === "png" ? `views/images/${basename}` : `views/${basename}`,
    Body: fileName,
    ContentType: filter === "png" ? "image/png" : "text/html; charset=UTF-8",
  };
  return await s3.upload(param).promise();
};

exports.s3Uploadv2Database = async (fileName, basename) => {
  const s3 = new S3();

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${basename}`,
    Body: fileName,
    ContentType: "text/csv",
  };
  return await s3.upload(param).promise();
};

exports.s3Uploadv2Picture = async (file, basename) => {
  const s3 = new S3();

  const filter = file.mimetype.split("/").pop();

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `profilImages/${basename}` + `.${filter}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return await s3.upload(param).promise();
};

exports.saveLocalPicture = async (file, basename) => {
  const filter = file.mimetype.split("/").pop();
  const filePath = `views/profilImages/${basename}.${filter}`;

  let baseURL = process.env.DEVELOPMENT_BASE_URL; // Default to development base URL http://localhost:3001

  if (process.env.NODE_ENV === "production") {
    baseURL = process.env.PRODUCTION_BASE_URL; // Use production base URL in production environment
  }

  return new Promise((resolve, reject) => {
    fileSystem.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ Location: `${baseURL}/${filePath}` });
      }
    });
  });
};

exports.saveLocalHtml = async (htmlCode, basename) => {
  const filePath = `views/html/${basename}`; // Specify the file path

  let baseURL = process.env.DEVELOPMENT_BASE_URL; // Default to development base URL http://localhost:3001

  if (process.env.NODE_ENV === "production") {
    baseURL = process.env.PRODUCTION_BASE_URL; // Use production base URL in the production environment
  }

  return new Promise((resolve, reject) => {
    // Write the HTML code to the file
    fileSystem.writeFile(filePath, htmlCode, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ Location: `${baseURL}/${filePath}` });
      }
    });
  });
};

exports.saveLocalScreenshot = async (file, basename) => {
  const filePath = `views/images/${basename}`;

  let baseURL = process.env.DEVELOPMENT_BASE_URL; // Default to development base URL http://localhost:3001

  if (process.env.NODE_ENV === "production") {
    baseURL = process.env.PRODUCTION_BASE_URL; // Use production base URL in production environment
  }

  return new Promise((resolve, reject) => {
    fileSystem.writeFile(filePath, file, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ Location: `${baseURL}/${filePath}` });
      }
    });
  });
};
