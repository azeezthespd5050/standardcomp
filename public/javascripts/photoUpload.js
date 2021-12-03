var schoolBadgeUrl;
var schoolBackgroundUrl;
var schoolSignatureUrl;
var schoolCheckmarkUrl;

// ################ Teacher Profile ########################
function teacherProfilePictureClicked(event){
    let img = event.target.id;
    let inputElem = document.getElementById("teacherProfilePictureInput");
    inputElem.setAttribute("data-img", img)
    inputElem.click();
  }
  
  function teacherProfilePictureInputChanged(target){
    let fileList = target.files;
    imgId = target.getAttribute("data-img");
    img = document.getElementById(imgId);
    let file = fileList[0]
    let albumName = "teachers";
    let name = teacher.full_name.trim().replace(/\s+/g, "_").toLowerCase();
    let fileName = name + "_" + teacher.teacher_id + "."+ (file.type.split("/")[1]);
  
    const albumPhotosKey = encodeURIComponent(albumName) + "/";
    const href = "https://s3." + REGION + ".amazonaws.com/";
    const bucketUrl = href + albumBucketName + "/";
  
    let photoKey = albumPhotosKey + fileName;
    const photoUrl = bucketUrl+photoKey;
  
    // Use s3 ManagedUpload class as it support multipart uploads
    let upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file
      }
    });
    displayInfo.innerHTML = "Saving Picture to database";
    displayInfo.style.backgroundColor = '#ff0000';
  
    let promise = upload.promise();
  
    promise.then((data)=>{
      let url = URL.createObjectURL(file);
      img.src = url;
      let formData = {
        username: teacher.username,
        password: teacher.password,
        image_url: photoUrl
      };
      postData('/teacher/'+teacher.teacher_id+'/putpicture', 'PUT',formData).then((html) => {
        
        displayInfo.innerHTML = "Picture uploaded";
        displayInfo.style.backgroundColor = '';
      });
    }, (err)=>{
      return alert("There was an error uploading your photo: ", err.message)
    });
  }
  // ################ Teacher Profile END ########################
  
  // ################ STUDENT Profile START ########################
  function studentProfilePictureClicked(event, student_id){
    let img = event.target.id;
    let studentId = JSON.parse(student_id);
    let inputElem = document.getElementById("studentProfilePictureInput_"+studentId);
    inputElem.setAttribute("data-img-student-"+studentId, img)
    inputElem.click();
  }
  
  function studentProfilePictureInputChanged(target, student){
    student = JSON.parse(student);
    let studentId = student.student_id;
    let fileList = target.files;
    imgId = target.getAttribute("data-img-student-"+studentId);
    img = document.getElementById(imgId);
    let file = fileList[0];
    if((file.size) * 0.001 > 50 ){
      myModalContent.innerHTML =`<h3 class="w3-yellow">image size cannot be greater than 50Kb.
                                  Please resize and retry</h3>`;
      myModal.style.display = 'block';
      return;
    }
    let albumName = "students";
    let name = student.full_name.trim().replace(/\s+/g, "_").toLowerCase();
    let fileName = name + "_" + studentId + "."+ (file.type.split("/")[1]);
  
    const albumPhotosKey = encodeURIComponent(albumName) + "/";
    const href = "https://s3." + REGION + ".amazonaws.com/";
    const bucketUrl = href + albumBucketName + "/";
  
    let photoKey = albumPhotosKey + fileName;
    const photoUrl = bucketUrl+photoKey;
  
    // Use s3 ManagedUpload class as it support multipart uploads
    let upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file
      }
    });
    displayInfo.innerHTML = "Saving Picture to database";
    displayInfo.style.backgroundColor = '#ff0000';
  
    let promise = upload.promise();
  
    promise.then((data)=>{
      let url = URL.createObjectURL(file);
      img.src = url;
      let formData = {
        username: teacher.username,
        password: teacher.password,
        image_url: photoUrl
      };
      postData('/student/'+student.student_id+'/putpicture', 'PUT',formData).then((html) => {
        
        displayInfo.innerHTML = "Picture uploaded";
        displayInfo.style.backgroundColor = '';
      });
    }, (err)=>{
      return alert("There was an error uploading your photo: ", err.message)
    });
  }
  // ################ Student Profile END ########################
  
  // ################ School Profile START ########################
  function schoolProfilePictureClicked(event, id){
    let img = event.target.id;
    let itemId = id.replace(/"/g, "");
    let numb = itemId.split("_")[1];
    let inputElem = document.getElementById(itemId);
    inputElem.setAttribute("data-img-schoolItem", img);
    inputElem.click();
  }
  
  function schoolProfilePictureInputChanged(target, type){
    type = type.replace(/"/g, '');
    let fileList = target.files;
    let imgId = target.getAttribute("data-img-schoolItem");
    let numb = imgId.split("_")[1];
    let img = document.getElementById(imgId);
    let file = fileList[0];
    if((file.size) * 0.001 > 150 ){
      myModalContent.innerHTML =`<h3 class="w3-yellow">image size cannot be greater than 150Kb.
                                  Please resize and retry</h3>`;
      myModal.style.display = 'block';
      return;
    }
    let albumName = "schoolphotos";
    let name = file.name;
    let fileName = name;
  
    const albumPhotosKey = encodeURIComponent(albumName) + "/";
    const href = "https://s3." + REGION + ".amazonaws.com/";
    const bucketUrl = href + albumBucketName + "/";
  
    let photoKey = albumPhotosKey + fileName;
    const photoUrl = bucketUrl+photoKey;
  
    // Use s3 ManagedUpload class as it support multipart uploads
    let upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file
      }
    });
    displayInfo.innerHTML = "Saving Picture to database";
    displayInfo.style.backgroundColor = '#ff0000';
  
    let promise = upload.promise();
  
    promise.then((data)=>{
      let url = URL.createObjectURL(file);
      img.src = url;
      let formData = {
        name: name,
        url: photoUrl,
        type: type,
        "school_id": numb
      };
      postData('/school/'+ numb +'/putpicture', 'PUT',formData).then((html) => {
        
        displayInfo.innerHTML = "Picture uploaded";
        displayInfo.style.backgroundColor = '';
        schoolBadgeUrl = photoUrl;
      });
    }, (err)=>{
      return alert("There was an error uploading your photo: ", err.message)
    });
  }
  // ################ School Profile END ########################
  