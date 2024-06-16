const AWS = require('aws-sdk');


export async function getImage({ filePath }) {
    //Path is id/file_name. The id is the folder
    const config = {
        accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    }

    AWS.config.update(config);

    const s3 = new AWS.S3();

    const bucketName = process.env.S3_BUCKET_NAME;
    const params = { Bucket: bucketName, Key: filePath };

    try {
        const { Body, ContentType } = await s3.getObject(params).promise();
        return { success: 'success', Body: Body, ContentType: ContentType }
    } catch (error) {
        console.log('something went wrong in get file',);
        return { error: 'failed' }
    }
}
