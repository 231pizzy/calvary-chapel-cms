
const AWS = require('aws-sdk');

require('dotenv').config()

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    //  forcePathStyle: false,
    endpoint: process.env.S3_ENDPOINT
});

module.exports = s3