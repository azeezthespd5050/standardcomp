// Import required AWS SDK clients and commands for Node.js.
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, REGION, BUCKET_NAME } = require("../../s3Client"); // Helper function that creates Amazon S3 service client module.

export const bucketParams = {
  Bucket: "BUCKET_NAME",
  Key: "KEY",
};

export const run = async () => {
  try {
    // Create a helper function to convert a ReadableStream to a string.
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });

    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
      return data; // For unit tests.
    // Convert the ReadableStream to a string.
    const bodyContents = await streamToString(data.Body);
    console.log(bodyContents);
      return bodyContents;
  } catch (err) {
    console.log("Error", err);
  }
};
run();

