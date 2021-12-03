const request = require('request');
const pool = require("../models/pool");

const homePage = async (req, res, responseBody) => {
    let text;
    text = `select * from subjects`
    let schoolSubjects = await pool.query(text);
    schoolSubjects = schoolSubjects.rows[0];

    text = `select * from classes`;
    let schoolClasses = await pool.query(text);
    schoolClasses = schoolClasses.rows[0];

    text = `select * from schools where type='schoolbadge'`;
    let schoolBadge = await pool.query(text);
    let schoolBadgeUrl = '';
    if(schoolBadge.rows.length > 0){
        schoolBadge = schoolBadge.rows[0];
        schoolBadgeUrl = schoolBadge.url;
    }else {
        schoolBadge = {school_id: 1, name: 'schoolbadge', url: 'images/badge.png'}
    }

    text = `select * from schools where type='schoolbackground'`;
    let schoolBackgroundUrl = '';
    let schoolBackground = await pool.query(text);
    if(schoolBackground.rows.length > 0){
        schoolBackground = schoolBackground.rows[0];
        schoolBackgroundUrl = schoolBackground.url;
    }else {
        schoolBackground = {school_id: 1, name: 'schoolbackground', url: 'images/background.png'}
    }
    text = `select * from schools where type='schoolsignature'`;
    let schoolSignatureUrl = '';
    let schoolSignature = await pool.query(text);
    if(schoolSignature.rows.length > 0){
        schoolSignature = schoolSignature.rows[0];
        schoolSignatureUrl = schoolSignature.url;
    }else {
        schoolSignature = {school_id: 1, name: 'schoolsignature', url: 'images/signature.png'}
    }

    text = `select * from schools where type='schoolcheckmark'`;
    let schoolCheckmarkUrl = '';
    let schoolCheckmark = await pool.query(text);
    if(schoolCheckmark.rows.length > 0){
        schoolCheckmark = schoolCheckmark.rows[0];
        schoolCheckmarkUrl = schoolCheckmark.url;
    }else {
        schoolCheckmark = {school_id: 1, name: 'schoolcheckmark', url: 'images/checkmark.png'}
    }

    text = `select * from schools where type='schooldisplay' order by school_id`;
    let schoolDisplay = await pool.query(text);
    schoolDisplay = schoolDisplay.rows
    let samplSchoolDisplay = [
    ];
    if(schoolDisplay.length > 0){
        if(schoolDisplay.length < 5){
            let len = schoolDisplay.length;
            let startIndex = schoolDisplay[schoolDisplay.length -1].school_id;
            for(let i = len, img =1; i < 5; i++){
                samplSchoolDisplay.push(
                    {school_id: i, name: `image${i}`, url: `images/img${img++}.jpeg`});
            }
            schoolDisplay = [...schoolDisplay, ...samplSchoolDisplay];
        }
    }else {
        for(let i = 1, img =1; i < 6; i++){
            samplSchoolDisplay.push(
                {school_id: i, name: `image${i}`, url: `images/img${img++}.jpeg`});
        }
        schoolDisplay = samplSchoolDisplay
    }
    res.render('pages/home', {
        schoolSubjects: schoolSubjects, 
        schoolClasses: schoolClasses,
        schoolBadge: schoolBadge,
        schoolDisplay: schoolDisplay,
        schoolBadgeUrl: schoolBadgeUrl,
        schoolBackgroundUrl: schoolBackgroundUrl,
        schoolSignatureUrl: schoolSignatureUrl,
        schoolCheckmarkUrl: schoolCheckmarkUrl,
        schoolName: "Standard Comprehensive College Kano",
        schoolMotto: "Knowledge is Power"
    });
}
 
module.exports = { 
    homePage,
};