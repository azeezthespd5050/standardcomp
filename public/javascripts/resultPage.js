let all_student_average_array
let  days_school_open = 55;
let number_in_combined_stream;
let total_set;
let all_student_subject_map;
let next_term_begins = '15th, January 2022'
var term;
var session;
var caType;
var studentForResult;
var studentInCombinedStream;
function printResult(id){
    let html = termSessionClass();
    html +=`
    <br>
    <div class="form-group row">
        <label for="caType" class="col-sm-5 col-form-label">Select Class:</label>
        <div class="col-sm-7">
          <select id="classSelection" name="caType" required="required" class="form-control">
              `;
              for(let ca of ["exam","midTerm"]){
                html += `<option value="${ca}">${ca}</option>`;
              }
              html += `</select>
              <br>
        </div>
      </div>
    <button class="w3-large w3-center" onclick="loadStudents('${id}')" style="width: 200px;"> Load Students </button>
    `;
    myModalContent.innerHTML = html;
    myModal.style.display = 'block';
}

function loadStudents(docType){
    let url;
    if(docType === 'result'){
        url = '/teacher/1/loadallstudents';
    }else if(docType === 'broadsheet'){
        url = '/teacher/1/loadbroadsheetstudents';
    }
    teacherDisplay = document.getElementById("teacherDisplay");
    let names = {
    };
    let selects = myModalContent.querySelectorAll('select')
    for(let select of selects){
        for(let opt of select.selectedOptions){
            names[select.name] = opt.value;
        }
    }

  var studClass = names["studentClass"];
  term = names["term"];
  session = names["session"];
  caType = names["caType"];
  if(!studClass){
    myModalContent.innerHTML = '<h3  class="w3-yellow">Student class must be selected</h3>';
    myModal.style.display = "block";
    return;
  }
  postData(url, 'POST', names).then((students) => {
    
    let result =JSON.parse(students);
    if(result && result.length > 0){
      studentInCombinedStream = result;
      studentForResult = studentInCombinedStream.filter((student) => student.student_class === names["studentClass"]);
      window["studentsForResultClass"] = studClass;
      localStorage.setItem(studClass + "_studentsInCombinedStream", 
        JSON.stringify(studentInCombinedStream));
      localStorage.setItem(studClass + "_studentsForResult",
            JSON.stringify(studentForResult));
      window["term"] = term;
      window["session"] = session;
      window["caType"] = caType;
      studentInCombinedStream.forEach( (stud, index)=>{
          studentInCombinedStream[index].subjects.sort();
      });
      studentForResult.forEach( (stud, index)=>{
          studentForResult[index].subjects.sort();
      });
      let returnStr = scoreString(studentForResult, studentInCombinedStream.length);
      teacherDisplay.innerHTML = returnStr;
      let printResultButton = document.getElementById('docPrinting');
      printResultButton.innerHTML= '<button class="w3-button w3-xlarge" onclick="downloadResult(event)">Download Result</button>';
      docBut.innerHTML = `<button onclick="updateResultStudents(event)" class="w3-large">Update Result Scores</button>` 
      myModal.style.display = 'none';
    }
  })                        
}

function updateStudentsFormTeacher(event, studentClass){
    myModalContent.innerHTML = "Please wait...";
    myModal.style.display = 'block'
    let value = event.target.value;
    let studClass  = window["studentsForResultClass"]; 
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    allStudents.forEach((stud, index) => {
        allStudents[index].form_teacher[0] = value
    });
    localStorage.setItem(studClass + "_studentsForResult", 
        JSON.stringify(allStudents));
        myModal.style.display = 'none';
    
}

function updateStudentsDaysSchoolOpen(event, studentClass){
    myModalContent.innerHTML = "Please wait...";
    myModal.style.display = 'block'
    let value = event.target.value;
    let studClass  = window["studentsForResultClass"]; 
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    allStudents.forEach((stud, index) => {
        allStudents[index].days_school_open = value
    });
    localStorage.setItem(studClass + "_studentsForResult", 
        JSON.stringify(allStudents));
        myModal.style.display = 'none';
    
}

function updateStudentsComments(event, studentId){
    myModalContent.innerHTML = "Please wait...";
    myModal.style.display = 'block'
    let value = event.target.value;
    value = value.trim();
    if(!value){
        return;
    }
    let studClass  = window["studentsForResultClass"]; 
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    let pos;
    allStudents.forEach((stud, index) => {
        if(parseInt(stud.student_id) === parseInt(studentId)){
            allStudents[index].comments = value;
            pos = index;
            return;
        }
    });
    localStorage.setItem(studClass + "_studentsForResult", 
        JSON.stringify(allStudents));
    myModal.style.display = 'none';
}

function updateStudentDaysAbsent(event, studentId){
    myModalContent.innerHTML = "Please wait...";
    myModal.style.display = 'block'
    let value = event.target.value;
    value = value.trim();
    if(!value){
        return;
    }
    let studClass  = window["studentsForResultClass"]; 
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    let pos;
    allStudents.forEach((stud, index) => {
        if(parseInt(stud.student_id) === parseInt(studentId)){
            allStudents[index].days_absent = value;
            pos = index;
            return;
        }
    });
    localStorage.setItem(studClass + "_studentsForResult", 
        JSON.stringify(allStudents));
    myModal.style.display = 'none';
}

function updateStudentAffectiveTraits(event, studentId, traits, studIndex){
    myModalContent.innerHTML = "Please wait...";
    myModal.style.display = 'block'
    let value = event.target.value;
    value = value.trim();
    if(!value){
        return;
    }
    let studClass  = window["studentsForResultClass"]; 
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    let pos;
    allStudents.forEach((stud, index) => {
        if(parseInt(stud.student_id) === parseInt(studentId)){
            allStudents[index].affective_traits[traits] = value;
            pos = index;
            console.log(value, allStudents[index].affective_traits);
            return;
        }
    });
    localStorage.setItem(studClass + "_studentsForResult", 
        JSON.stringify(allStudents));
    myModal.style.display = 'none';
}

