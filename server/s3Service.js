const {S3} = require('aws-sdk');
const {fs} = require('memfs')


exports.s3Uploadv2 = async (fileName , basename) => {
    const s3 = new S3()

    const filter = basename.split(".").pop()
    const fileContent = fs.readFileSync(fileName, 'utf8')

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filter === "png" ? `views/images/${basename}` : `views/${basename}`,
        Body: fileContent,
        ContentType: filter === "png" ? 'image/png' : 'text/html; charset=UTF-8' 
    }
    return await s3.upload(param).promise();
}

exports.s3Uploadv2Screenshot = async (fileName , basename) => {
    const s3 = new S3()

    const filter = basename.split(".").pop()

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filter === "png" ? `views/images/${basename}` : `views/${basename}`,
        Body: fileName,
        ContentType: filter === "png" ? 'image/png' : 'text/html; charset=UTF-8' 
    }
    return await s3.upload(param).promise();
}

exports.s3Uploadv2Database = async (fileName , basename) => {
    const s3 = new S3()

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${basename}`,
        Body: fileName,
        ContentType: 'text/csv' 
    }
    return await s3.upload(param).promise();
}

exports.s3Uploadv2Picture = async (file ,basename) => {
    const s3 = new S3()

    const filter = file.mimetype.split("/").pop()

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profilImages/${basename}` + `.${filter}`,
        Body: file.buffer,
        ContentType: file.mimetype 
    }
    return await s3.upload(param).promise();
}