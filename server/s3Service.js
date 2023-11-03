const fileSystem = require("fs");
const path = require("path");

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

exports.deleteLocalFiles = (id, photoName) => {
  const screenshotFileName = photoName; // Use the provided photoName for the screenshot filename
  const htmlFileName = `html_${id}.html`; // Adjust the HTML filename format

  // Define the file paths for the local files
  const screenshotFilePath = path.join(
    __dirname,
    "views/images",
    screenshotFileName
  );
  const htmlFilePath = path.join(__dirname, "views/html", htmlFileName);

  try {
    // Delete the local files
    fileSystem.unlinkSync(screenshotFilePath);
    fileSystem.unlinkSync(htmlFilePath);

    // Return a success message
    return "Local files deleted successfully";
  } catch (error) {
    console.error(error);
    return "Failed to delete local files";
  }
};

exports.deleteLocalScreenshot = (photoName) => {
  const screenshotFileName = photoName; // Use the provided photoName for the screenshot filename

  // Define the file paths for the local files
  const screenshotFilePath = path.join(
    __dirname,
    "views/images",
    screenshotFileName
  );

  try {
    // Delete the local files
    fileSystem.unlinkSync(screenshotFilePath);

    // Return a success message
    return "Local Screenshot deleted successfully";
  } catch (error) {
    console.error(error);
    return "Failed to delete local screenshot";
  }
};