function updateStudentPsychomotor(event, studentId, psycho, studIndex){
    myModalContent.innerHTML = "Please wait...";
    myModal.style.display = 'block'
    let value = event.target.value;
    value = value.trim();
    if(!value){
        return;
    }
    let studClass  = window["studentsForResultClass"]; 
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    let pos;
    allStudents.forEach((stud, index) => {
        if(parseInt(stud.student_id) === parseInt(studentId)){
            allStudents[index].psychomotor[psycho] = value;
            pos = index;
            console.log(value, allStudents[index].psychomotor);
            return;
        }
    });
    localStorage.setItem(studClass + "_studentsForResult", 
        JSON.stringify(allStudents));
    myModal.style.display = 'none';
}


function updateStudentsNextTerm(event, studentClass){
    myModalContent.innerHTML = "Please wait...";
    myModal.style.display = 'block'
    let value = event.target.value;
    let studClass  = window["studentsForResultClass"]; 
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    allStudents.forEach((stud, index) => {
        allStudents[index].next_term_begins = value
    });
    localStorage.setItem(studClass + "_studentsForResult", 
        JSON.stringify(allStudents));
        myModal.style.display = 'none';
    
}

function scoreString(studentForResult, numberInCombinedStream){
  let scString = `
  <h4>ACT <span><input id="isACT" type="checkbox"></span></h4>
    <div>
      <h3>Number of students in ${studentForResult[0].student_class}: ${studentForResult.length}</h3>
      <h3>Number of students in combined stream ${numberInCombinedStream}</h3>
      
      <div>
          <h3>Next Term Begins</h3>
          <input type="text" id="next_term_begins" onchange="updateStudentsNextTerm(event)">
          <h3>Day school open</h3>
          <input type="text" id="days_school_open" onchange="updateStudentsDaysSchoolOpen(event)">
          <h3>Class Form teacher</h3>
          <input type="text" value="${studentForResult[0].form_teacher[0]}" id="formTeacher" onchange="updateStudentsFormTeacher(event)">
      </div>
    </div>
    <div class="card">
  `;
  let index = 0;
  for(let student of studentForResult){
    scString +=`
        <div class="card-body">
            
            <h3 class="text-warning"  style="text-transform: capitalize">
                ${index++} ${ student.full_name}
            </h3>
            <div class="row">
                <h4 class="col-md-4">Form Teacher</h4>
                <div class="col-md-4">
                    <input id="form_teacher_${student.student_id}" name="form_teacher" type="text" value="${student.form_teacher[0]}">
                </div>
            </div>
            <div class="row">
                <h3>Student comment</h3>
            </div>
            <div class="form-group row">
                <div class="col-md-8">
                    <textarea id="comments_${student.student_id}" name="comments" value="${student.comments}" rows="2" class="form-control"></textarea>
                </div>
            </div>
            <div class="row">
                <h3>Student Days Absent</h3>
            </div>
            <div class="form-group row">
                <div class="col-md-8">
                    <input type="number" onchange="updateStudentDaysAbsent(event, '${student.student_id}')" class="form-control" value='${student.days_absent}'>
                </div>
            </div><div class="card">
            <div class="row">
                <button style="max-width:200px" class="traits" onclick="document.getElementById('traits_${student.student_id}').style.display=document.getElementById('traits_${student.student_id}').style.display === 'block'?'none':'block'">Click to open/close Affective Traits</button>
            </div>
            <div  id="traits_${student.student_id}" style="display: none">
                <table data-student_id="${student.student_id}" border="1">
                    <thead>
                        <tr>
                            <th><div>Traits</div></th>
                            <th>5</th>
                            <th>4</th>
                            <th>3</th>
                            <th>2</th>
                            <th>1</th>
                        </tr>
                    </thead>
                    <tbody>`;
                        for(let traits of student.affective_traits_array){
                            scString += `
                                <tr class="class="">
                                    <td><i class="col-12 col-md-6 text-warning" style="text-transform: capitalize">${traits}</i></td>
                            `;
                            let rowIndex = 0;
                            for(let cls of ['5','4','3','2','1']){
                                scString +=`
                                    <td><input name="${traits}_${student.student_id}" value="${cls}" style="width:20px" class="${traits}_${student.student_id}" type="radio" ${(student.affective_traits[traits] === cls) ? 'checked':''} onchange="updateStudentAffectiveTraits(event, '${student.student_id}', '${traits}', '${index}')"></td>`;
                            }   
                            scString +=`</tr>`;
                            rowIndex++;
                        }
                    scString+=`
                    </tbody>
                </table>`;
            scString += `</div>
        </div>
        <div class="card">
            <div class="row">
                <button style="max-width:200px" class="psycho" onclick="document.getElementById('psycho_${student.student_id}').style.display=document.getElementById('psycho_${student.student_id}').style.display === 'block'?'none':'block'">Click to open/close Psychomoter</button>
            </div>
            <div id="psycho_${student.student_id}"  style="display: none">
                <table data-student_id="${student.student_id}" border="1">
                    <thead>
                        <tr>
                            <th><div>psycho</div></th>
                            <th>5</th>
                            <th>4</th>
                            <th>3</th>
                            <th>2</th>
                            <th>1</th>
                        </tr>
                    </thead>
                    <tbody>`;
                        for(let psycho of student.psychomotor_array){
                            scString += `
                                <tr class="class="">
                                    <td><i class="col-12 col-md-6 text-warning" style="text-transform: capitalize">${psycho}</i></td>
                            `;
                            let rowIndex = 0;
                            for(let cls of ['5','4','3','2','1']){
                                scString +=`
                                    <td><input name="${psycho}_${student.student_id}" value="${cls}" style="width:20px" class="${psycho}_${student.student_id}" type="radio" ${(student.psychomotor[psycho] === cls) ? 'checked':''} onchange="updateStudentPsychomotor(event, '${student.student_id}', '${psycho}', '${index}')"></td>`;
                            }   
                            scString +=`</tr>`;
                            rowIndex++;
                        }
                    scString+=`
                        </tbody>
                    </table>
                </div>
            </div>
            <table class="table-bordered">
                <thead>
                    <tr>
                    <th><div style="width:200px">Subject</div></th>`;
                    
                    for(let i of [1,2]){
                        scString +=`<th>${'C.A.'+i}<br>(20%)</th>`;
                    }
                    scString +=`<th>Exam<br>(60%)</th>
                    </tr>
                </thead>
                <tbody>`;
                
                for(let subject of student.subjects){
                    let replacedSubject = subject.replace(/\s+/g, "_");
                    scString +=`<tr">
                        <td>${subject}</td>
                        <td><input value="${student[subject][0]}" onchange="resultStudentInputChaned(event, {student_id: ${student.student_id}, inputIndex:0, maxValue: 20, type:'firstFormTotal', subject:'${subject}'})" type="number" class="w3-input ${replacedSubject}_${student.student_id}" max="20" min="0" maxlength="2"></td>
                        <td><input value="${student[subject][1]}" onchange="resultStudentInputChaned(event, {student_id: ${student.student_id}, inputIndex:1, maxValue: 20, type:'firstFormTotal', subject:'${subject}'})" type="number" class="w3-input ${replacedSubject}_${student.student_id}" max="20" min="0" maxlength="2"></td>
                        <td><input value="${student[subject][2]}" onchange="resultStudentInputChaned(event, {student_id: ${student.student_id}, inputIndex:2, maxValue: 60, type:'examTotal', subject:'${subject}'})" type="number" class="w3-input ${replacedSubject}_${student.student_id}" max="60" min="0" maxlength="2"></td>
                    </tr>`;
                }
    
                scString += `</tbody>
            </table>
        </div>
    </div>`;
  }
  return scString;
}

