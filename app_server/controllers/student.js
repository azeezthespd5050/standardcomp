
const pool = require('../models/pool');
const { ddbDocClient } = require('../models/dynamoDBDoc');
const { QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { REGION, dynamoDBClient } = require("../models/dynamoDBClient.js");

const putTeacherPic = async (req, res) => {
    let student_id = req.params.id;
    let image_url = req.body.image_url

    let text = `update students set image_url=$1 where student_id=$2`;
    let value = [image_url, student_id]
    let result = await pool.query(text, value);

    res.status(200).json(result.rows);
}

const loadSubjectStudents = async (req, res) => {
    let subject = req.body.subject;
    let studentClass = req.body.studentClass;
    let sect = req.body.section;
    let isACT = req.body.isACT;
    let query = {};
    let text;
    let value;

    sect = 3;
    isACT = false;
    
    text = `select student_id, full_name, first_name, image_url,
    last_name, other_name, "${subject}"[${sect}] as "recordArray",
    student_class[${sect}],
                subjects[${sect}] from students where student_class[${sect}] = $1`;
    value = [studentClass];
    
    let student_array = [];

    let students;
    try{
        students = await pool.query(text, value);
    }catch(err){
        console.log('err', err)
        return res.status(200).json("could not load students");
    }
    students = students.rows;
    console.log("students", students);
    let nullRecord = Array(9).fill("");
    if(students.length>0){
        students.forEach((student)=>{
            student._id = student.student_id;
            student.recordArray = student.recordArray?student.recordArray.split(","):nullRecord;
            if(student.recordArray > 9){
                student.recordArray = student.recordArray.slice(0,9);
            }
            if(student.subjects){
                student.subjects = student.subjects.replace(/{|}|"/g,"").split(",");
                student.subjects = [...new Set(student.subjects)];
                if(student.subjects.includes(subject)){
                    student.subjects = subject;
                    student_array.push(student);
                }
            }
        });
        student_array.sort((a, b)=>{
            let nameA = a.first_name.toUpperCase();
            let nameB = b.first_name.toUpperCase();
            let lastNameA = a.last_name.toUpperCase();
            let lastNameB = b.last_name.toUpperCase();
            let otherNameA = a.other_name?a.other_name.toUpperCase():a.other_name;
            let otherNameB = b.other_name?b.other_name.toUpperCase():b.other_name;
            if(nameA < nameB){
                return -1;
            }
            if(nameA > nameB){
                return 1;
            }
            if(lastNameA < lastNameB){
                return -1;
            }
            if(lastNameA > lastNameB){
                return 1;
            }
            if(otherNameA < otherNameB){
                return -1;
            }
            if(otherNameA > otherNameB){
                return 1
            }
            return 0;
        });
        return res.render('pages/subjectTeacherStudents', {
            student_array: student_array,
            subject: subject
        });
    }else{
        return res.status(200).json([]); 
    }

}

const saveSubjectTeacherStudents = async (req, res) => {
    let students = req.body.students;
    let subject = students[0].subjects
    let studentClass = students[0].student_class;
    let sect = 3; //req.body.section;
    let isACT = false; //req.body.isACT;
    let count = 1;
    let numberOfStudents = students.length;
    let text;
    let value;
    if(/ACT|SAT/.test(subject)){
        isACT = true;
    }
    for(let student of students){
        let record = student.recordArray;
        if(isACT){
            text = `update students set "${subject}"[${sect}] = $1
            where student_id=$2`;
            value = [`${record.join()}`, student.student_id];
            console.log(text);
        }else{
            text = `update students set "${subject}"[${sect}] = $1
            where student_id=$2`;
            value = [`${record.join()}`, student.student_id];
        }
        try {
            await pool.query(text, value);
        } catch (error) {
            console.log(error);
            return res.status(200).json("Could not save scores");
        }
    };

    res.status(200).json("save");
}

const addSubjectsToStudent = async (req, res) => {
    let studentClass = req.body.selectedClass;
    let selectedSubjects = req.body.selectedSubjects;

    console.log(studentClass, selectedSubjects);
    let text = `select student_id, subjects[3] from students where student_class[3]=$1`;
    let value = [studentClass];

    let students
    try{
        students = await pool.query(text, value);
        students = students.rows;
        if(students.length < 1){
            return res.status(200).json("you have no students in " + studentClass);
        }
    }catch(err){
        console.log("err");
        return res.status(200).json("could not load class");
    }
    for(let student of students){
        let studentId = student.student_id;
        let subjects = student.subjects.replace(/{|}|"/g, "").split(",");
        subjects= [...subjects, ...selectedSubjects];

        subjects = Array.from(new Set(subjects));

        text = `update students set subjects[3]=$1 where student_id=$2`;
        value = [subjects, studentId];

        try{
            await pool.query(text, value);
        }catch(err){
            return res.status(200).json("could not add subjects");
        }
    }
    return res.status(200).json("Subjects added successfully");
}

const removeSubjectsFromStudent = async (req, res) => {
    let studentClass = req.body.selectedClass;
    let selectedSubjects = req.body.selectedSubjects;

    console.log(studentClass, selectedSubjects);
    let text = `select student_id, subjects[3] from students where student_class[3]=$1`;
    let value = [studentClass];

    let students
    try{
        students = await pool.query(text, value);
        students = students.rows;
        if(students.length < 1){
            return res.status(200).json("you have no students in " + studentClass);
        }
    }catch(err){
        console.log("err");
        return res.status(200).json("could not load class");
    }
    for(let student of students){
        let studentId = student.student_id;
        let subjects = student.subjects.replace(/{|}|"/g, "").split(",");
        subjects = subjects.filter( subject => !selectedSubjects.includes(subject));

        text = `update students set subjects[3]=$1 where student_id=$2`;
        value = [subjects, studentId];

        try{
            await pool.query(text, value);
        }catch(err){
            return res.status(200).json("could not remove subjects");
        }
    }
    return res.status(200).json("Subjects removed successfully");
}
let saveResultStudents = async (req, res) => {
    let allStudents = req.body.allStudents;
    let sect = 3; // req.body.section;
    let isFromResultPage = true; //req.body.isFromResultPage;

    let term = "firstTerm"; //req.body.term;
    let deduction = 0;

    if(term === "firstTerm"){
        deduction = 2;
    }else if(term === "secondTerm"){
        deduction = 1;
    }else if(term === "thirdTerm"){
        deduction = 0;
    }
    let numberOfStudents = allStudents.length;
    let isIslamiyya = req.body.isIslamiyya;
    let isPlayGroup = req.body.isPlayGroup;
    let isPrimary = req.body.isPrimary;
    let index = 0;
    for(let student of allStudents){
        let full_name = student.first_name + " " +
                        student.last_name + " " +
                        student.other_name;
        let form_teacher = student.form_teacher?student.form_teacher.join():",,";
        let text = `update students set 
            first_name=$1, last_name=$2, other_name=$3,
            student_class[${sect}]=$4, 
            comments[${(sect*3)-deduction}]=$5, 
            days_absent[${sect}]=$6,
            subjects[${sect}]=$7, 
            affective_traits=jsonb_set(affective_traits, '{${sect}}', $8), 
            psychomotor=jsonb_set(psychomotor, '{${sect}}', $9),
            form_teacher[${sect}]=$10,
            next_term_begins[${sect}]=$11,
            days_school_open[${sect}]=$12,

            full_name=$13
            `;
        let subjects = [];
        student.subjects = student.subjects && Array.isArray(student.subjects)?student.subjects:[];
        student.subjects.forEach((subj) => {
            if(subj.trim()){
                subjects.push(subj);
            }
        });
        let subjectString = `"{${subjects.join()}}"`;
        let islamiyyaSubjectString = ``;
        let value =[
                    student.first_name.replace(/'+/g,"''"), 
                    student.last_name.replace(/'+/g,"''"), 
                    student.other_name.replace(/'+/g,"''"), 
                    student.student_class, 
                    `"${student.comments.replace(/'+/g,"''")}"`, 
                    student.days_absent,
                    `{${subjectString}}`, 
                    `${JSON.stringify(student.affective_traits)}`, 
                    `${JSON.stringify(student.psychomotor)}`,
                    `"{${form_teacher.replace(/'+/g, "''")}}"`,
                    `${student.next_term_begins}`,
                    `${student.days_school_open}`,
                    `${full_name}`
                ];

        if(isFromResultPage){
            let j = 1;
            let subRec;
            let studSubs
            if(isPlayGroup){
                return res.status(200).json("play group");
            }else if(isIslamiyya){
                studSubs= student.islamiyya_subjects;
            }else{
                studSubs = student.subjects
            }
            if(studSubs && studSubs.length >0){
                studSubs = [...new Set(studSubs)];
                studSubs.forEach((subj, index)=>{
                    subRec = student[subj];
                    text += `,"${subj}"[${sect}]=$${13+j}`;
                    value.push(`${subRec.join()}`);
                    j++;
                });
            }   
        }
        text += ` where student_id=${student.student_id}`;
        try{
            const result = await pool.query(text, value);
        }catch(err){
            console.log(err);
            return res.status(200).json("Could not save students");
        }
    };
    return res.status(200).json("students saved");
}

module.exports = {
    putTeacherPic,
    loadSubjectStudents,
    saveSubjectTeacherStudents,
    addSubjectsToStudent,
    removeSubjectsFromStudent,
    saveResultStudents
}