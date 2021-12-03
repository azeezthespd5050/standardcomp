

function adminClicked(event){
    myAdminModal.style.display = 'block';
}
function sectorClicked(event){
    let html = `
    <select onchange="schoolSectorChanged(event, 'fromSector')" name="form_teacher" class="w3-select">
    <option value="" disabled>Choose your option</option>
    `
    schoolSectors.forEach((sect, index) => {
        let sec = sect.replace(/classes/, "").trim();
        html += `<option value="${sec}">${sec}</option>`;
    })
    html +=`</select>`;
    myModalContent.innerHTML = html;
    myModal.style.display = 'block';
}

function addClassSubjectClicked(event){
    let html = `
        <div class="">

        <div class="w3-container w3-blue">
        <h2>Teachers Subjects Form</h2>
        </div>

        <form class="w3-container">

        <br><hr>
        <p class="w3-center">Select Sector</p>
        <select onchange="schoolSectorChanged(event, 'fromAddClassSubjects')" name="form_teacher" class="w3-select">
        <option value="">Choose your option</option>
        `;

        schoolSectors.forEach((sect, index) => {
            let sec = sect.replace(/classes/, "").trim();
            html += `<option value="${sec}">${sec}</option>`;
        })
        html +=`</select>
        <br><hr>
        <div id="modelNewClassAndSubjects"></div>

        </form>
        <button id="modelNewClassAndSubjectsButton" class="w3-large w3-center" onclick="assignClassSubjectToTeacher(event)" style="width: 100%;"  disabled>Add Class/Subject(s) </button>

        </div>
    `;
    myModalContent.innerHTML = html;
    myModal.style.display = 'block';    
}

function removeClassSubjectClicked(event){
    
    let html = `
    <div class="">

    <div class="w3-container w3-blue">
    <h2>Teachers Subjects Form</h2>
    </div>

    <form class="w3-container">

    <br><hr>
    <p class="w3-center">Select Class/Subjects to remove</p>
    <select onchange="newClassSubjectsSelectedByTeacher(event)" name="classesToRemove" class="w3-select" multiple>
    <option value="" disabled>Choose your option</option>
    `;
    if(teacher.classes){
        teacher.classes.forEach((clss, index) => {
            html += `<option value="${clss}">${clss}</option>`;
        });
    }
    html +=`</select>
        <br><hr>

        </form>
        <button id="modelNewClassAndSubjectsButton" class="w3-large w3-center" onclick="removeClassSubjectFromTeacher(event)" style="width: 100%;">Remove Class/Subject(s) </button>

        </div>
    `;
    myModalContent.innerHTML = html;
    myModal.style.display = 'block';
}

function formTeacherStudentsClicked(event){
    let html = `
        <div class="panel">
            <form class="w3-container" id="scoresForm">
                
                <div class="w3-panel" id="formTeacherDiv">
                    <p class="w3-panel w3-brown">Form Teacher</p>
                    <select onchange="formTeacherClassChanged(event)" name="selectedFormTeacherClass" class="w3-select">
                        <option value="" disabled selected>Choose subject/classes</option>`;
                        if(teacher.form_teacher){
                            teacher.form_teacher.forEach(clas => { 
                                html +=`<option value="${clas}">${clas}</option>`;
                            });
                        }
                    html +=`</select>
                </div>
            </form>
        </div>
    `;
    myModalContent.innerHTML = html
    myModal.style.display = 'block';
}

function inputScoresClicked(event){
    let html = `
        <div class="panel">
            <form class="w3-container" id="scoresForm">
                <div class="w3-panel" id="subjectTeacherDiv">
                    <p class="w3-panel w3-brown">Subject Teacher</p>
                    <select onchange="subjectTeacherClassChanged(event)" name="selectedSubjectTeacherClass" class="w3-select">
                        <option value="">Choose subject/classes</option>`;
                        if(teacher.classes){
                            teacher.classes.forEach(clas => { 
                                html +=`<option value="${clas}">${clas}</option>`;
                            });
                        }
                    html +=`</select>
                </div>
                
            </form>
        </div>
    `;
    myModalContent.innerHTML = html
    myModal.style.display = 'block';
}

function printDocsClicked(event){
    
    myDocsModal.style.display = 'block';
}