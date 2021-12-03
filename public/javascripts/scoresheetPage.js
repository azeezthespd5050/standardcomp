
function printScoresheet(id) {
    let html = termSessionClass();
    html +=`
    <button class="w3-large w3-center" onclick="downloadScoresheet(${id}, 'classSelection')" style="width: 200px;"> Download Scoresheet </button>
    `;
    myModalContent.innerHTML = html;
    myModal.style.display = 'block';
}

function downloadScoresheet(selectId){
    let studClass = window["currentFormTeacherStudents"];
    let names = {
    };
    let selects = myModalContent.querySelectorAll('select')
    for(let select of selects){
        for(let opt of select.selectedOptions){
            names[select.name] = opt.value;
        }
    }

    let studentClass = names["studentClass"];
    let term = names["term"];
    let session = names["session"];
    let students = window[`${studentClass}_formTeacherStudents`];


    if(!students){
        return myModalContent.innerHTML = studentClass + " not in localStorage load it first";
    }
    let head = [['ID', 'NAME', "C.A.1\n(20%)","C.A.2\n(20%)", "Exam\n(60)"]]
  
    let data = [
    ]
    students.forEach((student, index) => {
        let fullName = student.full_name.toUpperCase();
        let sampleArray = [];
        sampleArray.push(`${index+1}`);
        sampleArray.push(fullName );
        for(let i=1; i<3; i++){
          sampleArray.push("");
        }
        data.push(sampleArray);
    });

    const doc = new jsPDF({
        orientation: "P"
    });
    let pageWidth = doc.internal.pageSize.getWidth();
    let pageHeight = doc.internal.pageSize.getHeight();
    let result_type  = `${studentClass.toUpperCase()} SCORESHEET FOR ${term.replace(/term/i, "").toUpperCase()} TERM, ${session} ACADEMIC SESSION`;
    let school_name = "STANDARD COMPREHENSIVE COLLEGE KANO"

    doc.setFontSize(18);
    let nameLen = doc.getTextWidth(school_name);
    let namePos = 0.5*pageWidth - 0.5*nameLen
    doc.text(school_name, namePos, 13);

    doc.setFontSize(15);
    let typeLen = doc.getTextWidth(result_type);
    let typePos = 0.5*pageWidth - 0.5*typeLen;
    doc.text(result_type, typePos, 18);

    doc.setFontSize(11);
    doc.setTextColor(100);


    doc.autoTable({
      head: head,
      body: data,
      theme: 'grid',
      margin: {top: 20},
      headStyles: {fillColor:'', textColor:'#000', valign:'bottom', halign:'center'},
      bodyStyles: {textColor: '#000'},
      styles: {cellPadding: 0.7, lineColor: [0, 0, 0], lineWidth:0.5},
      columnStyles:{"1":{textColor:'#000'}},
      didDrawCell: data => {
        //console.log(data.column.index)
      }
    })

    // below line for Open PDF document in new tab
    doc.output('dataurlnewwindow')

    // below line for Download PDF document  
    doc.save(studentClass+'_scoresheet.pdf');
    //doc.save("test.pdf");
}