function  resultStudentInputChaned(event, data){
  let studentData = data; //JSON.parse(JSON.stringify(data));
  let maxValue = parseFloat(studentData.maxValue);
  let testVal = event.target.value;
  let inputPosition = studentData.inputIndex;
  let isTestValZero = false;
  let testValCanBeStored = true;
  if(testVal === "0"){
    isTestValZero = true;
  }

  if( testVal > maxValue){
    alert("value cannot be more then " + maxValue);
    event.target.value = "";
    testValCanBeStored = false
  }else if( testVal < 0 ){
    alert("value cannot be less then 0");
    event.target.value = "";
    testValCanBeStored = false
  }

  //let totalInput = document.getElementById(studentData.type+"_"+ studentData.student_id);
  let allInput = Array.from(document.getElementsByClassName(studentData.subject.replace(/\s+/g, "_")+"_"+ studentData.student_id));
  let totalArray = [];
  allInput.forEach((input) => {
    totalArray.push(input.value);
  });
  let sampleStud = {
  };
  sampleStud[studentData["subject"]] = totalArray;
  let studClass = window["studentsForResultClass"];

  let printResultButton = document.getElementById('docPrinting');
   printResultButton.innerHTML= '';
      
      
  let combinedStud = JSON.parse(localStorage.getItem(studClass + "_studentsInCombinedStream"));
  let resultStud = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
  combinedStud.forEach((student, index) => {
    if(student.student_id === studentData.student_id){
        combinedStud[index]= {...combinedStud[index], ...sampleStud};
        for(let i = 0; i < resultStud.length; i++){
            if(resultStud[i].student_id === student.student_id){
                resultStud[i] = combinedStud[index];
            }
        }
      return;
    }
  });
  localStorage.setItem(studClass + "_studentsInCombinedStream", 
    JSON.stringify(combinedStud));
  localStorage.setItem(studClass + "_studentsForResult", JSON.stringify(resultStud));
  //let printResultButton = document.getElementById('docPrinting');
   printResultButton.innerHTML= '<button class="w3-button w3-xlarge" onclick="downloadResult(event)">Download Result</button>';
        
}

