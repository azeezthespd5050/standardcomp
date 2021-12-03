let docBut = document.getElementById("formTeacherButton");
let teacherLink = document.getElementById("teacherLink");
let documentContainer = document.getElementById("documentContainer");
let teacherLoginFormButton;
let teacherLoginForm;
let teacher;
let teacherDisplay;
let myModal = null;
let myModalContent = null;
let myFormModal = null;
let myFormModalContent = null;
let myDocsModal = null;
let myAdminModal = null

let newClassSelected = "";
let newClassSubjectSelected = [];
let newSubjectsSelected = [];

let displayInfo = document.getElementById("message");
let schoolSubjectsObject = JSON.parse(document.getElementById("schoolSubjects").getAttribute("data-schoolSubjects"));
let schoolClassesObject = JSON.parse(document.getElementById("schoolClasses").getAttribute("data-schoolClasses"));

let selectedSchoolSector = "jss";
let schoolClasses = schoolClassesObject[selectedSchoolSector+ " classes"];
let schoolSubjects = schoolSubjectsObject[selectedSchoolSector + " subjects"];

schoolClasses = Array.from(new Set(schoolClasses));
schoolSubjects = Array.from(new Set(schoolSubjects));

let schoolSectors = Object.keys(schoolClassesObject);
schoolSectors = schoolSectors.filter(val => val !== 'id');

(function() {
  teacherDisplay = document.getElementById("teacherDisplay");
  teacherLink = document.getElementById("teacherLink");
  documentContainer = document.getElementById("documentContainer");
  myModal = document.getElementById("myModal");
  myModalContent = document.getElementById("myModalContent");
  myDocsModal = document.getElementById("docsModal");
  
  myFormModal = document.getElementById("myFormModal");
  
  myAdminModal = document.getElementById("adminModal");

// When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == myAdminModal) {
      myAdminModal.style.display = "none";
    }else if (event.target == myModal) {
      myModal.style.display = "none";
    }else if (event.target == myFormModal) {
      myFormModal.style.display = "none";
    }else if (event.target == myDocsModal) {
      myDocsModal.style.display = "none";
    }
  }

})();

function loginTeacher(){

  let displayError = document.getElementById("loginFormErrorDisplay");
  displayError.innerHTML = "";
  displayError.style.display = 'none'
  myFormModal.style.display = 'block';
}
function logoutTeacher(){
  localStorage.removeItem("teacher");
  documentContainer.innerHTML = "";

  let displayError = document.getElementById("loginFormErrorDisplay");
  displayError.innerHTML = "please Login";
  displayError.style.display = 'block'
  myFormModal.style.display = 'block';
}

function teacherLinkClicked(evnt){
  evnt.preventDefault()
  teacher = JSON.parse(localStorage.getItem("teacher"));
  if(teacher){
    let formData = {
      username: teacher.username,
      password: teacher.password
    };
    displayInfo.style.backgroundColor = '#ff0000';
    displayInfo.innerHTML = "please wait loging..."
    myModalContent.innerHTML = "please wait loading..."
    myModal.style.display = 'block';
    postData('/teacher', 'POST',formData).then((html) => {
      documentContainer.innerHTML = html;
      myModalContent.innerHTML = "Teacher page loaded";
      displayInfo.innerHTML = "Teacher page loaded";
      let elem = document.getElementById("dataDiv");
      teacher = JSON.parse(elem.getAttribute("data-teacher"));
      if(teacher.isAdmin){
        teacher.form_teacher = classesToUse;
      }
      displayInfo.style.backgroundColor = '';
      myModal.style.display = 'none';
    })
  }else {
    myFormModal.style.display = 'block';
  }
}

