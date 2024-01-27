const express = require('express');

const router = express.Router();
const Post = require('../models/Post');

const { parse } = require('dotenv');
const { compare } = require('bcrypt');
const fs = require("fs");
const path = require('path');

//Model
const uploadFile = require('../models/uploadFile');
const uploadDocs = require('../models/uploadDocs');
const student_info = require('../models/StudentInfo');
const company_info = require('../models/CompanyInfo');
const request_info = require('../models/RequestInfo');
const request_ser = require('../models/RequestService');
const certificate = require('../models/Certificate');
const document = require('../models/Document');

var modal = "close";
var std = "";
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
        cb(null, 'public/uploads')
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

const UploadImgProfile = async (req,res,next) => {
    try{
        // console.log(req.body);
        const obj = JSON.parse(JSON.stringify(req.body));
        // console.log(obj['fullname']);
        var files = new uploadFile ({
            fileName: req.file.filename,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size,2),
            // stdID: req.file.stdid
        });
        // console.log(files);
        await files.save();
        res.status(201).send('File Upload Successfully');
    }catch(error){
        console.log('error');
        res.status(400).send(error);
    }
}

const AddDoc = async (req,res,next) => {
    try{
        const obj = JSON.parse(JSON.stringify(req.body));
        var files = new uploadFile ({
            fileName: req.file.filename,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size,2),
        });
        
        new_document = new document({
            title: req.body.title,
            details: req.body.details,
            downloadDoc: files.fileName,
            createdBy: req.body.username,
            updatedBy: req.body.username,
        });

        await new_document.save();
        res.redirect('/upload-docs');
    }catch(error){
        console.log('error');
        res.status(400).send(error);
    }
}

const EditDoc = async (req,res,next) => {
    try{
        const obj = JSON.parse(JSON.stringify(req.body));

        const id = req.body.id;
        var temp = 0;
        const request_doc = (await document.find({'_id':id})).at(0);
        console.log(request_doc);
        if(request_doc.title!=req.body.title){
            request_doc.title=req.body.title;
            temp++;
        }
        if(request_doc.details!=req.body.details){
            request_doc.details=req.body.details;
            temp++;
        }

        if(req.file != null){
            var files = new uploadFile ({
            fileName: req.file.filename,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size,2),
        });
        if(request_doc.downloadDoc!=files.fileName ){
            const path = 'public/uploads/'+ request_doc.downloadDoc;
            fs.unlink(path, (err) => {
            if (err) {
                console.error(err)
                return
            }
            })
            request_doc.downloadDoc=files.fileName;
            temp++;
        }
        }
        
        if(temp!=0){
            await request_doc.save();
        }

        res.redirect('/upload-docs');
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }
}

const UploadDocuments = async (req,res,next) => {

    std_info = new student_info({
        name: req.body.fullname,
        student_code: req.body.std_id,
        education: req.body.lv,
        grade:  req.body.gpa,
        factory: req.body.factory,
        email: req.body.email,
        phone: req.body.tel,
        health_coverage: req.body.medical_rights,
        image: req.files[0].filename,
    });

    const saved_std_info = await std_info.save();
    console.log(req.files);
    reqInfo = new request_info({
        student_code: req.body.std_id,
        doc_request_intern: req.files[1].filename,
        doc_approve_parrent: req.files[2].filename,
        doc_resume: req.files[3].filename,
        doc_transcript: req.files[4].filename,
        working_style: req.body.working_style,
        // intern_format: req.body.working_style,
        doc_approve_company: req.body.acceptance,
    });

    const saved_reqInfo= await reqInfo.save();

    com_info = new company_info({
        company_name: req.body.location,
        tel: req.body.company_tel,
        address: req.body.address,
        type_business: req.body.aboutcompany,
        student_code: req.body.std_id,
        position: req.body.position,
        province: req.body.province,
        receiver_name: req.body.receiver,
        mentor: req.body.coordinator,
        tel_mentor: req.body.coordinator_tel,
        start_intern: req.body.start_intern,
        end_intern: req.body.end_intern,
        submission_date: req.body.submission_date,
        district: req.body.district,
        subdistrict: req.body.subdistrict,
        provinceID: req.body.code,
    });

    const saved_com_info= await com_info.save();

    cer_info = new certificate({});

    const saved_cer_info= await cer_info.save();

    request_service = new request_ser({
        student_info: saved_std_info._id,
        request_info: saved_reqInfo._id,
        company_info: saved_com_info._id,
        certificate_info: saved_cer_info._id
    })
    await request_service.save();

    try{
        let filesArray = [];
        const obj = JSON.parse(JSON.stringify(req.body));
        var index = 0;
        console.log(req.body); 
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
        res.redirect('/request');
        // res.status(201).send('File Upload Successfully');
    }catch(error){
        console.log('error');
        res.status(400).send(error);
    }
}

router.get('/download-pdf/:filename', (req, res) => {
    // Access the dynamic parameter using req.params
    const fileName = req.params.filename;
    console.log(fileName);
    // Assuming the files are in the 'upload' directory
    const filePath = `public/uploads/${fileName}`;
    console.log(filePath);
    // Set the correct Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    console.log('test');
    // Trigger the file download
    res.download(filePath);
});

