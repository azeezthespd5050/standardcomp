
const mongoose = require('mongoose');

const TeacherClass = mongoose.Schema({
    teacherId: String,
    section: String,
    term: String,
    name: [String]
  });
  const TeacherSittingClass = mongoose.Schema({
    teacherId: String,
    section: String,
    term: String,
    name: String
  });
const teacherSchema = mongoose.Schema({
    teacherId: String,
    title: String,
    firstName: String,
    lastName: String,
    otherName: String,
    username: String,
    password: String,
    fullName: String,
    email: String,
    mobilNumber: String,
    image: String,
    url: String,
    s3key: String,
    teacherClasses: {type: Map, of: TeacherClass},
    teacherSittingClass: {type: Map, of: TeacherSittingClass}
  });

module.exports = mongoose.model("Teacher", teacherSchema);  