function teacherLoginFormClicked(evt){
  evt.preventDefault();

  teacherLoginForm = document.getElementById("teacherLoginForm");
  const teacherLoginFormData = new FormData(teacherLoginForm);
  let formData = {};
  
  for(let [key, value] of teacherLoginFormData.entries()){
    formData[key] = value;
  }
  displayInfo.innerHTML = "Loading Teacher...";
  displayInfo.style.backgroundColor = '#ff0000';
  postData('/teacher', 'POST', formData).then((html) => {
    
    if(html.indexOf("<") !== -1){
      documentContainer.innerHTML = html;
      let elem = document.getElementById("dataDiv");
      teacher = JSON.parse(elem.getAttribute("data-teacher"));
      //console.log(teacher);
      if(teacher.isAdmin){
        teacher.form_teacher = classesToUse;
        console.log("uclass", classesToUse);
      }
      localStorage.removeItem("teacher")
      localStorage.setItem("teacher", JSON.stringify(teacher));
      displayInfo.innerHTML = "Teacher page loaded";
      displayInfo.style.backgroundColor = '';

      myFormModal.style.display = 'none';

    }else{
      let result = JSON.parse(html)
      if(result && result.error){
        let displayError = document.getElementById("loginFormErrorDisplay");
        displayError.innerHTML = result.errorMessage;
        displayError.style.display = 'block'
        myFormModal.style.display = 'none';
        myFormModal.style.display = 'block';
      }else{
      }
    }
    
  });
}

function  caChanged(event){
  saveSectionTermFormData();
}

function  sectionChanged(event){
  saveSectionTermFormData();
}

function  termChanged(event){
  saveSectionTermFormData();
}
function saveSectionTermFormData(){
  let formElem = document.getElementById("sectionTermForm");
  let formData = new FormData(formElem);
  let localFormData = {};
  for(let [key, value] of formData.entries()){
    localFormData[key] = value;
  }
  localStorage.setItem("sectionTermFormData", JSON.stringify(localFormData));
}

function subjectTeacherClassChanged(event){
  let form = event.target.form
  let formData = new FormData(form);
  let data= {};
  for(let [key, value] of formData.entries()){
    data[key] = value
  }
  let studentClass = data["selectedSubjectTeacherClass"].split("(")[0].trim();
  let subject = data["selectedSubjectTeacherClass"].split("(")[1].trim();
  subject = subject.replace(/\)/g, "");

  displayInfo.innerHTML = "Loading students...";
  displayInfo.style.backgroundColor = '#ff0000';
  myModalContent.innerHTML = "Loading students...";
  myModal.style.display = 'block';

  data = {...data, ...{studentClass: studentClass, subject: subject}};
  postData(`student/${teacher.teacher_id}/loadsubjectteacherstudents`, 'POST', data).then((students)=>{
    teacherDisplay = document.getElementById("teacherDisplay");
    if(students !== '[]'){
      teacherDisplay.innerHTML = students;
      let subjectTeacherStudentsDiv = Array.from(document.getElementsByClassName('subjectTeacherStudentsDiv'));
      let subjectTeacherStudents = [];
      subjectTeacherStudentsDiv.forEach( div => {
        let student = JSON.parse(div.getAttribute('data-subject-teacher-student'));
        subjectTeacherStudents.push(student);
      });
      //localStorage.setItem("subjectTeacherStudents", JSON.stringify(subjectTeacherStudents));
      window[`${studentClass}_${subject}`] = subjectTeacherStudents;

      docBut.innerHTML = `<button onclick="saveSubjectTeacherStudents(event, '${studentClass}_${subject}')" class="w3-large">Update Scores</button>`
      
      displayInfo.innerHTML = "Students loaded";
      displayInfo.style.backgroundColor = '';
      myModalContent.innerHTML = "Students loaded";
      //myModal.style.display = 'none';
    }else{
      myModalContent.innerHTML = "You have no students is " + studentClass;
    }
  })
}

