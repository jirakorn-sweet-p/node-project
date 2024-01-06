const express = require('express');

const router = express.Router();
const Post = require('../models/Post');

const { parse } = require('dotenv');
const { compare } = require('bcrypt');

//Model
const uploadFile = require('../models/uploadFile');
const uploadDocs = require('../models/uploadDocs');
const student_info = require('../models/StudentInfo');
const company_info = require('../models/CompanyInfo');
const request_info = require('../models/RequestInfo');
const imageModel = require('../models/imageModel');
const address = require('../models/Address');

//test
// SET STORAGE
// let cc = 0;
const multer = require("multer");
// SET STORAGE
var storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        // console.log(req);
        // console.log(cc);
        // cc++;
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
  })

  const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
        || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'){
            cb(null, true);
        }else {
            console.log(file.mimetype + ' not supported !!!');
            cb(null, false);
        }
}

var upload = multer({storage: storage, fileFilter: filefilter});

// END SET STORAGE

//test
// const path = require('path');
// const fs = require("fs");
// router.post("/uploadphoto",upload.single('myImage'),(req,res)=>{
//     var img = fs.readFileSync(req.file.path);
//     var encode_img = img.toString('base64');
//     var final_img = {
//         contentType:req.file.mimetype,
//         image: Buffer.from(encode_img,'base64')
//     };
//     console.log(req.file.path);
//     imageModel.create(final_img)
//     .then((result) => {
//             console.log(result.img.Buffer);
//             console.log("Saved To database");
//             res.contentType(final_img.contentType);
//             // res.send(final_img.image);
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// })
//endtest

const fileSizeFormatter = (bytes,decimal) => {
    if(bytes === 0 ){
        return '0 Bytes';
    }
    const dm = decimal || 2;
    const sizes = ['Bytes','KB','MB','GB','TB','PB','EB','YB','ZB'];
    const index = Math.floor(Math.log(bytes)/Math.log(1000));
    return parseFloat(bytes / Math.pow(1000,index)).toFixed(dm)+' '+sizes[index]
}

const UploadFile = async (req,res,next) => {
    try{
        console.log(req.body);
        const obj = JSON.parse(JSON.stringify(req.body));
        // console.log(obj['fullname']);
        var files = new uploadFile ({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size,2),
            // stdID: req.file.stdid
        });
        console.log(files);
        await files.save();
        res.status(201).send('File Upload Successfully');
    }catch(error){
        console.log('error');
        res.status(400).send(error);
    }
}

const UploadDocuments = async (req,res,next) => {
    try{
        let filesArray = [];
        const obj = JSON.parse(JSON.stringify(req.body));
        var index = 0;
        // console.log(req.body); 
        req.files.forEach(element => {
            
            const file = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileSize: fileSizeFormatter(element.size, 2),
                std_id: obj['std_id'],
                category: index
            }

            index++;
            filesArray.push(file);
        });
        const Documents = new uploadDocs({
            title: 'document',
            file: filesArray
        });
        await Documents.save();
        res.status(201).send('File Upload Successfully');
    }catch(error){
        console.log('error');
        res.status(400).send(error);
    }
}



//Router

router.post('/uploadImgProfile',upload.single('file'),UploadFile);
router.post('/uploadRequest',upload.array('file',6),UploadDocuments);

router.get('/request', (req,res) => {
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/style.css",
        js: "/js/base.js",
        user: "student",
        content:"../layouts/request.ejs",
        bar1: "active"
    }
    res.render('index', {locals});
});

router.get('/about', (req,res) => {
    res.render('about');
});

router.get('/request/form', (req,res) => {
    const locals = {
        title : "request-form",
        description:"Internship request",
        styles: "/css/request-form.css",
        js: "/js/base.js",
        user: "student",
        content:"../layouts/request-form.ejs",
        bar1: "active"
    }
    res.render('index', {locals});
});

router.get('/request-status',async (req,res) => {
    const locals = {
        title : "request-status",
        description:"Internship request",
        styles: "/css/status.css",
        js: "/js/base.js",
        user: "student",
        status: true,
        content:"../layouts/request-status.ejs",
        bar2: "active"
    }
    
    try{
        // find by username : student_id
        
        const data = (await student_info.find({'student_code':'633020568-3'})).at(0);
        const company = (await company_info.find({'student_code':'633020568-3'})).at(0);
        const addres = (await address.find()).at(0);
        res.render('index', {locals,data,company,addres});
    }catch(error){
        console.log("wtf : "+error);
    }
});

router.get('/document', (req,res) => {
    const locals = {
        title : "document",
        description:"Internship request",
        styles: "/css/document.css",
        js: "/js/base.js",
        user: "student",
        content:"../layouts/document.ejs",
        bar3: "active"
    }
    res.render('index', {locals});
});

