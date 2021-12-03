
async function printDoc(id){
  let html;
  if(id === 'result'){
    html = `in result`;
    printResult(id);
  }else if(id === 'broadsheet'){

    html = `in broadsheet`;
    printBroadsheet(id)
  }else if(id === 'scoresheet'){
    html = `in scoresheet`

    printScoresheet(id);
  }
  myDocsModal.style.display = 'none';
}


//document.getElementsByClassName("tablink")[0].click();
function openDoc(evt, cityName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("doc");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].classList.remove("w3-light-grey");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.classList.add("w3-light-grey");

  printDoc(cityName);
}
