const express = require('express');
const router = express.Router();


const ctrlHomePage = require('../controllers/homePage');
const ctrlLogin = require('../controllers/loginForm');
const ctrlTeacher = require('../controllers/teacher');
const ctrlStudentSetup = require('../controllers/studentSetup');
const ctrlStudent = require('../controllers/student');  
const ctrlAdmin = require('../controllers/admin');
const ctrlSchool = require('../controllers/school');

/* School Home pages */
router.get('/', ctrlHomePage.homePage);
router.post('/studentsetup', ctrlStudentSetup.studentSetup);
router.post('/student/:id/loadsubjectteacherstudents', ctrlStudent.loadSubjectStudents);
router.post('/student/:id/savesubjectteacherstudents', ctrlStudent.saveSubjectTeacherStudents);
router.post('/student/:id/addsubjects', ctrlStudent.addSubjectsToStudent);
router.post('/student/:id/removesubjects', ctrlStudent.removeSubjectsFromStudent);
router.post('/student/1/resultstudents', ctrlStudent.saveResultStudents);

/* Teacher Pages */
router.post('/teacher',  ctrlTeacher.teacher);
router.put('/teacher/:id/putpicture', ctrlTeacher.putTeacherPic);
router.post('/teacher/:id/loadstudents', ctrlTeacher.loadStudents);
router.post('/teacher/:id/assignsubject', ctrlTeacher.assignSubject);
router.post('/teacher/:id/removesubject', ctrlTeacher.removeSubject);
router.post('/teacher/:id/updatemainteacher', ctrlTeacher.updateMainTeacher);
router.post('/teacher/:id/updateformteacherstudents', ctrlTeacher.updateFormTeacherStudents);

router.post('/teacher/1/loadallstudents', ctrlTeacher.loadAllStudents);

router.post('/admin/:id/updateteacher', ctrlAdmin.updateTeacher);
router.post('/admin/:id/deleteteacher', ctrlAdmin.deleteTeacher);
router.post('/admin/:id/createteacher', ctrlAdmin.createTeacher);
router.post('/admin/10/createstudent', ctrlAdmin.createStudent);

router.put('/student/:id/putpicture', ctrlStudent.putTeacherPic);

router.put('/school/:id/putpicture', ctrlSchool.putSchoolPic);

module.exports = router;