function saveSubjectTeacherStudents(event, data){
  let classAndSubject;
  let subjectTeacherStudents
  let studentClass;
  let subject;
  let allStudents = [];
  
  let formData = {};
  if(!parseInt(data)){
    studentClass = data.split("_")[0];
    subject = data.split("_")[1]
    subjectTeacherStudents = window[data];
    allStudents = subjectTeacherStudents;
  }else{
    let dataAttr = JSON.parse(event.target.getAttribute('data-classSubject'))
    studentClass = dataAttr.studentClass;
    subject = dataAttr.subject;
    let studentData = JSON.parse(data);
    let studentToSave;
    subjectTeacherStudents = window[`${studentClass}_${subject}`];
    if(typeof(studentData) === 'number'){
      let studentId = data
      subjectTeacherStudents.forEach((student, index) => {
            
        if(parseInt(student.student_id) === parseInt(studentId)){
          studentToSave = student;
          return
        }
      });
      studentToSave = studentToSave;
    }
    allStudents.push(studentToSave)
  }

  displayInfo.innerHTML = "Saving Students to database";
  displayInfo.style.backgroundColor = '#ff0000';

  myModalContent.innerHTML = "Saving Students to database";
  myModal.style.display = 'block';

  formData["students"] = allStudents
  postData(`student/${teacher.teacher_id}/savesubjectteacherstudents`, 'POST', formData).then((result)=>{
    let returnVal = JSON.parse(result)
    if(returnVal === 'save'){
      displayInfo.innerHTML = "Students saved";
      displayInfo.style.backgroundColor = '';

      myModalContent.innerHTML = "Students saved"
      myModal.style.display = 'block'
    }else{
      alert("Could not save student(s)");
    }
  });
}
function formTeacherClassChanged(event){
  let form = event.target.form
  let formData = new FormData(form);
  let data= {};
  for(let [key, value] of formData.entries()){
    data[key] = value
  }
  let studentClass = data["selectedFormTeacherClass"];
  if(studentClass.startsWith("jss")){
    schoolClasses = schoolClassesObject["jss classes"];
    schoolSubjects = schoolSubjectsObject["jss subjects"];
  }else if(studentClass.startsWith("ss")){
    schoolClasses = schoolClassesObject["ss classes"];
    schoolSubjects = schoolSubjectsObject["ss subjects"];
  }else if(studentClass.startsWith("primary")){
    schoolClasses = schoolClassesObject["primary classes"];
    schoolSubjects = schoolSubjectsObject["primary subjects"];
  }else if(studentClass.startsWith("nursery")){
    schoolClasses = schoolClassesObject["nursery classes"];
    schoolSubjects = schoolSubjectsObject["nursery subjects"];
  }else if(studentClass.startsWith("pre nursery")){
    schoolClasses = schoolClassesObject["pre nursery classes"];
    schoolSubjects = schoolSubjectsObject["pre nursery subjects"];
  }else if(studentClass.startsWith("play group")){
    schoolClasses = schoolClassesObject["play group classes"];
    schoolSubjects = schoolSubjectsObject["play group subjects"];
  }
  postData(`teacher/${teacher.teacher_id}/loadstudents`, 'POST', data).then((students)=>{
    teacherDisplay = document.getElementById("teacherDisplay");

    if(students.indexOf("<") !== -1){
      teacherDisplay.innerHTML = students;

      let printDocsButton = document.getElementById("printDocs").disabled = false;

      let formTeacherStudentsClassesDiv = document.getElementsByClassName("formTeacherStudentsClassesDiv");
      let formTeacherStudentsSubjectsDiv = document.getElementsByClassName("formTeacherStudentsSubjectsDiv");
      
      let returnStudents = teacherDisplay.querySelector("#numberOfStudents")
      returnStudents = returnStudents.getAttribute("data-formTeacherStudents");
      returnStudents = JSON.parse(returnStudents);
      window[`${studentClass}_formTeacherStudents`] = returnStudents;
      window["currentFormTeacherStudents"] = returnStudents
      localStorage.setItem(`${studentClass}_formTeacherStudents`, JSON.stringify(returnStudents));
      
      docBut.innerHTML = `<button onclick="updateFormTeacherStudentProfile(event, '${studentClass}')" class="w3-large">Update Students</button>`
    
      for(let div of formTeacherStudentsClassesDiv){
        let classHtml = `
          <label class="w3-text-brown"><b>Set Student Class</b></label>
          <select id="select_${div.id}"  name="formTeacherStudentClass" class="w3-select">`
            
          schoolClasses.forEach(clas => { 
              let selected = '';
              if(clas === studentClass){
                selected = 'selected'
              }
              classHtml +=`<option value="${clas}" ${selected}>${clas}</option>`;
          });
        classHtml += `</select>`;

        div.innerHTML = classHtml;
      }

      for(let div of formTeacherStudentsSubjectsDiv){
        let subjectHtml = `
          <label class="w3-text-brown"><b>Set Student Subjects</b></label>
          <select id="select_${div.id}" name="selectedFormTeacherSubjects" class="w3-select" multiple>`;
            
            schoolSubjects.forEach(subs => {
               selected ='';
               let subjects = JSON.parse(div.getAttribute("data-subjects"));
               if( subjects.includes(subs)){
                 selected = 'selected'
               }
              subjectHtml +=`<option value="${subs}" ${selected}>${subs}</option>`;
          });
        subjectHtml += `</select>`;
        div.innerHTML = subjectHtml;
      }
      myModal.style.display = 'none';
    }else {
      myModalContent.innerHTML = "There no students in " + data["selectedFormTeacherClass"];
    }
  })
}