router.get('/download-doc-teacher/:filename', (req, res) => {
    // Access the dynamic parameter using req.params
    const fileName = req.params.filename;
    console.log(fileName);
    // Assuming the files are in the 'upload' directory
    const filePath = `public/uploads/${fileName}`;
    console.log(filePath);
    // Set the correct Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    console.log('test');
    // Trigger the file download
    res.set({
        'location': "'/upload-docs'"
    });
    res.download(filePath);
});
//Router

router.post('/uploadImgProfile',upload.single('file'),UploadImgProfile);
router.post('/uploadRequest',upload.array('file',5),UploadDocuments);
router.post('/update-add',upload.single('file'),AddDoc);

router.post('/edit-doc', upload.single('file'),EditDoc);
router.get('/delete-doc/:id',async (req,res) => {
    const id = req.params.id;
    const request_doc = (await document.find({'_id':id})).at(0);
    const path = 'public/uploads/'+request_doc.downloadDoc.toString();
    console.log(id);
    console.log(request_doc);
    console.log(path);
    const result = await document.deleteOne(request_doc);
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
    res.redirect('/upload-docs');
});

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
        const request_doc = (await request_info.find({'student_code':'633020568-3'})).at(0);
        const data = (await student_info.find({'student_code':'633020568-3'})).at(0);
        const company = (await company_info.find({'student_code':'633020568-3'})).at(0);
        // const addres = (await address.find()).at(0);
        console.log(data.image);
        // console.log(company.start_intern.toISOString().split('T')[0]);
        res.render('index', {locals,data,company,request_doc});
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

    request_ser.find({status:'0'}).populate('student_info').populate('company_info').populate('request_info')
    .then(requests => {
    // Process the requests or store them in the 'all_request' array
    const count_request = requests.length
    // Render the page with the requests
    var found =false
    if(std){
        found = requests.find((element) => element.student_info.student_code == '633020568-3');
        if (found) {
            modal ="";
        }
    }
    res.render('index', { locals,requests,count_request,found,modal });
    })
    .catch(error => {
    console.error('Error retrieving documents:', error);

    // Handle the error and render the page with an error message if needed
    res.render('error', { locals: { errorMessage: 'Failed to retrieve requests.' } });
    });
});

router.post('/request-teacher/update', async (req,res) => {
    
    var std_info = (await student_info.find({'student_code':req.body.student_code})).at(0);
    var com_info = (await company_info.find({'student_code':req.body.student_code})).at(0);
    var req_info = (await request_info.find({'student_code':req.body.student_code})).at(0);
    var status1 = req.body.status1;
    var status2 = req.body.status2;
    var status3 = req.body.status3;
    if(!req.body.status1){
        status1  = "0";
    }
    if(!req.body.status2){
        status2  = "0";
    }
    if(!req.body.status3){
        status3  = "0";
    }
    if(req.body.name != std_info.name){ std_info.name=req.body.name;}
    if(req.body.student_code != std_info.student_code){std_info.student_code=req.body.student_code;}
    if(req.body.education != std_info.education){std_info.education=req.body.education;}
    if(req.body.factory != std_info.factory){std_info.factory=req.body.factory;}
    if(req.body.grade != std_info.grade){std_info.grade=req.body.grade;}
    if(req.body.email != std_info.email){std_info.email=req.body.email;}
    if(req.body.tel != std_info.tel){std_info.tel=req.body.tel ;}
    if(req.body.comment1 != std_info.comment){std_info.comment=req.body.comment1;}
    if(req.body.status1 != std_info.status){std_info.status=status1;}
    if(req.body.start_intern != com_info.start_intern){std_info.com_info=new Date(req.body.start_intern);}
    if(req.body.end_intern != com_info.end_intern){std_info.com_info.end_intern=new Date(req.body.end_intern);}
    if(req.body.comment2 != com_info.comment){com_info.comment=req.body.comment2;console.log('hihihihihihi');}
    if(req.body.status2 != com_info.status){com_info.status=status2;}
    if(req.body.comment3 != req_info.comment){req_info.comment=req.body.comment3;}
    if(req.body.status3 != req_info.status){req_info.status=status3;}
    await std_info.save();
    await com_info.save();
    await req_info.save();
    res.redirect('/request-teacher');
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

router.get('/upload-docs',async (req,res) => {
    const locals = {
        title : "document",
        description:"Internship request",
        styles: "/css/document.css",
        js: "/js/base.js",
        user: "teacher",
        username: "teacher01",
        content:"../layouts/teacher/upload-docs.ejs",
        bar4: "active"
    }
    try{
        let perPage = 15;
        let page = req.query.page || 1;

        const data = await document.aggregate([ { $sort: {createdAt: -1 }}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = await document.countDocuments({});
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

router.get('/uploads/:file', (req,res) => {
    const file = req.params.file;
    const locals = {
        title : "calendar",
        description:"Internship request",
        styles: "/css/pdf.css",
        js: "/js/base.js",
        user: "teacher",
        filename: file,
        content:"../layouts/file-pdf.ejs"   , 
        bar7: "active"}
        console.log(locals);
    res.render('index', {locals});
});


module.exports = router;