router.get('/news', async (req,res) => {
    const locals = {
        title : "news",
        description:"Internship request",
        styles: "/css/news.css",
        js: "/js/base.js",
        user: "student",
        content:"../layouts/news.ejs",
        bar4: "active"
    }

    try{
        let perPage = 6;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: {createdAt: -1 }}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments({});
        let allPage = Math.ceil(count/perPage);
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= allPage;

        res.render('index', {
            locals, 
            data,
            tt: count,
            current: page,
            all_pages:allPage,
            nextPage: hasNextPage ? nextPage : null
        });

    }catch(error){  
        console.log(error);
    }

    
});

router.get('/company', (req,res) => {
    const locals = {
        title : "company",
        description:"Internship request",
        styles: "/css/company.css",
        js: "/js/base.js",
        user: "student",
        content:"../layouts/company.ejs"   , 
        bar5: "active"}
    
    res.render('index', {locals});
});

router.get('/calendar', (req,res) => {
    const locals = {
        title : "calendar",
        description:"Internship request",
        styles: "/css/calendar.css",
        js: "/js/base.js",
        user: "student",
        content:"../layouts/calendar.ejs"   , 
        bar6: "active"}
    
    res.render('index', {locals});
});


router.get('/about', (req,res) => {
    res.render('about');
});

//
//
//
//teacher

router.get('/request-teacher', (req,res) => {
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/request-teacher.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/request-teacher.ejs",
        bar1: "active"
    }
    res.render('index', {locals});
});

router.get('/requests-all-teacher', (req,res) => {
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/request-teacher.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/requests-all-teacher.ejs",
        bar2: "active"
    }
    res.render('index', {locals});
});

router.get('/pass-status-requests', (req,res) => {
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/request-teacher.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/pass-status-requests.ejs",
        bar3: "active"
    }
    res.render('index', {locals});
});

router.get('/upload-docs', (req,res) => {
    const locals = {
        title : "document",
        description:"Internship request",
        styles: "/css/document.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/upload-docs.ejs",
        bar4: "active"
    }
    res.render('index', {locals});
});

router.get('/upload-news', async (req,res) => {
    const locals = {
        title : "news",
        description:"Internship request",
        styles: "/css/news.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/upload-news.ejs",
        bar5: "active"
    }

    try{
        let perPage = 6;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: {createdAt: -1 }}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments({});
        let allPage = Math.ceil(count/perPage);
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= allPage;

        res.render('index', {
            locals, 
            data,
            tt: count,
            current: page,
            all_pages:allPage,
            nextPage: hasNextPage ? nextPage : null
        });

    }catch(error){  
        console.log(error);
    }

    
});

router.get('/all-companys', (req,res) => {
    const locals = {
        title : "company",
        description:"Internship request",
        styles: "/css/company.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/all-companys.ejs"   , 
        bar6: "active"}
    
    res.render('index', {locals});
});

router.get('/upload-calendar', (req,res) => {
    const locals = {
        title : "calendar",
        description:"Internship request",
        styles: "/css/calendar.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/upload-calendar.ejs"   , 
        bar7: "active"}
    
    res.render('index', {locals});
});
// function insertCompanyInfoData (){
// //     // address.insertMany([{
// //     //     location:"หมู่ที่ 16 123 ถนน กัลปพฤกษ์",
// //     //     sub_district:"ในเมือง",
// //     //     district:"เมือง",
// //     //     province:"ขอนแก่น",
// //     //     code:"40002"
// //     //     }])
//     const tt = "653061bd9e76375a66b99ccd";
//     company_info.insertMany([
//         {
//             student_code:"633020568-3",
//             company_name: "บริษัท น่าอยู่ คอร์ปอเรชั่น จำกัด",
//             tel:"0865720679",
//             address:tt,
//             type_business:"ข้อมูลข่าวสารและการสื่อสาร",
//             position: "backend",
//             province:"khonkhean",
//             receiver_name:"นที นทีทอง",
//             mentor:"ปริยาดา อากามะ",
//             tel_mentor:"0897983564",
//             start_intern:Date.parse("2023-03-01"),
//             end_intern:Date.parse("2023-07-01"),
//             status:"pending",
//             editor:"ผู้ช่วยศาสตราจารย์ สิลดา อินทรโสธรฉันท์"
//         }
//     ])
// }
// insertCompanyInfoData();

// function insertStudentInfoData (){
//     student_info.insertMany([
//         {
//             name: "จิรากร ดอนหัวบ่อ",
//             student_code:"633020568-3",
//             education:4,
//             factory:"วิทยาการคอมพิวเตอร์",
//             grade: 3.5,
//             email:"jirakorn@kkumail.com",
//             phone:"0972981005",
//             health_coverage:"โรงพยาบาลศรีนครินทร์"
//         }
//     ])
// }
// insertStudentInfoData();

module.exports = router;