const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

let S3Service = function() {

    const client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    });

    const bucket = process.env.AWS_BUKET;

    let uploadFile = async(fileBuffer, originalName, mimeType, orderId) => {
        const ext = path.extname(originalName).toLowerCase() || (mimeType.startsWith('video') ? '.mp4' : '.jpg');
        const storedName = `${uuidv4()}${ext}`;
        const s3Key = `KoreaInspect/${orderId}/${storedName}`;

        await client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: mimeType
        }));

        const cdnDomain = process.env.CDN_DOCS_DOMAIN;
        const s3Path = cdnDomain
            ? `https://${cdnDomain}/${s3Key}`
            : `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

        return {
            originalName,
            storedName,
            fileType: mimeType.startsWith('video') ? 'video' : 'image',
            s3Path
        };
    }

    return {
        uploadFile
    }
}

module.exports = S3Service();