function updateResultStudents(event){
    let studClass = window["studentsForResultClass"];
    let allStudents = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    
    let formData = {allStudents: allStudents}
    postData('student/1/resultstudents', "POST", formData).then((teach) =>{
        myModalContent.innerHTML = `<h3>${teach}</h3>`;
        myModal.style.display = 'block';
    })
}
function downloadResult(event){
    
      docBut.innerHTML = '';
      
    all_student_subject_map = new Map();
    total_set = new Set();
    all_student_average_array = []
    let array_for_average =[]
    let class_set = new Set()
    let term;
    let session;
    let caType;
    //let studentForResult;
    //let studentInCombinedStream;

    term = window["term"];
    session = window["session"];
    caType = window["caType"];
    let studClass = window["studentsForResultClass"]
    studentForResult = JSON.parse(localStorage.getItem(studClass + "_studentsForResult"));
    studentInCombinedStream = JSON.parse(localStorage.getItem(studClass + "_studentsInCombinedStream"));
    
    let student_for_result_id = studentForResult.map((stud) =>{
        return stud.student_id;
    });

    let count = 0;
    let total_subjects = [];
    let offset = 0;
    let isCollege = false;
    studentInCombinedStream.forEach( (student, index) =>{

        let subjects = student['subjects']?student['subjects']:[];
        let studentClass = student['student_class'];
        let id =  student['student_id'];
        if(studentClass.startsWith("jss") || studentClass.startsWith("ss")){
            isCollege = true;   
        }
        let total_score = 0;
        let average = 0;
        let tot =0;
        let all_student_subject = student.subjects?student.subjects:[];
        
        let in_result_student = student_for_result_id.includes(id);
        let sample_student = {};
        if(in_result_student){
            sample_student["id"] = id;
            studentForResult.find((elem, idex)=>{
                if(elem.id === id){
                  studentForResult[idex].subjects = all_student_subject;
                  return elem;
                }
            });
        }
        let number_of_subjects = Object.keys(all_student_subject).length;
        subjects.forEach((subject) => {
            if(!total_subjects.includes(subject)){
              total_subjects.push(subject);
            }
            
            let tempOffSet = offset;
            let form_order = [];
            if(term === "firstTerm" || term === "secondTerm"){
                if(caType === 'exam'){
                    let sampleAssArr = student[subject];
                    if(sampleAssArr.length < 9){
                        let sampleAss = [];
                        for( let i=0; i<9; i++){
                            if(sampleAssArr[i]){
                                sampleAss.push(sampleAssArr[i]);
                            }else{
                                sampleAss.push("");
                            }
                        }
                        student[subject] = sampleAss;
                    }
                    form_order = student[subject] ?
                        student[subject].slice(offset, 3 + offset) : 
                                ["","",""];
                    let mid = form_order.slice(0, 2);
                    let mid_tot = 0;
                    mid.forEach((ass, index)=>{
                        let test = parseFloat(ass);
                        if(test === 0){
                            mid[index] = "0";
                        }else if(test < 0){
                            mid[index] = '';
                        }else if(test > 20){
                            mid[index] = '';
                        }else if(test >= 0 && test <= 20){
                            mid_tot += test;
                        }
                    });

                    let exam = form_order[2];
                    let test = parseFloat(exam);
                    if(test === 0){
                        exam = "0";
                    }else if(test < 0){
                        exam = '';
                    }else if(test > 60){
                        exam = '';
                    }else if( test >= 0 && test <= 60){
                        exam= `${test}`;
                    }
                    form_order = [ mid[0],mid[1], exam];   
                    tot = 0;
                    form_order.forEach((ass, index)=>{
                        let test = parseFloat(ass);
                        if(!test){
                            test = 0;
                        }else if(test === 0){
                            test = 0;
                            form_order[index] = '0';
                        }else if(test < 0){
                            test = 0;
                            form_order[index] = '';
                        }else if(test > 20 && (index === 0)){
                            test = 20;
                            //form_order[index] = '20';
                        }else if(test > 20 && (index === 1)){
                            test = 20;
                            //form_order[index] = '20';
                        }else if(test > 60 && (index === 2)){
                            test = 60;
                            //form_order[index] = '70';
                        }
                        tot += test;
                    }); 
                    if(tot >= 0){
                        total_score += tot;
                    }else{
                        tot = 0;
                        total_score += 0;
                    }
                    form_order.push(`${tot}`);
                }
            }else if(term === "thirdTerm"){                                    
                let step = 6;
                if(caType === 'exam'){
                    let sampleAssArr = student[subject];
                    if(sampleAssArr.length < 9){
                        let sampleAss = [];
                        for( let i=0; i<9; i++){
                            if(sampleAssArr[i]){
                                sampleAss.push(sampleAssArr[i]);
                            }else{
                                sampleAss.push("");
                            }
                        }
                        student[subject] = sampleAss;
                    }
                    form_order = student[subject] ?
                        student[subject].slice(offset, 3 + offset) : 
                                ["","",""];
                    let mid = form_order.slice(0, 2);
                    let mid_tot = 0;
                    mid.forEach((ass, index)=>{
                        let test = parseFloat(ass);
                        if(test === 0){
                            mid[index] = "0";
                        }else if(test < 0){
                            mid[index] = '';
                        }else if(test > 20){
                            mid[index] = '';
                        }else if(test >= 0 && test <= 20){
                            mid_tot += test;
                        }
                    });

                    let exam = form_order[2];
                    let test = parseFloat(exam);
                    if(test === 0){
                        exam = "0";
                    }else if(test < 0){
                        exam = '';
                    }else if(test > 60){
                        exam = '';
                    }else if( test >= 0 && test <= 60){
                        exam= `${test}`;
                    }
                    form_order = [ mid[0],mid[1], exam];   
                    tot = 0;
                    form_order.forEach((ass, index)=>{
                        let test = parseFloat(ass);
                        if(!test){
                            test = 0;
                        }else if(test === 0){
                            test = 0;
                            form_order[index] = '0';
                        }else if(test < 0){
                            test = 0;
                            form_order[index] = '';
                        }else if(test > 20 && (index === 0)){
                            test = 20;
                            //form_order[index] = '20';
                        }else if(test > 20 && (index === 1)){
                            test = 20;
                            //form_order[index] = '20';
                        }else if(test > 60 && (index === 2)){
                            test = 60;
                            //form_order[index] = '70';
                        }
                        tot += test;
                    }); 
                    if(tot >= 0){
                        total_score += tot;
                    }else{
                        tot = 0;
                        total_score += 0;
                    }
                    form_order.push(`${tot}`);
                }
            }
            if(!all_student_subject_map.has(subject)){
                let val = [{"id":id, "total":tot}];
                all_student_subject_map.set(subject, val);
            }else{
                let val = {"id":id, "total":tot};
                let subArray = all_student_subject_map.get(subject);
                subArray.push(val);
                all_student_subject_map.set(subject, subArray);
            }
            if(in_result_student){
                let pos = student_for_result_id.indexOf(id);
                studentForResult[pos][subject] = form_order;
            }
            offset = tempOffSet;
        });
        average = total_score / number_of_subjects;
        total_set.add(total_score);
        all_student_average_array.push({"id": id, "total": total_score.toFixed(), "average":average.toFixed(2)});
        
        let full_name = student.full_name;
        array_for_average.push({
            "full_name": full_name, 
            "average": average.toFixed(2),
            "student_class": student.student_class
        });
        class_set.add(student.student_class)

        if(in_result_student){
            let pos = student_for_result_id.indexOf(id);
            studentForResult[pos]["average"] = average.toFixed(2);
            studentForResult[pos]["total_score"] = total_score;
        }
    });
    printCollegeResult()
}

