const {S3Client} = require('@aws-sdk/client-s3');
const REGION = "us-east-1";
const BUCKET_NAME = 'albayyinah';

const s3 = new S3Client({
    region: REGION
});
module.exports =  { 
    s3,
    REGION,
    BUCKET_NAME
}