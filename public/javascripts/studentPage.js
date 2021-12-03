function myStudentsAddRemoveSubjectsClicked(event){
  let html = `
  <div class="w3-bar">
    <button onclick="addRemoveSubjectsToClass(event, 'addRemoveSubjectsToClass', 'add')" class="w3-bar-item w3-mobile w3-hover-brown">Add Subjects to Class</button>
    <button onclick="addRemoveSubjectsToClass(event, 'addRemoveSubjectsToClass', 'remove')" class="w3-bar-item w3-mobile  w3-hover-brown">Remove Subjects from Class</button>
  </div>
  <div id="addRemoveSubjectsToClass" class="addAndRemoveSubjects w3-container"></div>
  `;
  myModalContent.innerHTML = html;
  myModal.style.display = 'block';
}

function addRemoveSubjectsToClass(event, id, reason){
  let container = document.getElementById(id);
  let html = `
    <br>
    <div class="form-group row">
        <label for="subjects" class="col-sm-5 col-form-label">Select Class:</label>
        <div class="col-sm-7">
            <select id="classSelection" name="class" required="required" class="form-control">
                <option value="">Select</option>`;
                for(let clas of teacher.form_teacher){
                  html += `<option value="${clas}">${clas}</option>`;
                }
                html += `</select>
                <br>
        </div>
      </div>
      <br>
    <div class="form-group row">
        <label for="subjects" class="col-sm-5 col-form-label">Select Subjects:</label>
        <div class="col-sm-7">
            <select id="subjectSelection" name="subjects" required="required" class="form-control" multiple>
                <option value="">Select</option>`;
                for(let sub of subjectsToUse){
                  html += `<option value="${sub}">${sub}</option>`;
                }
                html += `</select>
                <br><br>
        </div>
      </div>
    <button onclick="submitSubmitSubjects(event, 'subjectSelection', 'classSelection', '${reason}')">`;
    let butMes = (reason === 'add')? 'Add ': 'Remove ';
    html += `
    ${butMes} Subjects
    </button>
    `;
    container.innerHTML = html;
}

function submitSubmitSubjects(event, idSubjects, idClass, reason){
  let subjectSelects = document.getElementById(idSubjects);
  let classSelects = document.getElementById(idClass);
  let selectedSubjects = [];
  let selectedClass;

  for(let opt of subjectSelects.selectedOptions){
    selectedSubjects.push(opt.value);
  }

  for(let opt of classSelects.selectedOptions){
    selectedClass = opt.value;
  }

  if(selectedClass.length < 1){
    alert("please select class");
    return

  }
  if(selectedSubjects.length < 1){
    alert("please select subjects");
    return
  }
  let formData = {
    selectedClass: selectedClass,
    selectedSubjects: selectedSubjects
  }
  if( reason === 'add'){
    myModalContent.innerHTML = `<h3 class="w3-panel w3-red">please wait adding subjects...</h3>`;
    postData(`student/1/addsubjects`, 'POST', formData).then((result) =>{
      myModalContent.innerHTML = `<h3 class="w3-panel w3-yellow">${JSON.parse(result)}</h3>`;
      
    });
  }else if(reason === 'remove'){
    myModalContent.innerHTML = `<h3 class="w3-panel w3-red">please wait removing subjects...</h3>`;
    postData(`student/1/removesubjects`, 'POST', formData).then((result) =>{
      myModalContent.innerHTML = `<h3 class="w3-panel w3-yellow">${JSON.parse(result)}</h3>`;
      
    });
  }
}