
const pool = require('../models/pool');
const { ddbDocClient } = require('../models/dynamoDBDoc');
const { QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { REGION, dynamoDBClient } = require("../models/dynamoDBClient.js");

const { CreateBucketCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const updateTeacher = async (req, res) => {
    let teacherToUpdate = req.body.teacherToUpdate;
    console.log(teacherToUpdate);

    let text = `update teachers set title=$1, first_name=$2, last_name=$3, 
        other_name=$4, username=$5,
            form_teacher=$6, classes=$7, password=$8 where teacher_id=$9`;
    let value = [
        teacherToUpdate.title,
        teacherToUpdate.first_name,
        teacherToUpdate.last_name,
        teacherToUpdate.other_name,
        teacherToUpdate.username,
        teacherToUpdate.form_teacher,
        teacherToUpdate.classes,
        teacherToUpdate.password,
        teacherToUpdate.teacher_id,
    ];
    try{
        let result = await pool.query(text, value);
        return res.status(200).json("updated");
    }catch(err){
        console.log("error", err);
        return res.status(200).json("could not update");
    }
}

const deleteTeacher = async (req, res) => {
    let teacher_id = req.body.teacher_id;

    let text = `delete from teachers where teacher_id=$1`
    let value = [teacher_id];

    try{
        await pool.query(text, value);
        return res.status(200).json("teacher deleted");
    } catch(err){
        console.log("err", err);
        return res.status(200).json("could not deleted teacher");
    }
}

const createTeacher = async (req, res) => {
    let newTeacher = req.body.newTeacher;

    let text = `insert into teachers 
        (title, first_name, last_name, other_name, password, username, full_name) values
        ($1, $2, $3, $4, $5, $6, $7)
        `;
    let value = [
        newTeacher.title,
        newTeacher.first_name,
        newTeacher.last_name,
        newTeacher.other_name,
        newTeacher.password,
        newTeacher.username,
        newTeacher.full_name
    ]

    try{
        await pool.query(text, value);
        //text =`update teachers set full_name = concat(title, ' ', first_name, ' ', last_name, ' ', other_name)`;
        //await pool.query(text);
        return res.status(200).json("Teacher created");

    }catch(err){
        console.log("err", err);
        return res.status(200).json("Could not create teacher");
    }
}

const createStudent = async (req, res) => {
    let newStudent = req.body.newStudent;

    let text = `insert into students
        (first_name, last_name, other_name, student_class[3], subjects[3], full_name) values
        ($1, $2, $3, $4, $5, $6)
        `;
    if(!(newStudent.subjects && (newStudent.subjects.length < 1)) ){
        newStudent.subjects = [];
    }
    let value = [
        newStudent.first_name,
        newStudent.last_name,
        newStudent.other_name,
        newStudent.student_class,
        newStudent.subjects,
        newStudent.full_name
    ]

    try{
        await pool.query(text, value);
        //text =`update teachers set full_name = concat(title, ' ', first_name, ' ', last_name, ' ', other_name)`;
        //await pool.query(text);
        return res.status(200).json("Student created");

    }catch(err){
        console.log("err", err);
        return res.status(200).json("Could not create teacher");
    }
}

module.exports = {
    updateTeacher,
    deleteTeacher,
    createTeacher,
    createStudent
}