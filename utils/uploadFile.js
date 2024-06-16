import path from 'path';
import * as s3 from './s3Util';

const fs = require('fs');

export async function uploadFile({ fileName, fileStream, callback }) {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (fileStream && fileName) {
        const params = {
            Bucket: bucketName,
            ACL: 'public-read',
            Key: fileName,
            Body: fileStream
        };


        return s3.upload(params, (err, data) => {
            if (err) {
                console.log('something went wrong', err);
                return { error: 'failed' }

            }
            else {
                console.log('file uploaded')
                return { success: 'success' }

            }
        }).promise()
    }
    else {
        return { error: 'failed' }
    }
}