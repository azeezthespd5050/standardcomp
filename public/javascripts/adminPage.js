var allTeachers;
var selectedTeachers;
var departmentArray = ["Primary", "Pre Nursery", "Nursery", "Art", "Commercial", "English", "Mathematics","Admin", "Science"];

var newTeacher = {};

var classesToUse = [...schoolClassesObject["jss classes"], 
        ...schoolClassesObject["ss classes"],
        ...schoolClassesObject["primary classes"],
        ...schoolClassesObject["play group classes"],
        ...schoolClassesObject["nursery classes"],
        ...schoolClassesObject["pre nursery classes"],
    ];
var subjectsToUse = [...schoolSubjectsObject["jss subjects"], 
        ...schoolSubjectsObject["ss subjects"],
        ...schoolSubjectsObject["primary subjects"],
        ...schoolSubjectsObject["play group subjects"],
        ...schoolSubjectsObject["nursery subjects"],
        ...schoolSubjectsObject["pre nursery subjects"]
    ];
classesToUse.sort();
subjectsToUse.sort();
subjectsToUse = Array.from(new Set(subjectsToUse));
classesToUse = Array.from(new Set(classesToUse));
function getEditTeacherString(){
    allTeachers = teacher.allTeachers;
    let editTeacherString = `
    <div class="form-group row">       
        <div class="form-group row">
            <h3 class="col-md-8">Select Department:</h3>
            <div class="col-md-6">
                <select id='selectedDepartment' onchange="departmentChangedFromAdmin(event)" name="department" class="form-control">
                    <option value="">Choose department</option>`;
                    for(let depart of departmentArray){
                        editTeacherString +=`<option value="${depart}">${depart}</option>`;
                    }
                editTeacherString +=`</select>
            </div>
        </div>
    </div><br>

    <div id=selectedTeachers class="form-group row">

    </div>

    <div id=selectedTeacher class="form-group row">

    </div>
    `;
return editTeacherString;    
}

