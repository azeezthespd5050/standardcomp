let studentsParam = {
    TableName: "intercontinentalstudents",
    studentId: "",
    "firstName": "",
    "lastName": "",
    "otherName": "",
    "fullName": "",
    "username": "",
    "password": "",
    "parentFirstName": "",
    "parentLastName": "",
    "parentUsername": "",
    "parentPassword": "",
    "adminNumber": "",
    "currentClass": "",
    "imageUrl": "",
    "nextTermBegins": {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    studentClass: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    subjects: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    formTeacher: {"2019/2020": {firstTerm:[""], secondTerm:[""], thirdTerm: [""]}},
    comments: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    daysAbsent: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    daysSchoolOpen: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    affectiveTraits: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    psychomotor: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    scores: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}},
    averages: {"2019/2020": {firstTerm:"", secondTerm:"", thirdTerm: ""}}
}

let teacherParam = {
    TableName: "intercontinentalstudents",
    teacherId: "",
    title: "",
    firstName: "",
    lastName: "",
    otherName: "",
    username: "",
    password: "",
    fullName: "",
    email: "",
    mobilNumber: "",
    imageUrl: "",
    teacherClasses: {"2019/2020": {firstTerm:[""], secondTerm:[""], thirdTerm: [""]}},
    teacherSittingClass: {"2019/2020": {firstTerm:[""], secondTerm:[""], thirdTerm: [""]}},
  };

  const studentSetup = async (req, res) => {
    
    // Set the parameters
    const params = {
      TableName: "intercontinentalstudents",
      Item: {
        studentClass: {"2019/2020": {firstTerm: "", secondTerm:"", thirdTerm: ""}},
        subjects: {"2019/2020": {firstTerm: [""], secondTerm:[""], thirdTerm: [""]}}
      }
    };

    let text = `select student_id,first_name, last_name, other_name, full_name, 
    student_class[2], subjects[2] from students`;

    let students = await pool.query(text);
    students = students.rows;
    let length = students.length;

    students.forEach( async (student, index) => {
      if( (student.student_class !== 'resume') && !(/^ss3/.test(student.student_class))){
        let subjects;
        if(student && student.subjects){
          subjects = student.subjects.replace(/{|}|"/g, "").split(",");
        }else{
          subjects = [""];
        }
        params.Item["studentId"]= student.student_id;
        params.Item["firstName"]= student.first_name;
        params.Item["lastName"]= student.last_name;
        params.Item["otherName"]= student.other_name;
        params.Item["fullName"]= student.full_name;
        params.Item["currentClass"]= student.student_class;
        params.Item["studentClass"]["2019/2020"].firstTerm= student.student_class;
        params.Item["studentClass"]["2019/2020"].secondTerm= student.student_class;
        params.Item["studentClass"]["2019/2020"].thirdTerm= student.student_class;
  
        params.Item["subjects"]["2019/2020"].firstTerm= subjects;
        params.Item["subjects"]["2019/2020"].secondTerm= subjects;
        params.Item["subjects"]["2019/2020"].thirdTerm= subjects;
        
        try{
          const data = await ddbDocClient.send(new PutCommand(params));
          console.log("studen");
        } catch(err){
          console.log("err", err);
          return res.json("error");
        }
        if((index+1) === length){
          return res.json({});
        }
      }
    });
}

  module.exports = {
      studentsParam,
      teacherParam
  }