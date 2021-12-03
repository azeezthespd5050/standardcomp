
const { REGION, dynamoDBClient } = require("../models/dynamoDBClient.js");
const pool = require('../models/pool');
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { ddbDocClient } = require('../models/dynamoDBDoc');
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const studentSetup = async (req, res) => {
    
    // Set the parameters
    const params = {
      TableName: "intercontinentalstudents",
      Key: {
      },
      // Define expressions for the new or updated attributes
      UpdateExpression: "set ATTRIBUTE_NAME_1 = :t, ATTRIBUTE_NAME_2 = :s", // For example, "'set Title = :t, Subtitle = :s'"
      ExpressionAttributeValues: {}
    
    };

    let text = `select student_id,first_name, last_name, other_name, full_name, 
    student_class[2], subjects[2] from students where student_class[2] like 'jss%'`;

    let students = await pool.query(text);
    students = students.rows;
    let length = students.length;

    students.forEach( async (student, index) => {
      if( (student.student_class !== 'resume') && !(/^ss3/.test(student.student_class))){
        let newClass;
        let subjects
        if(student.subjects){
          subjects = student.subjects.replace(/{|}|"/g, "");
          subjects = `"{${subjects}}"`;
        }else{
          subjects = `"{}"`;
        }
        if(student && student.student_class){
          let student_class = student.student_class;
          if(student_class.startsWith("jss1")){
            newClass = student_class.replace(/jss1/, "jss2");
          }else if(student_class.startsWith("jss2")){
            newClass = student_class.replace(/jss2/, "3");
          }else if(student_class.startsWith("jss3")){
            if(student_class.startsWith('jss3dn e')){
              newClass = 'ss1dn science';
            }else if(student_class.startsWith('jss3dn r')){
              newClass = 'ss1dn art';
            }else if(student_class.startsWith('jss3col ac')){
              newClass = 'ss1col diamond';
            }else if(student_class.startsWith('jss3col li')){
              newClass = 'ss1col science a';
            }else if(student_class.startsWith('jss3col ros')){
              newClass = 'ss1col art';
            }
          }else if(student_class.startsWith("ss3")){
            newClass = "graduate";
          }
        }
        try{
          text = `update students set student_class[3]='${newClass}', 
          subjects[3]='${subjects}' where student_id='${student.student_id}'`;
          let value = [newClass, subjects];
          data = await pool.query(text)
        } catch(err){
          console.log("err", err);
        }
        if((index+1) === length){
          return res.json({});
        }
      }
    });
}


module.exports = {
    studentSetup,
}