function assignClassSubjectToTeacher(event){
  myModal.style.display = 'none';
  if(!newClassSelected){
    myModalContent.innerHTML = "Class must be selected";
    myModal.style.display = 'block';
    return;
  }
  if(newSubjectsSelected.length  <  1){
    myModalContent.innerHTML = "Subjects must be selected";
    myModal.style.display = 'block';
    return;
  }

  let studentClass = newClassSelected;
  let subjectToAssign = newSubjectsSelected.map((subj) => {
    return `${studentClass}(${subj})`;
  });
  let formData = {
    teacherId: teacher.teacher_id,
    subjectToAssign: subjectToAssign,
    subjects: newSubjectsSelected
  }
  
  postData(`teacher/${teacher.teacher_id}/assignsubject`, 'POST', formData).then((result)=>{
    let data = JSON.parse(result);
    let html ='';
    data.message.forEach((msg) => {
        html += `<p class="w3-panel">${msg}</p><br>`;
    });

    myModalContent.innerHTML = html;
    myModal.style.display = 'block';
    teacher.classes = [...teacher.classes, ...data.classes];
  })
}

function removeClassSubjectFromTeacher(event){
  myModal.style.display = 'none';

  if(newClassSubjectSelected.length  <  1){
    myModalContent.innerHTML = "Class/subject must be selected";
    myModal.style.display = 'block';
    return;
  }

  let classesToRemove = newClassSubjectSelected;
  let formData = {
    teacherId: teacher.teacher_id,
    subjectToRemove: classesToRemove
  }
  
  postData(`teacher/${teacher.teacher_id}/removesubject`, 'POST', formData).then((result)=>{
    let data = JSON.parse(result);
    let html ='';
    data.message.forEach((msg) => {
        html += `<p class="w3-panel">${msg}</p><br>`;
    });

    myModalContent.innerHTML = html;
    myModal.style.display = 'block';
    teacher.classes = teacher.classes.filter((cls) => !newClassSubjectSelected.includes(cls) );
    localStorage.setItem("teacher", JSON.stringify(teacher));
  })
}
function updateTeacherMainProfile(event){
  let formElm = event.target.form;
  let teacherProfileFormData = {teacher_id: teacher.teacher_id};
  let allInput = formElm.querySelectorAll("input");
  let titleSelect = formElm.querySelector("select").selectedOptions[0].value;
  teacherProfileFormData["title"]= titleSelect;
  allInput.forEach((input) => {
    teacherProfileFormData[input.name] = input.value;
  });
  postData(`teacher/${teacher.teacher_id}/updatemainteacher`, 'POST', teacherProfileFormData).then((teach)=>{
    myModalContent.innerHTML = "teach";
    myModal.style.display = 'block';
  })
}

