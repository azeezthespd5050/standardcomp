
const pool = require('../models/pool');

const loadStudents = async (req, res) => {
    let selectedFormTeacherClass = req.body.selectedFormTeacherClass;
    let sect = 3;
    let term = 'firstTerm';
    let deduction = 0;

    if(term === "firstTerm"){
        deduction = 2;
    }else if(term === "secondTerm"){
        deduction = 1;
    }else if(term === "thirdTerm"){
        deduction = 0;
    }
    let formTeacherStudents =[];
    let studentClass = selectedFormTeacherClass;

    try{
        text = `select student_id, 
        form_teacher[${sect}], 
        comments[${(sect*3)-deduction}],
        parent_email, first_name, last_name, other_name, full_name,
        student_class[${sect}],
        subjects[${sect}],
        days_absent[${sect}], 
        next_term_begins,
        days_school_open,
        image_url,

        parent_first_name,
        parent_last_name,
        parent_password ,
        hall_number
        from students where student_class[${sect}]= '${studentClass}'`;
        let formTeacher;
        try {
            formTeacher = await pool.query(text);
        } catch (error) {
            console.log(error);
        }
        formTeacherStudents = formTeacher.rows;
        if(formTeacherStudents.length > 0){
            formTeacherStudents.forEach((student, index)=>{

                formTeacherStudents[index]._id = student.student_id;
                formTeacherStudents[index].parent_password = 
                    `${student.first_name.substring(0,3).toLowerCase()}_${student.student_id}_${student.last_name.substring(0,3).toLowerCase()}`;
                
                
                if(formTeacherStudents[index].subjects){
                    formTeacherStudents[index].subjects = formTeacherStudents[index].subjects.replace(/{|}|"/g, "").split(",");
                    formTeacherStudents[index].subjects = [...new Set(formTeacherStudents[index].subjects)];
                }else{
                    formTeacherStudents[index].subjects = [];
                }
                if(formTeacherStudents[index].comments){
                    formTeacherStudents[index].comments = formTeacherStudents[index].comments.replace(/"/g,"");
                }else{
                    formTeacherStudents[index].comments = "";
                }
                if(formTeacherStudents[index].days_absent){
                    formTeacherStudents[index].days_absent = formTeacherStudents[index].days_absent;
                }else{
                    formTeacherStudents[index].days_absent = '';
                }
                if(formTeacherStudents[index].student_class){
                    formTeacherStudents[index].student_class = formTeacherStudents[index].student_class;
                }else{
                    formTeacherStudents[index].student_class = studentClass;
                }
                if(formTeacherStudents[index].form_teacher){
                    formTeacherStudents[index].form_teacher = formTeacherStudents[index].form_teacher.replace(/{|}|"/g, "").split(",");
                }else{
                    formTeacherStudents[index].form_teacher = ["","",""];
                }
            });
            formTeacherStudents.sort((a, b)=>{
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
                    return 1;
                }
                return 0;
            });
            res.render("pages/formTeacherStudents", 
                {formTeacherStudents: formTeacherStudents}
                );
        }else{
            return res.status(200).json([]);
        }
    } catch(err){
        console.log("err", err);
    }
}

const putTeacherPic = async (req, res) => {
    let teacher_id = req.params.id;
    let image_url = req.body.image_url

    let text = `update teachers set image_url=$1 where teacher_id=$2`;
    let value = [image_url, teacher_id]
    let result = await pool.query(text, value);

    res.status(200).json(result.rows);
}
const teacher = async (req, res) => {
    /*
    */
    let username = req.body.username;
    let password = req.body.password;
    username = username.toLowerCase();
    if(username != '' &&  password != ""){
        let text = `select * from teachers where username=$1 and password=$2`;
        let value = [username, password];

        let teacher = await pool.query(text, value);

        if(teacher.rows && teacher.rows.length < 1){
            return res.status(200).json({error: true, errorMessage: "Please check your Username/Password"})
        }else {
            teacher = teacher.rows[0];
            const regEx = RegExp('is/mth/008|admin');

            if(regEx.test(username)){
                teacher["isAdmin"] = true;
            }else{
                teacher["isAdmin"] = false;
            }
            if(teacher.isAdmin){
                text = `select * from teachers`;
                let allTeachers = await pool.query(text);
                allTeachers = allTeachers.rows;
                teacher["allTeachers"]= allTeachers
            }
            return res.render("pages/teacher", {
                teacher: teacher
            });
        }
    }
    return res.status(200).json({error: true, errorMessage: "Username/Password cannot be empty"});
};

const assignSubject = async (req, res) => {
    let teacherId = req.body.teacherId;
    let subjectToAssign = req.body.subjectToAssign;
    let subjects = req.body.subjects;
    let returnSubjects = req.body.subjectToAssign;
    let subjectAssigned = false;
    let text =  'select teacher_id, full_name, classes from teachers';
    let data = {
        message: [],
        alreadyAssigned: 0
    };

    let result =await pool.query(text);
    let teachers = result.rows;
    let teacherToUpdate = teachers.filter((teach) => parseInt(teach.teacher_id) === parseInt(teacherId) );
    teacherToUpdate = teacherToUpdate[0];

    subjectToAssign.forEach((subToAssign, subIndex) => {
        teachers.forEach((teacher) => {
            if(teacher.classes && teacher.classes.includes(subToAssign)){
                subjectAssigned = true;
                returnSubjects = returnSubjects.filter((val) => val !== subToAssign);
                let id = teacher.teacher_id;
                if(id === teacherId){
                    data.alreadyAssigned += 1;
                    data.message.push(subToAssign + " already assigned to you")
                }else{
                    data.alreadyAssigned += 1;
                    data.message.push(subToAssign + " already assigned to "+ teacher.full_name);
                }
            }

        })
    });

    data = {...data, ...{classes: returnSubjects}};
    if(returnSubjects && (returnSubjects.length > 0)){
        if(teacherToUpdate.classes){
            teacherToUpdate.classes = [...teacherToUpdate.classes, ...returnSubjects];
        }else{
            teacherToUpdate.classes = returnSubjects;
        }
        let text = `update teachers set classes=$1 where 
                teacher_id=$2`;
        let value = [teacherToUpdate.classes, teacherId];
        try {
            let result = pool.query(text, value);
            data.alreadyAssigned = false;
            data.message.push( returnSubjects.join(", ") + " assigned to you successfully");
            res.status(200).json(data);
        } catch (error) {
            data.message.push("could not assign " + subjectToAssign);
            console.log(error);
            res.status(200).json(data);
        }
    }else {
        res.status(200).json(data);
    }
}

const removeSubject = async (req, res)=> {
    let teacherId = req.body.teacherId;
    let subjectToRemove = req.body.subjectToRemove;
    let text = `select classes from teachers where teacher_id = $1`;
    let value = [teacherId];
    let data = {
        message: []
    }
    let classes;
    try{
        let teacher = await pool.query(text, value);
        teacher= teacher.rows[0];
        classes = teacher.classes.filter((cls) => !subjectToRemove.includes(cls));
    }catch(err){
        console.log("Error", err);
        data.message.push("Could not find teacher");
        return res.status(200).json(data);
    }
    text = `update teachers set classes=$1
                where teacher_id=$2`;
    value = [classes, teacherId];
    try {
        let result = await pool.query(text, value);
        data.message.push(subjectToRemove+" removed")
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json(data.message.push(subjectToRemove+ " could not be removed"));
    }
}

const updateFormTeacherStudents = async (req, res) => {
    let allStudents = req.body.formTeacherStudents;
    let sect = 3; //req.body.section;
    let isFromResultPage = false; //req.body.isFromResultPage;

    let term = "firstTerm"; // req.body.term;
    let deduction = 0;

    if(term === "firstTerm"){
        deduction = 2;
    }else if(term === "secondTerm"){
        deduction = 1;
    }else if(term === "thirdTerm"){
        deduction = 0;
    }
    
    for (let student of allStudents){
        let form_teacher = student.form_teacher?student.form_teacher.join():",,";
        let text = `update students set full_name=$1, first_name=$2, 
            last_name=$3, other_name=$4,
            student_class[${sect}]=$5, 
            subjects[${sect}]=$6
            `;
        let subjects = [];
        student.subjects = student.selectedFormTeacherSubjects && Array.isArray(student.selectedFormTeacherSubjects)?student.selectedFormTeacherSubjects:[];
        student.subjects.forEach((subj) => {
            if(subj.trim()){
                subjects.push(subj);
            }
        });
        let full_name = student.first_name.replace(/'+/g,"''") + " " +
        student.last_name.replace(/'+/g,"''")+ " " +
            student.other_name.replace(/'+/g,"''");
        let subjectString = `"{${subjects.join()}}"`;
        let islamiyyaSubjectString = ``;
        let value =[ full_name, 
            student.first_name.replace(/'+/g,"''"), 
                        student.last_name.replace(/'+/g,"''"), 
                    student.other_name.replace(/'+/g,"''"), 
                    student.formTeacherStudentClass[0], 
                    `{${subjectString}}`
                ];

        
        text += ` where student_id=${student.student_id}`;

        try{
            const result = await pool.query(text, value);
        }catch(err){
            console.log(err);
            return res.status(200).json("Could not save students");
        }
    };
    data = {message: "students saved"};
    return res.status(200).json(data);

}

const loadAllStudents = async (req, res) => {
    let studentClass = req.body.studentClass;
    let sect = 3; //req.body.sect;
    
    let term = req.body.term;
    let deduction = 0;

    if(term === "firstTerm"){
        deduction = 2;
    }else if(term === "secondTerm"){
        deduction = 1;
    }else if(term === "thirdTerm"){
        deduction = 0;
    }
    let subject_array = req.body.subject_array;
    if(studentClass.indexOf('nursery') !== -1 || studentClass.indexOf('play') !== -1){
        return res.status(200).json([]);
    }
    let searchClass = '';
    if(/^jss 1/.test(studentClass)){
        searchClass = 'jss 1';
    }else if(/^jss 2/.test(studentClass)){
        searchClass = 'jss 2';
    }else if(/^jss 3/.test(studentClass)){
        searchClass = 'jss 3';
    }else if(/^ss 1/.test(studentClass)){
        searchClass = 'ss 1';
    }else if(/^ss 2/.test(studentClass)){
        searchClass = 'ss 2';
    }else if(/^ss 3/.test(studentClass)){
        searchClass = 'ss 3';
    }else if(/^primary 1/.test(studentClass)){
        searchClass = 'primary 1';
    }else if(/^primary 2/.test(studentClass)){
        searchClass = 'primary 2';
    }else if(/^primary 3/.test(studentClass)){
        searchClass = 'primary 3';
    }else if(/^primary 4/.test(studentClass)){
        searchClass = 'primary 4';
    }else if(/^primary 5/.test(studentClass)){
        searchClass = 'primary 5';
    }else if(/^primary 6/.test(studentClass)){
        searchClass = 'primary 6';
    }else if(/^nursery 1/.test(studentClass)){
        searchClass = 'nursery 1';
    }else if(/^nursery 2/.test(studentClass)){
        searchClass = 'nursery 2';
    }else if(/^pre nursery/.test(studentClass)){
        searchClass = 'pre nursery';
    }else if(/^play group/.test(studentClass)){
        searchClass = 'play group';
    }
    
    let allSubjects;
    let traits_array = ["PUNCTUALITY","ATTENDANCE","RELIABILITY","NEATNESS","POLITENESS","HONESTY","RELATIONSHIP WITH STUDENTS","SELF CONTROL","ATTENTIVENESS","PERSEVERANCE"];
    let psycho_array = ["HANDWRITING","CLUB/SOCIETY","SPORTS AND GAMES","DRAWING & PAINTING","SPEECH FLUENCY","HOBBIES"];
    let subjects_text = '';
    
    subjects_text = `select subjects[${sect}] from students where student_class[${sect}] like '${searchClass}%'`;
    
    try {
        let subjects_result = await pool.query(subjects_text);
        allSubjects = subjects_result.rows;
    } catch (error) {
        console.log(error);
    }
    subject_array = new Set();
    let subs
    allSubjects.forEach((subject)=>{
        subs = subject.subjects?subject.subjects.replace(/{|}|"/g,"").split(","):[];
        
        for(let elem of subs){
            subject_array.add(elem);
        }
    });
    
    let text = `select student_id, affective_traits->'${sect}' as affective_traits, 
            psychomotor->'${sect}' as psychomotor, 
            form_teacher[${sect}], 
            comments[${(sect*3)-deduction}],
            parent_email,
            full_name,
            first_name, last_name, other_name,
            student_class[${sect}],
            subjects[${sect}],
            days_absent[${sect}],
            days_school_open[${sect}],
            next_term_begins[${sect}],
            image_url
            `;
    subject_array.forEach((subject)=>{
        if(subject !== ""){
            text += `,"${subject}"[${sect}]`
        }
    });
    text +=` from students where student_class[${sect}] like '${searchClass}%'`;
    
    let formTeacher = await pool.query(text);

    formTeacherStudents = formTeacher.rows;
    let fill;
    fill = 9;
    formTeacherStudents.forEach((student, index)=>{
        formTeacherStudents[index].full_name = `${student.first_name} ${student.last_name} ${student.other_name}`;
        
        formTeacherStudents[index]._id = student.student_id;
        formTeacherStudents[index].affective_traits = student.affective_traits;
        formTeacherStudents[index].psychomotor = student.psychomotor;
        formTeacherStudents[index].affective_traits_array = traits_array;
        formTeacherStudents[index].psychomotor_array = psycho_array;
        if(student.affective_traits){
            formTeacherStudents[index].affective_traits = student.affective_traits;
        }else{
            formTeacherStudents[index].affective_traits = {
                "PUNCTUALITY": '',
                "ATTENDANCE": '',
                "RELIABILITY": '',
                "NEATNESS": '',
                "POLITENESS": '',
                "HONESTY": '',
                "RELATIONSHIP WITH STUDENTS": '',
                "SELF CONTROL": '',
                "ATTENTIVENESS": '',
                "PERSEVERANCE": ''
            };
        }
        if(student.psychomotor){
            formTeacherStudents[index].psychomotor = student.psychomotor
        }else{
            formTeacherStudents[index].psychomotor = {
                "HANDWRITING": '',
                "CLUB/SOCIETY": '',
                "SPORTS AND GAMES": '',
                "DRAWING & PAINTING": '',
                "SPEECH FLUENCY": '',
                "HOBBIES": ''
            }
          
        }
        let subjects = [];

        if(formTeacherStudents[index].subjects && formTeacherStudents[index].subjects.length > 0){
            formTeacherStudents[index].subjects = formTeacherStudents[index].subjects.replace(/{|}|"/g, "").split(",");
            if(Array.isArray(formTeacherStudents[index].subjects) && formTeacherStudents[index].subjects.length >0){
                formTeacherStudents[index].subjects = [...new Set(formTeacherStudents[index].subjects)];
                formTeacherStudents[index].subjects.forEach((sub)=>{
                    subjects.push(sub);
                });
                formTeacherStudents[index].subjects = subjects;
                formTeacherStudents[index].subjects.forEach((studSub)=>{
                    formTeacherStudents[index][studSub] = student[studSub]?student[studSub].split(","):Array(fill).fill(""); 
                    if(formTeacherStudents[index][studSub].length < 9){
                        let len = formTeacherStudents[index][studSub].length;
                        for (let i = len; i < 9; i++){
                            formTeacherStudents[index][studSub].push("");
                        }
                    }
                    if(formTeacherStudents[index][studSub].length > 9){
                        formTeacherStudents[index][studSub] = 
                        formTeacherStudents[index][studSub].slice(0, 9);
                    }
                });
            }
        }
        if(formTeacherStudents[index].comments){
            formTeacherStudents[index].comments = formTeacherStudents[index].comments.replace(/"/g,"");
        }else{
            formTeacherStudents[index].comments = "";
        }
        if(formTeacherStudents[index].days_absent){
            formTeacherStudents[index].days_absent = formTeacherStudents[index].days_absent;
        }else{
            formTeacherStudents[index].days_absent = '';
        }
        if(formTeacherStudents[index].student_class){
            formTeacherStudents[index].student_class = formTeacherStudents[index].student_class;
        }else{
            formTeacherStudents[index].student_class = studentClass;
        }
        if(formTeacherStudents[index].form_teacher){
            formTeacherStudents[index].form_teacher = formTeacherStudents[index].form_teacher.replace(/{|}|"/g, "").split(",");
            
        }else{
            formTeacherStudents[index].form_teacher = ["","",""];
        }
    });
    formTeacherStudents.sort((a, b)=>{
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
            return 1;
        }
        return 0;
    });
    res.status(200).json(formTeacherStudents);
}
const updateMainTeacher = async (req, res) => {
    let teacher_id = req.body.teacher_id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let other_name = req.body.other_name;
    let title = req.body.title;
    let password = req.body.password;
    let mobile_number = req.body.mobile_number;
    let full_name = title + " " + first_name + " " + last_name + " " + other_name;

    let text = `update teachers set full_name=$1, title=$2, first_name=$3,
                last_name=$4, other_name=$5, password=$6, mobile_number=$7
                    where teacher_id=$8`;
    let value = [
      full_name, title, first_name, last_name, other_name, password,
      mobile_number, teacher_id  
    ];
    try{
        let teach = await pool.query(text, value);
        return res.status(200).json("Profile updated");
    }catch(err){
        console.log("err", err);
        return res.status(200).json("Could not update profile");
    }
}
const loadBroadsheetStudents = async (req, res) => {
    let studentClass = req.body.studentClass;
    let sect = 3; //req.body.sect;
    let term = req.body.term;
    let session = req.body.session;
    let caType = req.body.caType;
    let isNursery = false;

    if(studentClass.startsWith("nursery") || 
        studentClass.startsWith("pre nursery") || 
        studentClass.startsWith("play group") 
    ){
        isNursery = true;
        return res.status(200).json([]);
    }
    let isAverage;
    let offset;
    let end;
    if(term === 'firstTerm'){
        offset = 1;
        end = 3;
    }else if(term === 'secondTerm'){
        offset = 4;
        end = 6;
    }else if(term === 'thirdTerm'){
        offset = 7;
        end = 9;
    }
    
    let allSubjects;
    let subjects_text

    subjects_text = `select subjects[${sect}] from students where student_class[${sect}] 
                like '${studentClass}%'`;
    try {
        let subjects_result = await pool.query(subjects_text);
        allSubjects = subjects_result.rows;
    } catch (error) {
        console.log(error);
    }
    let subject_array = new Set();
    allSubjects.forEach((subject)=>{
        let subs = subject.subjects?subject.subjects.replace(/{|}|"/g,"").split(","):[];
        for(let elem of subs){
            subject_array.add(elem);
        }
    });
    subject_array = Array.from(subject_array);
    let text;

    text = `select student_id,first_name, last_name, other_name, student_class[${sect}], 
            subjects[${sect}]`;

    subject_array.forEach((subject)=>{
        if(subject !== ""){
            text += `,"${subject}"[${sect}]`;
        }
    });
    
    
    text +=` from students where student_class[${sect}] like '${studentClass}%'`;
    
    let formTeacher = await pool.query(text);

    formTeacherStudents = formTeacher.rows;
    let fill;
    
    fill = 3;
    formTeacherStudents.forEach((student, index)=>{
        formTeacherStudents[index].full_name = `${student.first_name} ${student.last_name} ${student.other_name}`;
        
        formTeacherStudents[index]._id = student.student_id;

        if(formTeacherStudents[index].subjects){
            formTeacherStudents[index].subjects = formTeacherStudents[index].subjects.replace(/{|}|"/g, "").split(",");
            if(Array.isArray(formTeacherStudents[index].subjects) && formTeacherStudents[index].subjects.length >0){
                formTeacherStudents[index].subjects = [...new Set(formTeacherStudents[index].subjects)];
                formTeacherStudents[index].subjects.forEach((studSub)=>{
                    if(isAverage){
                        formTeacherStudents[index][studSub] = student[studSub]?student[studSub].split(","):Array(fill).fill("");
                    }else{
                        formTeacherStudents[index][studSub] = (student[studSub]?student[studSub].split(","):Array(fill).fill("")).slice(offset-1, end);
                    }
                });
            }
        }

        if(formTeacherStudents[index].student_class){
            formTeacherStudents[index].student_class = formTeacherStudents[index].student_class;
        }else{
            formTeacherStudents[index].student_class = studentClass;
        }
    });
    formTeacherStudents.sort((a, b)=>{
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
            return 1;
        }
        return 0;
    });
    res.status(200).json(formTeacherStudents);
}
module.exports = {
    teacher,
    putTeacherPic,
    loadStudents,
    assignSubject,
    removeSubject,
    updateFormTeacherStudents,
    loadAllStudents,
    updateMainTeacher
}