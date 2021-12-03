// Import required AWS SDK clients and commands for Node.js.
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3, REGION, BUCKET_NAME } = require("../../s3Client"); // Helper function that creates Amazon S3 service client module.
const {path} =  require("path");
const {fs} = require("fs");

const file = "OBJECT_PATH_AND_NAME"; // Path to and name of object. For example '../myFiles/index.js'.
const fileStream = fs.createReadStream(file);

// Set the parameters
export const uploadParams = {
  Bucket: BUCKET_NAME,
  // Add the required 'Key' parameter using the 'path' module.
  Key: path.basename(file),
  // Add the required 'Body' parameter
  Body: fileStream,
};


// Upload file to specified bucket.
export const run = async () => {
  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    console.log("Success", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run();


