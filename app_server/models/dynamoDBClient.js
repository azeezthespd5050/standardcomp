
const AWS = require('aws-sdk');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const REGION = "us-east-1";
const BUCKET_NAME = 'intercontinentalschool';

//AWS.config.update({region: REGION})

const dynamoDBClient = new DynamoDB({region: REGION});
//const dynamoDB =  new AWS.DynamoDB({apiVersion: '2012-08-10'});
module.exports =  { 
    REGION,
    BUCKET_NAME,
    dynamoDBClient
}