function departmentChangedFromAdmin(event) {
    let select = event.target.selectedOptions[0]
    let allTeachers = teacher.allTeachers;
    openTeachers = false;
    let integerPart;
    let searchKey;
    let depart = select.value;
    let username = 'stand/'
    if(depart === 'Art'){
      username +='art/'
      searchKey = 'art';
    }else if(depart === 'Commercial'){
      username += 'bus/';
      searchKey = 'bus';
    }else if(depart === 'English'){
      username += 'eng/';
      searchKey = 'eng';
    }else if(depart === 'Mathematics'){
      username += 'mth/';
      searchKey = 'mth';
    }else if(depart === 'Science'){
      username += 'sci/';
      searchKey = 'sci';
    }else if(depart === 'Primary'){
      username += 'prim/';
      searchKey = 'prim';
    }else if(depart === 'Pre Nursery'){
      username += 'pre/';
      searchKey = 'pre';
    }else if(depart === 'Nursery'){
      username += 'nurs/';
      searchKey = 'nurs';
    }else if(depart === 'Admin'){
      username += 'admin/';
      searchKey = 'admin';
    }
    let teacherArray = [];

    allTeachers.forEach((elem, index) => {
      let test = elem.username.split("/")[1];
      if(test === searchKey){
        teacherArray.push(elem);
      }
    });
    teacherArray.sort((a, b)=>{
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
    selectedTeachers = teacherArray;

    let strnHtml = `

    <div class="col-12 col-md-8">
        <h3 class="col-md-8">Select Teacher:</h3>
        <select onchange="openTeacherForm(event)"  id="selectedDepartment">
            <option value="">--Select Teacher--</option>`;
            for(let teacher of selectedTeachers){
                strnHtml +=`<option value="${teacher.teacher_id}">${teacher.full_name}</option>`
            };
            strnHtml +=`</select>
    </div>`;

    let selectedTeachersElem = document.getElementById('selectedTeachers');
    selectedTeachersElem.innerHTML = strnHtml;
}

function openTeacherForm(event){
    let teacherId = parseInt(event.target.selectedOptions[0].value);
    let selectedTeacher = selectedTeachers.filter( teacher => teacher.teacher_id === teacherId)
    selectedTeacher = selectedTeacher[0];

    
    classesToUse.sort();
    subjectsToUse.sort();
    let strHtml = `
    <br>
    <form id='teacherForm_${selectedTeacher.teacher_id}'>
        <h4>${selectedTeacher.full_name}</h4>
        <div class="form-group row">
            <label for="address" class="col-sm-5 col-form-label">Title:</label>
            <div class="col-sm-7">
                <select  name="title" class="form-control">
                    <option value="">Select</option>`
                    let titleArray =['Mal.', 'Mr', 'Mrs', 'Miss'];
                    for(let title of titleArray){
                        let selt = '';
                        if(selectedTeacher.title === title){
                            selt = 'selected'
                        }
                        strHtml +=`<option vlaue="${title}" ${selt}>${title}</option>`;
                    }
                    strHtml +=`</select>
            </div>
        </div>
        <div class="form-group row">
            <label for="first_name" class="col-sm-5 col-form-label">First name:</label>
            <div class="col-sm-7">
                <input value="${selectedTeacher.first_name}" id="first_name" name="first_name" required="required" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="last_name" class="col-sm-5 col-form-label">Last name:</label>
            <div class="col-sm-7">
                <input value="${selectedTeacher.last_name}" id="last_name" name="last_name" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="other_name" class="col-sm-5 col-form-label">Other name:</label>
            <div class="col-sm-7">
                <input value="${selectedTeacher.other_name?selectedTeacher.other_name:''}" id="other_name" name="other_name" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="username" class="col-sm-5 col-form-label">Username:</label>
            <div class="col-sm-7">
                <input value="${selectedTeacher.username}" id="username" name="username" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="form_teacher" class="col-sm-5 col-form-label">Sitting Class:</label>
            <div class="col-sm-7">
                <select id="form_teacher" name="form_teacher" class="form-control" multiple size="3>`;
                
                for(let cls of classesToUse){
                    let selected = '';
                    if(selectedTeacher.form_teacher && selectedTeacher.form_teacher.includes(cls)){
                        selected = 'selected';
                    }
                    strHtml +=`<option value="${cls}" ${selected}>${cls}</option>`;
                }
                strHtml +=`
                </select>
            </div>
        </div>
        <div class="form-group row">
            <label for="classes" class="col-sm-5 col-form-label">Classes:</label>
            <div class="col-sm-7">
                <select id="classes" name="classes" class="form-control" multiple>`;
                if(selectedTeacher.classes){
                    for(let cls of selectedTeacher.classes){
                        strHtml += `<option value="${cls}" selected>${cls}</option>`;
                    }
                }
                strHtml +=`</select>
            </div>
        </div>
        
        <div class="form-group row">
            <label for="password" class="col-sm-5 col-form-label">Password:</label>
            <div class="col-sm-7">
                <input type="text" value="${selectedTeacher.password}" id="password" name="password" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <div class="col-12">
                <button onclick="updateTeacherProfile(event)" type="button" class="btn btn-primary float-right" 
                style="margin-left: 15px;">Submit</button>
            </div>
            <div class="col-12">
                <button id="${selectedTeacher.teacher_id}" onclick="deleteTeacher(event)" type="button" class="btn float-right">Delete Teacher</button>
            </div>
        </div>
        <hr>
    </form>
`;

let selectedTeacherElem = document.getElementById("selectedTeacher");
selectedTeacherElem.innerHTML = strHtml;
}

function updateTeacherProfile(event){
    event.preventDefault();
    let formElem = event.target.form;
    let teacherId = parseInt(formElem.id.split("_")[1])
    let teacherToUpdate = {
        teacher_id: teacherId
    };
    formElem.querySelectorAll('input').forEach((inputElem) => {
        teacherToUpdate[inputElem.name] = inputElem.value;
    });

    formElem.querySelectorAll("select").forEach((select) => {
        let arr = [];
        for(let option of select.selectedOptions){
            arr.push(option.value);
        }
        teacherToUpdate[select.name] = arr;
    });
    
    teacherToUpdate["title"] = teacherToUpdate["title"][0];
    let formData = {
        teacherToUpdate: teacherToUpdate
    }
    postData(`admin/${teacherToUpdate.teacher_id}/updateteacher`, 'POST', formData).then((result)=>{
        console.log(result)
        myAdminModal.style.display = 'none';
        myModalContent.innerHTML = result;
        myModal.style.display = 'block'
    });

}

function  deleteTeacher(event){
    event.preventDefault();
    let teacherId = parseInt(event.target.form.id.split("_")[1]);

    let formData = {
        teacher_id: teacherId
    }
    postData(`admin/${teacherId}/deleteteacher`, 'POST', formData).then((result)=>{
        console.log(result)
        myAdminModal.style.display = 'none';
        myModalContent.innerHTML = result;
        myModal.style.display = 'block'
    });
}
function getAddTeacherString(){
    let teachString = `
    <div>
        <form id="newTeacher">
            <h4>New Teacher Form</h4>
            <div class="form-group row">
                <label for="title" class="col-sm-5 col-form-label">Title:</label>
                <div class="col-sm-7">
                    <select name="title" class="form-control">
                        <option value="">Select</option>`;
                        let arr = ['Mal.', 'Mr', 'Mrs', 'Miss'];
                        for(let ar of arr){
                            teachString += ` <option value="${ar}">${ar}</option>`;
                        }
                    teachString +=`</select>
                </div>
            </div>
            <div class="form-group row">
                <label for="first_name" class="col-sm-5 col-form-label">First name:</label>
                <div class="col-sm-7">
                    <input id="createdTeacherFirstName" name="first_name" class="form-control">
                </div>
            </div>
            <div class="form-group row">
                <label for="last_name" class="col-sm-5 col-form-label">Last name:</label>
                <div class="col-sm-7">
                    <input id="last_name" name="last_name" required="required" class="form-control">
                </div>
            </div>
            <div class="form-group row">
                <label for="other_name" class="col-sm-5 col-form-label">Other name:</label>
                <div class="col-sm-7">
                    <input id="other_name" name="other_name" class="form-control">
                </div>
            </div>
            <div class="form-group row">
                <label for="password" class="col-sm-5 col-form-label">Password:</label>
                <div class="col-sm-7">
                    <input type="text" value="albayyinah" id="password" name="password" required="required" class="form-control" placeholder="intercontinental">
                </div>
            </div>
            <div class="form-group row">
                <label for="department" class="col-sm-5 col-form-label">Select Department:</label>
                <div class="col-sm-7">
                    <select onchange="departmentChangedForAddTeacher(event)" name="department" class="form-control">
                    
                    <option value="">Choose Department</option>`;
                    departmentArray.forEach((depart) => {
                        teachString +=`<option value="${depart}">${depart}</option>`;
                    });
                    teachString +=`</select>
                </div>
            </div>
            <div class="form-group row">
                <label for="username" class="col-sm-5 col-form-label">Username:</label>
                <div class="col-sm-7">
                    <input disabled id="username" name="username" required="required" class="form-control">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-12">
                    <button onclick="createdNewTeacher(event)" type="button" id="submitButton" disabled="disabled" class="btn btn-primary float-right" 
                    style="margin-left: 15px;">Submit</button>
                </div>
            </div>
            <hr>
        </form>
    </div>
    `;

    return teachString;
}

function departmentChangedForAddTeacher(event){
    let select = event.target.selectedOptions[0]
    let allTeachers = teacher.allTeachers;
    openTeachers = false;
    let integerPart;
    let searchKey;
    let depart = select.value;
    let username = 'abts/'
    if(depart === 'Art'){
      username +='art/'
      searchKey = 'art';
    }else if(depart === 'Commercial'){
      username += 'bus/';
      searchKey = 'bus';
    }else if(depart === 'English'){
      username += 'eng/';
      searchKey = 'eng';
    }else if(depart === 'Mathematics'){
      username += 'mth/';
      searchKey = 'mth';
    }else if(depart === 'Science'){
      username += 'sci/';
      searchKey = 'sci';
    }else if(depart === 'Basic'){
      username += 'basic/';
      searchKey = 'basic';
    }else if(depart === 'Pre Basic'){
      username += 'pre/';
      searchKey = 'nurs';
    }else if(depart === 'Nursery'){
      username += 'nurs/';
      searchKey = 'nurs';
    }else if(depart === 'Admin'){
      username += 'admin/';
      searchKey = 'admin';
    }
    let teacherUsernameArray = [];

    allTeachers.forEach((elem, index) => {
        let userSplit = elem.username.split("/");
        let test = userSplit[1];
         if(test === searchKey){
            if(userSplit[2].length === 2){
                userSplit[2] = `0${userSplit[2]}`;
            }else if(userSplit[2].length === 1){
                userSplit[2] = `00${userSplit[2]}`;
            }
            elem.username = userSplit.join("/");
            teacherUsernameArray.push(elem.username.toLowerCase());
        }
    });
    teacherUsernameArray.sort();
    let formElem = event.target.form;
    let usernameInput = formElem.querySelector("#username");
    let submitBut = formElem.querySelector("#submitButton");
    let toAdd
    if(teacherUsernameArray && teacherUsernameArray.length > 0){
        let testUsername = teacherUsernameArray[teacherUsernameArray.length -1];
        toAdd = parseInt(testUsername.split("/")[2])+1;

        toAdd = (toAdd < 10) ? `00${toAdd}`:(toAdd < 100)?`0${toAdd}`:`${toAdd}`
    }
    username +=toAdd;
    usernameInput.value = username;
    submitBut.disabled = false;
    let allInput = formElem.querySelectorAll("input");
    let titleSelect = formElem.querySelector("select")
    newTeacher[titleSelect.name] = titleSelect.selectedOptions[0].value;
    allInput.forEach((input)=>{
        newTeacher[input.name]= input.value;
    });
}
function createdNewTeacher(event){
    event.preventDefault();

    newTeacher["full_name"] = newTeacher["first_name"] + " " + newTeacher["last_name"] + " " +
                newTeacher["other_name"];

    newTeacher["full_name"] = newTeacher['full_name'].trim();

    let formData = {
        newTeacher: newTeacher
    }

    postData(`admin/10/createteacher`, 'POST', formData).then((result)=>{
        console.log(result);
        myAdminModal.style.display = 'none';
        myModalContent.innerHTML = result;
        myModal.style.display = 'block'
    });
}

function getAddStudentString(){
    let studString = `
<div class="row col-12">
    <form id="newStudentForm">
        <h4>New Student Form</h4>
        <div class="form-group row">
            <label for="student_class" class="col-sm-5 col-form-label">Student class:</label>
            <div class="col-sm-7">
                <select name="student_class" required="required" class="form-control">
                    <option value="">Select</option>`;
                    if(teacher.isAdmin){
                        for(let cls of classesToUse){
                            studString += `<option value="${cls}">${cls}</option>`;
                        }
                    }else{
                        for(let cls of teacher.form_teacher){
                            studString += `<option value="${cls}">${cls}</option>`;
                        }
                    }
                studString += `</select>
            </div>
        </div>
        <div class="form-group row">
            <label for="first_name" class="col-sm-5 col-form-label">First name:</label>
            <div class="col-sm-7">
                <input  id="first_name" name="first_name" required="required" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="last_name" class="col-sm-5 col-form-label">Last name:</label>
            <div class="col-sm-7">
                <input  id="last_name" name="last_name" required="required" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="other_name" class="col-sm-5 col-form-label">Other name:</label>
            <div class="col-sm-7">
                <input  id="other_name" name="other_name" class="form-control">
            </div>
        </div>
        <div class="form-group row">
            <label for="subjects" class="col-sm-5 col-form-label">Student subjects:</label>
            <div class="col-sm-7">
                <select name="subjects" required="required" class="form-control" multiple>
                    <option value="">Select</option>`;
                    for(let sub of subjectsToUse){
                        studString += `<option value="${sub}">${sub}</option>`;
                    }
                studString += `</select>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-12">
                <button onclick="createdStudentSubmit(event)" type="button" class="btn btn-primary float-right" 
                style="margin-left: 15px;">Submit</button>
            </div>
        </div>
    </form>
</div>
`;

return studString;
}

function createdStudentSubmit(event){
    event.preventDefault();
    let newStudent ={};

    let formElem = event.target.form;
    let allInputs = formElem.querySelectorAll("input");
    allInputs.forEach((input)=>{
        newStudent[input.name] = input.value;
    });

    newStudent["full_name"] = newStudent["first_name"] + " " + newStudent["last_name"] + " " +
                newStudent["other_name"];

    newStudent["full_name"] = newStudent['full_name'].trim();
    let selectOP = formElem.querySelectorAll("select");
    

    for(let select of selectOP){
        let arry = [];
        for( let option of select.selectedOptions){
            arry.push(option.value);
        };
        newStudent[select.name] = arry;
    }
    newStudent['student_class'] = newStudent['student_class'][0];
    console.log(newStudent);
    formData = {
        newStudent: newStudent
    }
    postData(`admin/10/createstudent`, 'POST', formData).then((result)=>{
        console.log(result);
        myAdminModal.style.display = 'none';
        myModalContent.innerHTML = result;
        myModal.style.display = 'block'
    });
}
//document.getElementById("admintablink").click();
function openAdmin(evt, cityName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("admin");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].classList.remove("w3-light-grey");
  }
  let adminContentElement = document.getElementById(cityName);
  let html;
  let message = '';
  if(cityName === 'editTeacher'){
      message = ' can edit teachers';
      html = getEditTeacherString();
  }else if(cityName === 'addTeacher'){
      message = ' can add new teachers';
      html = getAddTeacherString();
  }else if(cityName === 'addStudent'){
      message = ' and form teachers can add new students';
      html = getAddStudentString();
  }
  if(!teacher.isAdmin){
    html = `<h3 class="w3-yellow">Only admin  ${message}.</h3>`
  }
  adminContentElement.innerHTML = html;
  adminContentElement.style.display = "block";
  evt.currentTarget.classList.add("w3-light-grey");
}