async function printCollegeResult(){

    var badge64 =  await toDataURL(schoolBadgeUrl);
    var background64 = await toDataURL(schoolBackgroundUrl);
    var signature64 =  await toDataURL(schoolSignatureUrl);
    //var checkmark64 = await toDataURL(schoolCheckmarkUrl);
    var studentDefaultPhoto = "https://s3.us-east-1.amazonaws.com/standardcomprehensive/schoolphotos/studentphoto.png";
    //var studentDefaultPhoto64 = await toDataURL(studentDefaultPhoto);
    let doc = new jsPDF();
    let studClass  = window["studentsForResultClass"];
    
    let pageWidth = doc.internal.pageSize.getWidth();
    let pageHeight = doc.internal.pageSize.getHeight();
    number_in_combined_stream = studentInCombinedStream.length;
    let numberInCombinedStream =  studentInCombinedStream.length;
    let number_in_class = studentForResult.length;

    let current_student = studentForResult[0];
    let current_id = current_student.student_id;
    studentClass = current_student.student_class;
    let position_in_class;
    let class_total_score = 0;
    let average_set = new Set();
    all_student_average_array.forEach(function(val, index){
        //if(val.average > 10){
            average_set.add(parseFloat(val.average));
        //}
    });
    let isCollege = false;
    let average_array = Array.from(average_set);
    average_array.sort(function(a,b){
        if(a < b){
            return -1;
        }
        if(a > b){
          return 1
        }
        return 0;
    });
    let min_average = parseFloat(average_array  [0]);
    if(min_average < 10){
        min_average = 10.00;
    }
    let max_average = parseFloat(average_array[average_array.length - 1]); 
    
    
    let total_array = Array.from(total_set).sort(function(a,b){
        if(a < b){
            return -1;
        }
        if(a > b){
          return 1;
        }
        return 0;
    });
    all_student_average_array.forEach((val, index)=>{
        if(!(val.average === 'NaN')){
            class_total_score += parseFloat(val.average);
        }
        
        studentForResult.find((student, i)=>{
           if(val.id === student.student_id){
                position_in_class = total_array.indexOf(student.total_score);
                studentForResult[i]["position_in_class"] =total_array.length - position_in_class;
                return student;
           } 
        });
        
    });
    let class_average = (class_total_score / number_in_combined_stream).toFixed(2);
    
    let pageContent = async (student, cnt) =>{
        let studIndex = student.index;

        let yPos = 8;
        let xPos = 10;
        let marginX = 5;
        let marginY = 5;
        let radiusX = 10.5;
        let radiusY = 9.5;
        let grade;
        let promotion = '';
        if( student.average >=  69.5 ){ 
            grade = "A";
            promotion = "Promoted";
        }else if( student.average >= 59.5 ){ 
            grade = "B"
            promotion = "Promoted";
        }else if( student.average >= 49.5 ){
            grade = "C"
            promotion = "Promoted";
        }else if( student.average >= 44.5 ){ 
            grade = "D"
            promotion = "Promoted on Trial";
        }else if( student.average >= 39.5 ){ 
            grade = "E"
            promotion = "Promoted on Trial";
        }else { 
            grade = "F"
            promotion = "Repeated";
        }
        let school_name = 'STANDARD COMPREHENSIVE COLLEGE, KANO';
        let motto = 'MOTTO: KNOWLEDGE IS POWER';
        let school_address = 'BEHIND HAJJ CAMP, KWAKWACHI, KANO';
        let webaddress = 'Web Address: standardcomprehensive.com';
        let phone_number = 'GSM: 08062844654, 07032224202';
        let result_type;
        if (caType === 'midTerm'){
            result_type = `MID TERM RESULT FOR ${term.replace(/term/i, "").toUpperCase()} TERM, ${session} ACADEMIC SESSION`;
        }else if (caType === 'exam'){
            result_type = `CUMULATIVE REPORT SHEET FOR ${term.replace(/term/i, "").toUpperCase()} TERM, ${session} ACADEMIC SESSION`;
        }

        doc.setFontSize(12);
        doc.setDrawColor('#2405a1');
        doc.setLineWidth(1.5);
        doc.setFont("times", "bold");

        var imageType = student.image_url.substring(student.image_url.lastIndexOf(".") + 1).toUpperCase();
        doc.addImage(badge64,"PNG", 8,12, 30,25);
        if(student.image_url === "images/studentphoto.png" ||
        student.image_url === "images/studentphoto.png"){
            //doc.addImage(studentDefaultPhoto64, 'PNG', pageWidth - 8-30,12, 30,25);
        }else{
            let base64image = await toDataURL(student.image_url);
            //doc.addImage(base64image, imageType, pageWidth - 8-30,12, 30,25);
        }
        doc.addImage(signature64,"PNG", pageWidth-30, pageHeight-25, 25, 20 );
        //doc.addImage(background64,"PNG", 0,0,pageWidth, pageHeight);
        
        doc.setTextColor('#006400');
        doc.setFontSize(20);
        let nameLen = doc.getTextWidth(school_name);
        let namePos = 0.5*pageWidth - 0.5*nameLen;
        doc.text(school_name, namePos, 6, {baseline: 'top'});


        doc.setFontSize(10);
        let phoneLen = doc.getTextWidth(phone_number);
        let phonePos = 0.5*pageWidth - 0.5*phoneLen;
        doc.text(phone_number, phonePos, 14, {baseline: 'top'});

        doc.setFontSize(14);
        let webaddressLen = doc.getTextWidth(webaddress);
        let webaddressPos = 0.5*pageWidth - 0.5*webaddressLen;
        doc.text(webaddress, webaddressPos, 18, {baseline: 'top'});
        
        doc.setFontSize(15);
        doc.setTextColor('#091c8d');
        let mottoLen = doc.getTextWidth(motto);
        let mottoPos = 0.5*pageWidth - 0.5*mottoLen;
        doc.text(motto, mottoPos, 25, {baseline: 'top'});
        
        doc.setFontSize(15);
        let addressLen = doc.getTextWidth(school_address);
        let addressPos = 0.5*pageWidth - 0.5*addressLen;
        doc.text(school_address, addressPos, 30, {baseline: 'top'});

        doc.setFontSize(12);
        let typeLen = doc.getTextWidth(result_type);
        let typePos = 0.5*pageWidth - 0.5*typeLen;
        doc.text(result_type, typePos, 37, {baseline: 'top'});
        doc.line(5.3, 43, pageWidth-4.8, 43);
        
        let student_name = `${student.first_name} ${student.last_name}`;
            student_name += (student.other_name.length > 0) ? ` ${student.other_name}` : "";
        student_name = student_name.toUpperCase();
        let studentClass = student.student_class.replace(/col|dn/, "");
        let admission_number = "ABTS/"+student.student_class.substring(0,2).toUpperCase()+"/";
        let student_id = student._id;
        student_id = parseInt(student_id);
        admission_number += (student_id < 10) ? "000"+student_id :(student_id < 100) ? "00"+student_id : 
                (student_id <1000)?"0"+student_id:student_id;
        let  days_school_open = 55;
        
        doc.text("NAME: "+ student_name, 8, 45, {baseline: 'top'});
        doc.text("Class: " + studentClass[0].toUpperCase() + studentClass.substring(1), 8, 50, {baseline: 'top'});


        doc.text("GRADE: "+ grade, 140, 45, {baseline: 'top'});
        if(term === 'thirdTerm'){
            doc.text(promotion, 175, 45, {baseline: 'top'});
        }
        
        doc.text("Admission No:", 8, 55, {baseline: 'top'});
        doc.text(admission_number, 55, 55, {baseline: 'top'});
        
        doc.text("Total Score", 85, 55, {baseline: 'top'});
        doc.text(`${student.total_score}`, 130, 55, {baseline: 'top'});
        
        doc.text("Session:", 8, 60, {baseline: 'top'});
        doc.text(`20${session}`, 55, 60, {baseline: 'top'});
        
        doc.text("Final Average", 85, 60, {baseline: 'top'});
        doc.text(`${caType === 'exam' ? student.average:2*student.average}`, 130, 60, {baseline: 'top'});
        
        doc.text("ATTENDANCE", 145, 60, {baseline: 'top'});
        let trm = term.replace(/Term/, "");
        trm = trm.charAt(0).toUpperCase() + trm.slice(1);
        
        doc.text("Term:", 8, 65, {baseline: 'top'});
        doc.text(trm, 55, 65, {baseline: 'top'});
        
        doc.text("Class Average", 85, 65, {baseline: 'top'});
        doc.text(`${caType === 'exam'?class_average:2*parseFloat(class_average)}`, 130, 65, {baseline: 'top'});
        
        doc.text("Days School Open:", 145, 65, {baseline: 'top'});
        doc.text(`${student.days_school_open || days_school_open}`, 190, 65, {baseline: 'top'});
        
        doc.text("No. in Class:", 8, 70, {baseline: 'top'});
        doc.text(`${number_in_class}`, 55, 70, {baseline: 'top'});
        
        doc.text("Highest Ave. in Class:", 85, 70, {baseline: 'top'});
        doc.text(`${caType === 'exam' ? max_average.toFixed(2) : (2* max_average).toFixed(2)}` , 130, 70, {baseline: 'top'});
        
        doc.text("Time(s) Present:", 145, 70, {baseline: 'top'});
        doc.text(`${2*days_school_open - (parseInt(student.days_absent)?parseInt(student.days_absent):0)}`, 190, 70, {baseline: 'top'});
        
        //doc.text("No. in Combined Stream:", 8, 75, {baseline: 'top'});
        //doc.text(`${numberInCombinedStream}`, 55, 75, {baseline: 'top'});
        
        doc.text("Position in Class:", 8, 75, {baseline: 'top'});
        doc.text(`${student.position_in_class}`, 55, 75, {baseline: 'top'});

        doc.text("Lowest Ave. in Class:", 85, 75, {baseline: 'top'});
        doc.text(`${caType === 'exam'? min_average.toFixed(2) :(2*min_average).toFixed(2)}`, 130, 75, {baseline: 'top'});
        
        doc.text("Time(s) Absent:", 145, 75, {baseline: 'top'});
        doc.text(`${student.days_absent?student.days_absent:0}`, 190, 75, {baseline: 'top'});
        
        

        let head, body;
        let columnHeight = 0;
        if(caType === 'exam' && term !== "thirdTerm"){
            head = ["Subject","Cont.\nAss.1\n(20%)","Cont.\nAss.2\n(20%)","Exam\n(60%)",
                "Total\n(100%)","Position\nin Each\nSubject", "GRD", "Class\nAve.\n(100%)", "Remarks"];
        }else if(caType === 'exam' && term === "thirdTerm"){
            head = ["Subject","Cont.\nAss.1\n(20%)","Cont.\nAss.2\n(20%)","Exam\n(60%)",
                "Total\n(100%)","Position\nin Each\nSubject", "GRD","Class\nAve.\n(100%)", "Remarks"];
        }
        let tableObject = {
            head: [head],
            body: []
        };


        student.subjects.forEach((subject)=>{
           let mySet = new Set();
           let all_student_sub_total = 0;
           let subject_for_all_student = all_student_subject_map.get(subject);
           subject_for_all_student.forEach((val, i)=>{
               mySet.add(parseInt(val.total));
               all_student_sub_total += parseInt(val.total);
           });
           let subject_average = all_student_sub_total/subject_for_all_student.length;
           let student_sub_total = subject_for_all_student.find((elem)=>{
               if(elem.id === student.student_id)
                   return elem;
           });
           student_sub_total = parseInt(student_sub_total.total);
           let myArray = Array.from(mySet);
           myArray.sort(function(a,b){
               if(a<b){
                   return -1;
               }
               if(a>b){
                return 1;
              }
              return 0;
           });
           let pos = myArray.indexOf(student_sub_total);
           let position_in_each_subject =myArray.length - pos;
           let grades, remarks;
           if(student_sub_total >= (caType === 'exam' ? 69.5 : 0.5 * 85)){
                grades = "A";
                remarks = "Excellent";
            }else if(student_sub_total >= (caType === 'exam' ?  59.5 : 0.5 * 80)){
                grades = "B";
                remarks = "Very Good";
            }else if(student_sub_total >= (caType === 'exam' ?  49.5 : 0.5 * 75)){
                grades = "C";
                remarks = "Good";
            }else if(student_sub_total >= (caType === 'exam' ?   44.5 : 0.5 * 70)){
                grades = "D";
                remarks = "Average";
            }else if(student_sub_total >= (caType === 'exam' ?   39.5 : 0.5 * 65)){
                grades = "E";
                remarks = "Fair";
            }else {
                grades = "F";
                remarks = "Fail";
            }
            
            if(caType === 'exam' && term !== "thirdTerm"){

                body = [subject,student[subject][0],student[subject][1], student[subject][2],
                    student[subject][3], position_in_each_subject, grades, subject_average.toFixed(1), remarks];
                tableObject["didDrawPage"] = (data)=>{
                    columnHeight = data.cursor.y+1;
                };
                
                tableObject["didParseCell"] = (data)=>{
                    if(data.section === "body"){
                        if(data.column.index === 1){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<9.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 2){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<9.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 3){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<29.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 4){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<49.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 6){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(text === "F9"){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 7){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(text < 50.00){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 8){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(text === "Fail"){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }
                    }
                };
            }else if(caType === 'exam' && term === "thirdTerm"){
                body = [subject,student[subject][0],student[subject][1],student[subject][2],
                      student[subject][3],position_in_each_subject, grades,subject_average.toFixed(1),remarks];
                tableObject["didDrawPage"] = (data)=>{
                  columnHeight = data.cursor.y+1;
                };
                tableObject["didParseCell"] = (data)=>{
                    if(data.section === "body"){
                        if(data.column.index === 1){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<9.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 2){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<9.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 3){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<29.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 4){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseInt(text)<49.5){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 6){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(text === "F"){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 7){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(parseFloat(text) < 50.00){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }else if(data.column.index === 8){
                            let text = data.cell.raw;
                            if(text !== ''){
                                if(text === "Fail"){
                                    data.cell.styles.textColor = '#ff0000';
                                }
                            }
                        }
                    }
                };
            }
        
        tableObject.body.push(body);
        });
        let tableBodyColor = '#00f';
        tableObject["headStyles"] = {halign: 'center', fillColor:'#006400', valign:'bottom'};
        tableObject["bodyStyles"] = {halign: 'center', fillColor:false, fontStyle:'bold', fontSize:10, minCellHeight:2, textColor: tableBodyColor};
        tableObject["margin"] = {top:80, left:6, right:6, bottom:50};
        tableObject["theme"] ='grid';
        tableObject["columnStyles"] = {0:{halign: 'left'}};
        tableObject["styles"] = { fontStyle: 'bold', lineColor:'#2405a1'};
        tableObject["styles"]["cellPadding"] = 0.5;
        
        doc.autoTable( tableObject);
        
        let principalComment;
        let formTeacherComment;
        let testAve;
        if(caType === "firstForm" || caType === "midTerm" || caType === "secondForm"){
            testAve = 2* student.average;
        }else{
            testAve = student.average;
        }
        if( testAve >=  69.5 ){ 
            formTeacherComment = "An excellent performance, keep it up" ;
            principalComment = "An impressive performance. Do not relent in effort." ;
        }
        else if( testAve >= 59.5 ){ 
            principalComment = "A good performance. Keep trying as the sky is your starting point.";
            formTeacherComment = "A good performance. Keep trying as the sky is your starting point." ;
        }
        else if( testAve >= 49.5 ){
            formTeacherComment = "A good attempt, try harder." ;
            principalComment = "You have tried in your performance. You need to put more effort.";
        }
        else if( testAve >= 44.5 ){ 
            principalComment = "You need to improve in your studies";
            formTeacherComment = "An average performance. You can do better" ;
        }
        else if( testAve >= 39.5 ){ 
            principalComment = "You can attain a better performance if you take your studies with all seriousness.";
            formTeacherComment = "An average performance, put more effort";
        }
        else { 
            principalComment = "You can be a better student if you take your studies seriously.";
            formTeacherComment = "A poor performance.";
        }
        doc.text("GRADE DETAILS", 8, columnHeight, {baseline: 'top'});
        doc.text("No. of Subjects: "+student.subjects.length, pageWidth-45, columnHeight, {baseline: 'top'});
        doc.text("A = 70-100,  B = 60-69,  C = 50 - 59,  D = 45 - 49 ,   E = 40 - 44, F9 = 0 - 39", 8,columnHeight+4, {baseline:"top"});
        
        let affectiveTraitsTableObject = {};
        let affectiveTraitsTableArray = Object.keys(student.affective_traits);
        affectiveTraitsTableObject["head"] = [["AFFECTIVE TRAITS", "RATING"]];
        affectiveTraitsTableObject["body"] = [];
        //let psycoHeight;
        affectiveTraitsTableArray.forEach(function(val){
            affectiveTraitsTableObject["body"].push([val.toUpperCase(), student.affective_traits[val]]);
        });
        affectiveTraitsTableObject["headStyles"] = {halign: 'center', fillColor:'#006400', valign:'bottom'};
        affectiveTraitsTableObject["bodyStyles"] = {halign: 'center', fillColor:false, fontStyle:'bold', fontSize:8, minCellHeight:2, textColor:tableBodyColor};
        affectiveTraitsTableObject["startY"] = columnHeight+10;
        affectiveTraitsTableObject["margin"] = {left:6, right: 0.6*pageWidth};
        affectiveTraitsTableObject["theme"] ='grid';
        affectiveTraitsTableObject["columnStyles"] = {0:{halign: 'left'}};
        affectiveTraitsTableObject["styles"] = { fontStle: 'bold', lineColor:'#2405a1', cellPadding: 0.4};
        //effectiveTraitsTableObject.didDrawPage = (data)=>{
        //            psycoHeight = data.cursor.y+1;
        //        };
        doc.autoTable( affectiveTraitsTableObject);
        
        let psycoTableObject = {};
        let psycoTableArray = Object.keys(student.psychomotor);
        psycoTableObject["head"] = [["PSYCHOMOTOR", "RATING"]];
        psycoTableObject["body"] = [];
        let psycoHeight;
        psycoTableArray.forEach(function(val){
            psycoTableObject["body"].push([val.toUpperCase(), student.psychomotor[val]]);
        });
        psycoTableObject["headStyles"] = {halign: 'center', fillColor:'#006400', valign:'bottom'};
        psycoTableObject["bodyStyles"] = {halign: 'center', fillColor:false, fontStyle:'bold', fontSize:8, minCellHeight:2, textColor: tableBodyColor};
        psycoTableObject["startY"] = columnHeight+10;
        psycoTableObject["margin"] = {left:0.6 * pageWidth, right:6};
        psycoTableObject["theme"] ='grid';
        psycoTableObject["columnStyles"] = {0:{halign: 'left'}};
        psycoTableObject["styles"] = { fontStle: 'bold', lineColor:'#2405a1', cellPadding: 0.4};
        psycoTableObject["didDrawPage"] = (data)=>{
                    psycoHeight = data.cursor.y+1;
                };
        doc.autoTable( psycoTableObject);
        
        let scaleTableObject = {};
        scaleTableObject["head"] = [["SCALE"]];
        scaleTableObject["body"] = [
            ["5 - Excellent Degree of Observable Trait"],
            ["4 - Good Level of Observable Trait"],
            ["3 - Fair But Acceptabl level of Observable Trait"],
            ["2 - Poor Level of Observable Trait"],
            ["1 - No Observable Trait"]
        ];
        scaleTableObject["headStyles"] = {halign: 'center', fillColor:'#006400', valign:'bottom'};
        scaleTableObject["bodyStyles"] = {halign: 'center', fillColor:false, fontStyle:'bold', fontSize:8, minCellHeight:2, textColor:tableBodyColor};
        scaleTableObject["startY"] = psycoHeight+5;
        scaleTableObject["margin"] = {left: 0.6 * pageWidth, right:6};
        scaleTableObject["theme"] ='grid';
        scaleTableObject["columnStyles"] = {0:{halign: 'left'}};
        scaleTableObject["styles"] = { fontStle: 'bold', lineColor:'#2405a1', cellPadding: 0.4};
        
        doc.autoTable( scaleTableObject);
        
        let remarkTableObject = {};
        let studentComm = caType === 'exam' ? student.comments:formTeacherComment;
        remarkTableObject["head"] = [["Form Teacher's Remarks:"]];
        remarkTableObject["body"] = [[studentComm]];
        remarkTableObject["headStyles"] = {halign: 'center', fillColor:'#006400', valign:'bottom'};
        remarkTableObject["bodyStyles"] = {halign: 'center', fillColor:false, fontStyle:'bold', fontSize:10, minCellHeight:2, textColor: tableBodyColor};
        remarkTableObject["startY"] = pageHeight - 40;
        remarkTableObject["margin"] = {left:6, right:6};
        remarkTableObject["theme"] ='grid';
        remarkTableObject["columnStyles"] = {0:{halign: 'left'}};
        remarkTableObject["styles"] = { fontStle: 'bold', lineColor:'#2405a1', cellPadding: 0.5};
        
        doc.autoTable( remarkTableObject);

        doc.text("Form Teacher:", 8, pageHeight-19);
        doc.text(student.form_teacher[0], 58, pageHeight-19);
        doc.text("Principal's Remarks:", 8, pageHeight-15);
        doc.text(principalComment, 58, pageHeight-15); 

        
        if(caType === 'exam'){
            doc.text("Next Term Begins:", 8, pageHeight-10);
            doc.text(student.next_term_begins || next_term_begins, 58, pageHeight-10);
        }
        
        doc.setDrawColor('#2405a1');
        doc.setLineWidth(1.5);
        doc.line(5, columnHeight+9, pageWidth-5, columnHeight+9);
        
        doc.roundedRect(marginX, marginY, pageWidth-10, pageHeight-10, radiusX, radiusY, "S");
    };
    pageContent(studentForResult[0], 1);
    let count = 1;
    while(count < studentForResult.length){
        doc.addPage();
        pageContent(studentForResult[count++], count);
    }
    //doc.output('pdfobjectnewwindow');

    saveFormTeacherStudentsButton = "";
    doc.save(`${studentClass}_${caType}.pdf`);
    
}


function toDataURL(imageSrc) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.crossOrigin = 'anonymous'
        var dataURL;
    
        img.src = imageSrc;
    
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width
            canvas.height = img.height;
    
            let context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            let type = 'png'; //studentForResult[index]["photo_type"]
            dataURL = canvas.toDataURL(`image/${type.toLowerCase()}`);
            //studentForResult[index]["base64image"] = dataURL;
            resolve(dataURL);
        };
        img.onerror = reject;
    })
    
}