function updateFormTeacherStudentProfile(event, id){
  let studentClass;
  let allStudents = [];
  if(!parseInt(id)){
    studentClass = id;
    let idArray = window[`${studentClass}_formTeacherStudents`].map((stud)=>{
      return stud.student_id;
    });
    idArray.forEach((studId) => {
      let formElm = document.getElementById("formTeacherStudentsForm_"+studId);
      
      let testData = {student_id: studId};
    
      allInput = formElm.querySelectorAll("input");
      for(let inp of allInput){
        testData[inp.name] = inp.value
      }
    
      let selectElems = formElm.querySelectorAll("select");
      for(let select of selectElems){
        sampleOb = {}
        let key = select.name;
        let vals = [];
        for(let optVal of select.selectedOptions){
          vals.push(optVal.value);
        }
        sampleOb[key] = vals
    
        testData = {...testData, ...sampleOb};
        testData = testData;
      }
      allStudents.push(testData)
    })

  }else {
    
    let formElm = event.target.form;
    let studentId = JSON.parse(id);
    let testData = {student_id: studentId};
  
    allInput = formElm.querySelectorAll("input");
    for(let inp of allInput){
      testData[inp.name] = inp.value
    }
  
    let selectElems = formElm.querySelectorAll("select");
    for(let select of selectElems){
      sampleOb = {}
      let key = select.name;
      let vals = [];
      for(let optVal of select.selectedOptions){
        vals.push(optVal.value);
      }
      sampleOb[key] = vals
  
      testData = {...testData, ...sampleOb};
      testData = testData;
    }
    allStudents.push(testData)
  }
  formData = {
    formTeacherStudents: allStudents
  }

  postData(`teacher/${teacher.teacher_id}/updateformteacherstudents`, 'POST', formData).then((result)=>{
    let data = JSON.parse(result);
    

    myModalContent.innerHTML = data.message;
    myModal.style.display = 'block';
  })
}

function schoolSectorChanged(event, from){
  for(let option of event.target.options){
    if(option.selected){
      selectedSchoolSector = option.value;
    }
  }
  
  schoolClasses = schoolClassesObject[selectedSchoolSector+ " classes"];
  schoolSubjects = schoolSubjectsObject[selectedSchoolSector+ " subjects"];

  if(from === 'fromAddClassSubjects'){

    let div = myModalContent.querySelector("#modelNewClassAndSubjects");
    let sumBut = myModalContent.querySelector("#modelNewClassAndSubjectsButton");
    
    let html = 
    `<label>Select Class</label>
        <select onchange="newClassSelectedByTeacher(event)" name="newClassSelected" class="w3-select">
        <option value="">Choose your option</option>
    `;

    schoolClasses.forEach((sect, index) => {
      let sec = sect.replace(/classes/, "").trim();
        html += `<option value="${sec}">${sec}</option>`;
    })

    html +=`</select><br><br><hr>

      <p class="w3-center w3-red">You can make multiple selections</p>
      <label>Select Subject(s)</label>
      <select onchange="newSubjectsSelectedByTeacher(event)" name="newSubjectsSelected" class="w3-select" size="4" multiple>
      <option value="">Choose your option</option>
    `;

    schoolSubjects.forEach((sect, index) => {
      let sec = sect.replace(/classes/, "").trim();
      html += `<option value="${sec}">${sec}</option>`;
    })
    html +=`</select><br>
    `;

    div.innerHTML = html;
    sumBut.disabled = false;
  }
}

function newClassSelectedByTeacher(event){
  for(let option of event.target.options){
    if(option.selected){
      newClassSelected = option.value;
    }
  }
}


function newSubjectsSelectedByTeacher(event){

  let selected = [];
  for(let option of event.target.options){
    if(option.selected){
      selected.push(option.value);
    }
  }
  newSubjectsSelected = selected;
  if(selected.length > 0){
    let sumBut = myModalContent.querySelector("#modelNewClassAndSubjectsButton");
    sumBut.disabled = false;
  }
}

function newClassSubjectsSelectedByTeacher(event){

  let selected = [];
  for(let option of event.target.options){
    if(option.selected){
      selected.push(option.value);
    }
  }
  newClassSubjectSelected = selected;
}

async function studentSetupClicked(event){
  postData('/studentsetup', 'POST', {}).then((data)=>{
    console.log(data);
  });
}
// Example POST method implementation:
async function postData(url = '', method = 'POST', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.text(); // parses JSON response into native JavaScript objects
}