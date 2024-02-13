const express = require('express');

const router = express.Router();
const Post = require('../models/Post');

const { parse } = require('dotenv');
const bcrypt = require('bcrypt');
const fs = require("fs");
const path = require('path');
const ObjectId = require('mongoose').Types.ObjectId;

const puppeteer = require('puppeteer');
//Model
const uploadFile = require('../models/uploadFile');
const uploadDocs = require('../models/uploadDocs');
const student_info = require('../models/StudentInfo');
const companys = require('../models/Company');
const company_info = require('../models/CompanyInfo');
const request_info = require('../models/RequestInfo');
const request_ser = require('../models/RequestService');
const certificate = require('../models/Certificate');
const document = require('../models/Document');
const position = require('../models/Position');
const companies = require('../models/Company');
const users = require('../models/User');

const redirectIfAuth = require('../middleware/redirectIfAuth');
const redirectNotAuth = require('../middleware/redirectNotAuth');

// generate doc
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

// changing modal กำลังแก้
var modal_bg1 = "close";
var modal_bg2 = "close";
var modal1 = "close";
var modal2 = "close";
var modal3 = "close";

// manage modal
var bg1 = "close";
var mod1 = "close";
var alert = "close";
// end manage modal
var std = "";

// Profile IMAGE
var profile = "profile-1.jpg";

// SET STORAGE
const multer = require("multer");
const { log } = require('util');
const { error } = require('console');
const session = require('express-session');
// SET STORAGE
var storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
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
        const obj = JSON.parse(JSON.stringify(req.body));
        var files = new uploadFile ({
            fileName: req.file.filename,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size,2),
        });
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

    const std_info = new student_info({
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
    const reqInfo = new request_info({
        student_code: req.body.std_id,
        doc_request_intern: req.files[1].filename,
        doc_approve_parrent: req.files[2].filename,
        doc_resume: req.files[3].filename,
        doc_transcript: req.files[4].filename,
        working_style: req.body.working_style,
        // intern_format: req.body.working_style,
        doc_approve_company: req.body.acceptance,
    });
    var temp = "0";//match
    var company = new Object();
    if(req.body.found=="not-match"){
        //not-match
        temp = "2";
        company = new companys({
        name: req.body.location,
        tel: req.body.company_tel,
        address: req.body.address,
        type_business: req.body.aboutcompany,
        province: req.body.province,
        district: req.body.district,
        subdistrict: req.body.subdistrict,
        provinceID: req.body.code,
        status: temp,
        });
        await company.save()
    }else{
        //match
        temp = "1";
        company = (await companys.find({'name':req.body.location})).at(0);
        company.status = temp;
        await company.save()
    }
    const com_info = new company_info({
        company:company,
        type_business: req.body.aboutcompany,
        student_code: req.body.std_id,
        position: req.body.position,
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
    const cer_info = new certificate({});

    const saved_std_info = await std_info.save();
    const saved_reqInfo= await reqInfo.save();
    const saved_com_info= await com_info.save();
    const saved_cer_info= await cer_info.save();

    const dat = await users.findOne({ '_id': loggedIn });
    dat.student_info = saved_std_info._id;
    await dat.save();

    const request_service = new request_ser({
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
router.get('/register',redirectIfAuth, (req, res) => {
    const locals = {
        title: "register",
        description: "Internship request",
        styles: "/css/style.css",
        js: "/js/req.js",
        user: "student",
        content: "../layouts/register.ejs",
        bar1: "active"
    };

    // Retrieve validationErrors from flash message
    const validationErrors = req.flash('validationErrors');
    const data = req.flash('data')[0] || {};
    let { username, password } = data;

    if( data != undefined){
        username = data.username;
        password = data.password;
    }

    console.log('**************');
    console.log(username);
    console.log(password);
    res.render('index', { locals, errors: validationErrors,username,password});
});

router.post('/user/register', redirectIfAuth, (req, res) => {
    // Assuming you have a 'users' model with 'username', 'password', and 'role' fields
    users.create({
        username: req.body.username,
        password: req.body.password,
        role: "student",
    }).then(() => {
        console.log("User Registered Successfully!");
        res.redirect('/request');
    }).catch((error) => {
        if (error) {
            // Handle validation errors and redirect back to the registration form
            // ...

            return res.redirect('/register');
        }
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});

router.get('/login',redirectIfAuth, (req, res) => {

    const locals = {
        title : "login",
        description:"Internship request",
        styles: "/css/style.css",
        js: "/js/req.js",
        user: "student",
        content:"../layouts/login.ejs",
        bar1: "active"
    }

    res.render('index', {locals,login:true});
});

router.post('/user/login',redirectIfAuth, async (req, res) => {
    const locals = {
        title: "login",
        description: "Internship request",
        styles: "/css/style.css",
        js: "/js/req.js",
        user: "student",
        content: "../layouts/login.ejs",
        bar1: "active"
    };

    const { username, password } = req.body;

    try {
        const user = await users.findOne({ username: username });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.userId = user._id;
                res.redirect('/request');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});

router.get('/logout', async (req, res) => {
    const locals = {
        title: "login",
        description: "Internship request",
        styles: "/css/style.css",
        js: "/js/req.js",
        user: "student",
        content: "../layouts/login.ejs",
        bar1: "active"
    };
    
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

router.get('/download-pdf/:filename', (req, res) => {
    // Access the dynamic parameter using req.params
    const fileName = req.params.filename;
    // Assuming the files are in the 'upload' directory
    const filePath = `public/uploads/${fileName}`;
    // Set the correct Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Trigger the file download
    res.download(filePath);
});

router.get('/download-doc-teacher/:filename', (req, res) => {
    // Access the dynamic parameter using req.params
    const fileName = req.params.filename;
    // Assuming the files are in the 'upload' directory
    const filePath = `public/uploads/${fileName}`;
    // Set the correct Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    // Trigger the file download
    res.set({
        'location': "'/upload-docs'"
    });
    res.download(filePath);
});

router.get('/pdf', async (req, res) => {
    const locals = {
        title: "pdf",
        description: "Internship request",
        user: "student",
        content: "../layouts/approval-docs.ejs",
        bar1: "active"
    };

    try {
        const approval = req.session.approval;

        if (approval) {
            const company_list = [];
            const ser_list = [];

            for (const key in approval) {
                const temp = [];
                const ser = await request_ser.findOne({ '_id': key });
                const cms = await company_info.findOne({ '_id': ser.company_info._id });
                const cm = await companies.findOne({ '_id': cms.company._id });

                const aggregationPipeline = [
                    { $match: { _id: new ObjectId(key) } },
                    {
                        $lookup: {
                            from: 'studentinfos',
                            localField: 'student_info',
                            foreignField: '_id',
                            as: 'student_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'requestinfos',
                            localField: 'request_info',
                            foreignField: '_id',
                            as: 'request_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'companyinfos',
                            localField: 'company_info',
                            foreignField: '_id',
                            as: 'company_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'certificateschemas',
                            localField: 'certificate_info',
                            foreignField: '_id',
                            as: 'certificate_info'
                        }
                    },
                    {
                        $addFields: {
                            student_info: { $arrayElemAt: ['$student_info', 0] },
                            request_info: { $arrayElemAt: ['$request_info', 0] },
                            company_info: { $arrayElemAt: ['$company_info', 0] },
                            certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
                        }
                    },
                    {
                        $lookup: {
                            from: 'companies',
                            localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                            foreignField: '_id',
                            as: 'company_info.company'
                        }
                    },
                    {
                        $addFields: {
                            'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
                        }
                    }
                ];

                const data = await request_ser.aggregate(aggregationPipeline).exec();

                if (!company_list.includes(cm.name)) {
                    company_list.push(cm.name);
                    temp.push(data);
                    ser_list.push(temp);
                } else {
                    ser_list[company_list.indexOf(cm.name)].push(data);
                }
            }

            res.render('index', { locals, ser_list, company_list });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/generate-pdf', async (req, res) => {
    try {
      // Launch a headless browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      // Navigate to the website
      await page.goto('http://localhost:8000/pdf', { waitUntil: 'networkidle0' });
  
      // Generate PDF from the website
      const pdfBuffer = await page.pdf({ format: 'A4' });
  
      // Close the browser
      await browser.close();
  
      // Set response headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=output.pdf');
  
      // Send the generated PDF as the API response
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

//Router
router.post('/uploadImgProfile',upload.single('file'),UploadImgProfile);
router.post('/uploadRequest',redirectNotAuth,upload.array('file',5),UploadDocuments);
router.post('/update-add',upload.single('file'),AddDoc);

router.post('/edit-doc', upload.single('file'),EditDoc);
router.get('/delete-doc/:id',async (req,res) => {
    const id = req.params.id;
    const request_doc = (await document.find({'_id':id})).at(0);
    const path = 'public/uploads/'+request_doc.downloadDoc.toString();
    const result = await document.deleteOne(request_doc);
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
    res.redirect('/upload-docs');
});

router.get('/request',redirectNotAuth, async (req,res) => {

    const dat = await users.findOne({ '_id': loggedIn });
    var user = new Object();
    if(dat.role == "student"){
        var userId = new ObjectId(dat.student_info);
        console.log(userId);
        user = await student_info.findOne({ '_id': dat.student_info });
    }
    console.log(user);
    var image = 'profile-1.jpg';
    var name = dat.username;
    if(user){
        image = user.image;
        name = user.name;
        req.session.firstlogin = false;
    }else{
        req.session.firstlogin = true;
    }
    
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/style.css",
        js: "/js/req.js",
        user: dat.role,
        content:"../layouts/request.ejs",
        bar1: "active",
        profile:image,
        name:name,
        first:req.session.firstlogin,
    }
    try{
        const data = await request_ser.aggregate([
        { $match: { student_info: user._id } },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
        ]).exec();

        var status = [];
        var temp = [];
        var all_status = [];
        data.forEach(element => {
            temp.push(element.student_info.status);
            temp.push(element.company_info.status);
            temp.push(element.request_info.status);
        });
        for (let index = 0; index < temp.length; index++) {
            const element = temp[index];
             if(element == '1'){
                status.push('status-pass')
            }else if (element == '2'){
                status.push('status-fail')
            }else{
                status.push('')
            }
            // 3status
            if((index+1)%3 == 0){
                all_status.push(status);
                status=[];
            }
        }
    
        res.render('index', {locals,data,status:all_status});
    }catch(error){
        console.log(error);
        const data = null;
        const all_status = null;
        res.render('index', {locals,data,status:all_status});
    }
});

router.get('/about',redirectNotAuth, (req,res) => {
    res.render('about');
});

router.get('/request/form',redirectNotAuth, async (req,res) => {

    const dat = await users.findOne({ '_id': loggedIn });
    var user = new Object();
    if(dat.role == "student"){
        user = await student_info.findOne({ '_id': dat.student_info });
    }
    var image = 'profile-1.jpg';
    var name = dat.username;
    if(user){
        image = user.image
        name = user.name
    }else{
        req.session.firstlogin = true;
    }
    let page = req.query.page || 1;
    let perPage = 10;

    const data = await companies.aggregate([ { $sort: {name: 1 }}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();
    
    const count = await companies.countDocuments({});
    let allPage = Math.ceil(count/perPage);
    const nextPage = parseInt(page)+1;
    const hasNextPage = nextPage <= allPage;

    const posit = await position.aggregate([ { $sort: {name: 1 }}]).exec();
    console.log(posit);
    const locals = {
        title : "request-form",
        description:"Internship request",
        styles: "/css/request-form.css",
        js: "/js/base.js",
        user: dat.role,
        content:"../layouts/request-form.ejs",
        bar1: "active",
        profile:image,
        name:name,
        first:req.session.firstlogin
    }
    res.render('index', { locals,data,count,
        current: page,std_code:name,posit,
        all_pages:allPage,
        nextPage: hasNextPage ? nextPage : null});
});

router.get('/request-status',redirectNotAuth,async (req,res) => {
    const dat = await users.findOne({ '_id': loggedIn });
    var user = new Object();
    if(dat.role == "student"){
        user = await student_info.findOne({ '_id': dat.student_info });
    }
    var image = 'profile-1.jpg';
    var name = dat.username;
    if(user){
        image = user.image
        name = user.name
    }else{
        req.session.firstlogin = true;
    }
    const locals = {
        title : "request-status",
        description:"Internship request",
        styles: "/css/status.css",
        js: "/js/base.js",
        user: dat.role,
        status: true,
        content:"../layouts/request-status.ejs",
        bar2: "active",
        profile:image,
        name:name,
        first:req.session.firstlogin
    }
    
    try{
        const dat = (await users.find({'_id':loggedIn})).at(0);
        const data = (await student_info.find({'_id':dat.student_info})).at(0);
        const temp = (await request_ser.find({'student_info':data._id})).at(0);

        const status = await request_ser.aggregate([
            { $match: { _id: temp._id } },
            {
                $lookup: {
                    from: 'studentinfos',
                    localField: 'student_info',
                    foreignField: '_id',
                    as: 'student_info'
                }
            },
            {
                $lookup: {
                    from: 'requestinfos',
                    localField: 'request_info',
                    foreignField: '_id',
                    as: 'request_info'
                }
            },
            {
                $lookup: {
                    from: 'companyinfos',
                    localField: 'company_info',
                    foreignField: '_id',
                    as: 'company_info'
                }
            },
            {
                $lookup: {
                    from: 'certificateschemas',
                    localField: 'certificate_info',
                    foreignField: '_id',
                    as: 'certificate_info'
                }
            },
            {
                $addFields: {
                    student_info: { $arrayElemAt: ['$student_info', 0] },
                    request_info: { $arrayElemAt: ['$request_info', 0] },
                    company_info: { $arrayElemAt: ['$company_info', 0] },
                    certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                    foreignField: '_id',
                    as: 'company_info.company'
                }
            },
            {
                $addFields: {
                    'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
                }
            }
        ]).exec();
        // find by username : student_id
        const request_doc = (await request_info.find({'student_code':data.student_code})).at(0);
        const company = (await company_info.find({'student_code':data.student_code})).at(0);
        const company_details = (await companies.find({'_id':company.company})).at(0);
        console.log(company_details);
        res.render('index', {locals,data,company,request_doc,company_details,status:status.at(0)});
    }catch(error){
        console.log(error);
        const data = null;
        const company = null;
        const request_doc = null;
        const company_details = null;
        res.render('index', {locals,data,company,request_doc,company_details});
    }
});

router.get('/document',redirectNotAuth,async (req,res) => {
    const dat = await users.findOne({ '_id': loggedIn });
    var user = new Object();
    if(dat.role == "student"){
        user = await student_info.findOne({ '_id': dat.student_info });
    }
    var image = 'profile-1.jpg';
    var name = dat.username;
    if(user){
        image = user.image
        name = user.name
    }else{
        req.session.firstlogin = true;
    }
    const locals = {
        title : "document",
        description:"Internship request",
        styles: "/css/document.css",
        js: "/js/base.js",
        user: dat.role,
        content:"../layouts/document.ejs",
        bar3: "active",
        profile:image,
        name:name,
        first:req.session.firstlogin
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

router.get('/news',redirectNotAuth, async (req,res) => {
    const dat = await users.findOne({ '_id': loggedIn });
    var user = new Object();
    if(dat.role == "student"){
        user = await student_info.findOne({ '_id': dat.student_info });
    }
    var image = 'profile-1.jpg';
    var name = dat.username;
    if(user){
        image = user.image
        name = user.name
    }else{
        req.session.firstlogin = true;
    }
    const locals = {
        title : "news",
        description:"Internship request",
        styles: "/css/news.css",
        js: "/js/base.js",
        user: dat.role,
        content:"../layouts/news.ejs",
        bar4: "active",
        profile:image,
        name:name,
        first:req.session.firstlogin
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

router.get('/company',redirectNotAuth,async (req,res) => {
    const dat = await users.findOne({ '_id': loggedIn });
    var user = new Object();
    if(dat.role == "student"){
        user = await student_info.findOne({ '_id': dat.student_info });
    }
    var image = 'profile-1.jpg';
    var name = dat.username;
    if(user){
        image = user.image
        name = user.name
    }else{
        req.session.firstlogin = true;
    }
    const locals = {
        title : "company",
        description:"Internship request",
        styles: "/css/company.css",
        js: "/js/base.js",
        user: dat.role,
        content:"../layouts/company.ejs"   , 
        bar5: "active",
        profile:image,
        name:name,
        first:req.session.firstlogin
    }
    
    res.render('index', {locals});
});

router.get('/calendar',redirectNotAuth,async (req,res) => {
    const dat = await users.findOne({ '_id': loggedIn });
    var user = new Object();
    if(dat.role == "student"){
        user = await student_info.findOne({ '_id': dat.student_info });
    }
    var image = 'profile-1.jpg';
    var name = dat.username;
    if(user){
        image = user.image
        name = user.name
    }else{
        req.session.firstlogin = true;
    }
    
    const locals = {
        title : "calendar",
        description:"Internship request",
        styles: "/css/calendar.css",
        js: "/js/base.js",
        user: dat.role,
        content:"../layouts/calendar.ejs"   , 
        bar6: "active",
        profile:image,
        name:name,
        first:req.session.firstlogin
    }
    
    res.render('index', {locals});
});


router.get('/about',redirectNotAuth, (req,res) => {
    res.render('about');
});

//teacher
router.get('/request-teacher/req',async (req,res) => {
    req.session.req_id = req.query.req;
    console.log(req.session.req_id);

    res.redirect('/request-teacher');
});

router.get('/request-teacher',async (req,res) => {
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/request-teacher.css",
        js: "/js/all-request.js",
        user: "teacher",
        content:"../layouts/teacher/request-teacher.ejs",
        bar1: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }
    console.log(req.session.req_id);
    var error = req.session.error;
    var current_req = req.session.req_id;
    req.session.destroy();
    console.log(error);
    if(current_req != undefined && current_req != null){
        bg1 = "";
        mod1 = "";
    }else{
        bg1 = "close";
        mod1 = "close";
    }
    if(error){
        modal_bg2 = "";
        alert = "";
    }else{
        modal_bg2 = "close";
        alert = "close";
    }

    const perPage = 20;
    const page = req.query.page || 1;
    var com_add =[];
    const data = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '0' } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();
    
    for (const element of data) {
        const found = element.company_info.company.status == '1';
        if (found) {
            com_add.push('match');
        } else {
            com_add.push('not-match');
        }
    }

    res.render('index', { locals,requests:data,count_request:data.length,
        com_add,modal_bg1:bg1,modal1:mod1,modal_bg2,alert,error,current_req });

});

router.get('/request-teacher/company-add', async (req,res) => {
    req.session.req_id = req.query.req;
    try{
        const this_request = (await request_ser.find({'_id':req.session.req_id})).at(0);
        const com_info = (await company_info.find({'_id':this_request.company_info._id})).at(0);
        const this_com = (await companies.find({'_id':com_info.company})).at(0);
        this_com.status = process.env.STATUS_PASS;
        req.session.error = "Add NewCompany Successfuly !";
        await this_com.save();
    }catch(error){
        req.session.error = "Add NewCompany Fail !";
    }
    res.redirect('/request-teacher');
});

router.post('/request-teacher/update', async (req,res) => {
    
    var std_info = (await student_info.find({'student_code':req.body.student_code})).at(0);
    var com_info = (await company_info.find({'student_code':req.body.student_code})).at(0);
    var req_info = (await request_info.find({'student_code':req.body.student_code})).at(0);
    var this_request = new Object();
    console.log(com_info);
    this_request = (await request_ser.find({'student_info':std_info._id})).at(0);
    req.session.req_id = this_request._id;
    var status1 = req.body.status1;
    var status2 = req.body.status2;
    var status3 = req.body.status3;
    var status4 = req.body.status4;

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
    if(req.body.start_intern != com_info.start_intern){std_info.com_info=new Date(req.body.start_intern);}
    if(req.body.end_intern != com_info.end_intern){std_info.com_info.end_intern=new Date(req.body.end_intern);}
    if(req.body.comment1 != std_info.comment){std_info.comment=req.body.comment1;}
    if(req.body.comment2 != com_info.comment){com_info.comment=req.body.comment2;}
    if(req.body.comment3 != req_info.comment){req_info.comment=req.body.comment3;}
    
    if(req.body.status1 != std_info.status){
        std_info.status=status1;

        if(status1 == 0 || status1 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status1 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }

    }
    if(req.body.status2 != com_info.status){
        com_info.status=status2;

        if(status2 == 0 || status2 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status2 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }
    }

    if(req.body.status3 != req_info.status){
        req_info.status=status3;

        if(status3 == 0 || status3 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status3 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }
    }
    console.log(req.body.status4);
    console.log(this_request.approval_document_status);
    if(req.body.status4 != this_request.approval_document_status){
        this_request.approval_document_status=status4;

        if(status4 == '1' &&  this_request.approval_document_status=='1'){
            this_request.approval_document_status = process.env.STATUS_PASS;
        }else if(status4 == '1' &&  this_request.approval_document_status=='2'){
            this_request.approval_document_status = process.env.STATUS_FAIL;
        }else if(status4 == '0' || status4 == '1'){
            this_request.approval_document_status = process.env.STATUS_PENDING;
        }
    }

    const com = (await companies.find({'_id':com_info.company})).at(0);
    if(com.status != process.env.STATUS_PASS){
        req.session.error = "ไม่พบขอมูลสถานฝึกงานในระบบ !";
        res.redirect('/request-teacher');
    }

    try{
        await std_info.save();
        await com_info.save();
        await req_info.save();

        req.session.req_id = this_request._id;
        if(this_request){
            if(std_info.status == com_info.status && com_info.status == req_info.status && req_info.status == '1'){
                // if(Number(this_request.approval_document_status)<1){
                //     this_request.approval_document_status = process.env.STATUS_PENDING;
                // }
                this_request.status = '1';
            }else if(std_info.status == '2' || com_info.status == '2' ||req_info.status == '2'){
                this_request.status = '2';
                req.session.req_id = null;
            }else{
                this_request.status = process.env.STATUS_PENDING;
            }
            
            await this_request.save();

        }
        req.session.error = "Update Request Successfuly !";
    }catch(error){
        console.log(error);
        req.session.error = "Error To Update This Request";
    }


    res.redirect('/request-teacher');
});

router.post('/request-teacher/update2', async (req,res) => {
    
    var std_info = (await student_info.find({'student_code':req.body.student_code})).at(0);
    var com_info = (await company_info.find({'student_code':req.body.student_code})).at(0);
    var req_info = (await request_info.find({'student_code':req.body.student_code})).at(0);
    var this_request = new Object();
    this_request = (await request_ser.find({'student_info':std_info._id})).at(0);
    req.session.req_id = this_request._id;
    var status1 = req.body.status1;
    var status2 = req.body.status2;
    var status3 = req.body.status3;
    var status4 = req.body.status4;

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
    if(req.body.start_intern != com_info.start_intern){std_info.com_info=new Date(req.body.start_intern);}
    if(req.body.end_intern != com_info.end_intern){std_info.com_info.end_intern=new Date(req.body.end_intern);}
    if(req.body.comment1 != std_info.comment){std_info.comment=req.body.comment1;}
    if(req.body.comment2 != com_info.comment){com_info.comment=req.body.comment2;}
    if(req.body.comment3 != req_info.comment){req_info.comment=req.body.comment3;}
    if(req.body.comment4 != this_request.approval_document_comment){this_request.approval_document_comment=req.body.comment4;}
    
    if(req.body.status1 != std_info.status){
        std_info.status=status1;

        if(status1 == 0 || status1 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status1 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }

    }
    if(req.body.status2 != com_info.status){
        com_info.status=status2;

        if(status2 == 0 || status2 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status2 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }
    }

    if(req.body.status3 != req_info.status){
        req_info.status=status3;

        if(status3 == 0 || status3 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status3 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }
    }
    if(req.body.status4 != this_request.approval_document_status){
        this_request.approval_document_status=status4;

        if(status4 == '1' ||  this_request.approval_document_status=='1'){///**** */
            this_request.approval_document_status = process.env.STATUS_PASS;
        }else if(status4 == '2' ||  this_request.approval_document_status=='2'){
            this_request.approval_document_status = process.env.STATUS_FAIL;
        }else if(status4 == '0' || status4 == '1'){
            this_request.approval_document_status = process.env.STATUS_PENDING;
        }
    }

    const com = (await companies.find({'_id':com_info.company})).at(0);
    if(com.status != process.env.STATUS_PASS){
        req.session.error = "ไม่พบขอมูลสถานฝึกงานในระบบ !";
        res.redirect('/docs-waiting');
    }

    try{
        await std_info.save();
        await com_info.save();
        await req_info.save();

        req.session.req_id = this_request._id;
        if(this_request){
            if(std_info.status == com_info.status && com_info.status == req_info.status && req_info.status == '1'){
                // if(Number(this_request.approval_document_status)<1){
                //     this_request.approval_document_status = process.env.STATUS_PENDING;
                // }
                this_request.status = '1';
            }else if(std_info.status == '2' || com_info.status == '2' ||req_info.status == '2'){
                this_request.status = '2';
                req.session.req_id = null;
            }else{
                this_request.status = process.env.STATUS_PENDING;
            }
            
            await this_request.save();

        }
        req.session.error = "Update Request Successfuly !";
        
    }catch(error){
        console.log(error);
        req.session.error = "Error To Update This Request";
    }

    console.log(req.session.error);
    res.redirect('/docs-waiting');
});

router.post('/request-teacher/update3', async (req,res) => {
    
    var std_info = (await student_info.find({'student_code':req.body.student_code})).at(0);
    var com_info = (await company_info.find({'student_code':req.body.student_code})).at(0);
    var req_info = (await request_info.find({'student_code':req.body.student_code})).at(0);
    var this_request = new Object();
    this_request = (await request_ser.find({'student_info':std_info._id})).at(0);
    req.session.req_id = this_request._id;
    var status1 = req.body.status1;
    var status2 = req.body.status2;
    var status3 = req.body.status3;
    var status4 = req.body.status4;
    var status5 = req.body.status5;

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
    if(req.body.start_intern != com_info.start_intern){std_info.com_info=new Date(req.body.start_intern);}
    if(req.body.end_intern != com_info.end_intern){std_info.com_info.end_intern=new Date(req.body.end_intern);}
    if(req.body.comment1 != std_info.comment){std_info.comment=req.body.comment1;}
    if(req.body.comment2 != com_info.comment){com_info.comment=req.body.comment2;}
    if(req.body.comment3 != req_info.comment){req_info.comment=req.body.comment3;}
    if(req.body.comment4 != this_request.approval_document_comment){this_request.approval_document_comment=req.body.comment4;}
    if(req.body.comment4 != this_request.accepted_company_comment){this_request.accepted_company_comment=req.body.comment5;}
    
    if(req.body.status1 != std_info.status){
        std_info.status=status1;

        if(status1 == 0 || status1 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status1 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }

    }
    if(req.body.status2 != com_info.status){
        com_info.status=status2;

        if(status2 == 0 || status2 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status2 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }
    }

    if(req.body.status3 != req_info.status){
        req_info.status=status3;

        if(status3 == 0 || status3 == 1){
            this_request.status = process.env.STATUS_PENDING;
        }else if(status3 == 2 ){
            this_request.status = process.env.STATUS_FAIL;
        }
    }
    if(req.body.status4 != this_request.approval_document_status){
        this_request.approval_document_status=status4;

        if(status4 == '1' ||  this_request.approval_document_status=='1'){///**** */
            this_request.approval_document_status = process.env.STATUS_PASS;
        }else if(status4 == '2' ||  this_request.approval_document_status=='2'){
            this_request.approval_document_status = process.env.STATUS_FAIL;
        }else if(status4 == '0' || status4 == '1'){
            this_request.approval_document_status = process.env.STATUS_PENDING;
        }
    }

    if(req.body.status5 != this_request.accepted_company_status){
        this_request.accepted_company_status=status5;

        if(status5 == '1' ||  this_request.accepted_company_status=='1'){
            this_request.accepted_company_status = process.env.STATUS_PASS;
        }else if(status5 == '2' ||  this_request.accepted_company_status=='2'){
            this_request.accepted_company_status = process.env.STATUS_FAIL;
        }else if(status5 == '0' || status5 == '1'){
            this_request.accepted_company_status = process.env.STATUS_PENDING;
        }
    }

    const com = (await companies.find({'_id':com_info.company})).at(0);
    if(com.status != process.env.STATUS_PASS){
        req.session.error = "ไม่พบขอมูลสถานฝึกงานในระบบ !";
        res.redirect('/docs-approve');
    }

    try{
        await std_info.save();
        await com_info.save();
        await req_info.save();

        req.session.req_id = this_request._id;
        if(this_request){
            if(std_info.status == com_info.status && com_info.status == req_info.status && req_info.status == '1'){
                this_request.status = '1';
            }else if(std_info.status == '2' || com_info.status == '2' ||req_info.status == '2'){
                this_request.status = '2';
                req.session.req_id = null;
            }else{
                this_request.status = process.env.STATUS_PENDING;
            }
            
            await this_request.save();

        }
        req.session.error = "Update Request Successfuly !";
        
    }catch(error){
        console.log(error);
        req.session.error = "Error To Update This Request";
    }

    console.log(req.session.error);
    res.redirect('/docs-approve');
});

router.get('/requests-all-teacher', async (req,res) => {
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/request-teacher.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/requests-all-teacher.ejs",
        bar8: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }
        console.log(req.session.req_id);
        var error = req.session.error;
        var current_req = req.session.req_id;
        req.session.destroy();
        console.log(error);
        if(current_req != undefined && current_req != null){
            bg1 = "";
            mod1 = "";
        }else{
            bg1 = "close";
            mod1 = "close";
        }
        if(error){
            modal_bg2 = "";
            alert = "";
        }else{
            modal_bg2 = "close";
            alert = "close";
        }
    
        const perPage = 20;
        const page = req.query.page || 1;
        var com_add =[];
        const data = await request_ser.aggregate([
            { $sort: { update_at: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage },
            {
                $lookup: {
                    from: 'studentinfos',
                    localField: 'student_info',
                    foreignField: '_id',
                    as: 'student_info'
                }
            },
            {
                $lookup: {
                    from: 'requestinfos',
                    localField: 'request_info',
                    foreignField: '_id',
                    as: 'request_info'
                }
            },
            {
                $lookup: {
                    from: 'companyinfos',
                    localField: 'company_info',
                    foreignField: '_id',
                    as: 'company_info'
                }
            },
            {
                $lookup: {
                    from: 'certificateschemas',
                    localField: 'certificate_info',
                    foreignField: '_id',
                    as: 'certificate_info'
                }
            },
            {
                $addFields: {
                    student_info: { $arrayElemAt: ['$student_info', 0] },
                    request_info: { $arrayElemAt: ['$request_info', 0] },
                    company_info: { $arrayElemAt: ['$company_info', 0] },
                    certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                    foreignField: '_id',
                    as: 'company_info.company'
                }
            },
            {
                $addFields: {
                    'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
                }
            }
        ]).exec();
        
        for (const element of data) {
            const found = element.company_info.company.status == '1';
            if (found) {
                com_add.push('match');
            } else {
                com_add.push('not-match');
            }
        }
    
        data.sort((a, b) => a.update_at - b.update_at);
        var date = new Date();
        res.render('index', { locals,requests:data,count_request:data.length,
            com_add,modal_bg1:bg1,modal1:mod1,modal_bg2,alert,error,current_req });
    

});

router.get('/pass-status-requests', async (req,res) => {
    const locals = {
        title : "request",
        description:"Internship request",
        styles: "/css/request-teacher.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/pass-status-requests.ejs",
        bar9: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }
        var error = req.session.error;
        var current_req = req.session.req_id;
        req.session.destroy();
        console.log(error);
        if(current_req != undefined && current_req != null){
            bg1 = "";
            mod1 = "";
        }else{
            bg1 = "close";
            mod1 = "close";
        }
        if(error){
            modal_bg2 = "";
            alert = "";
        }else{
            modal_bg2 = "close";
            alert = "close";
        }
    
        const perPage = 20;
        const page = req.query.page || 1;
        var com_add =[];
        const data = await request_ser.aggregate([
            { $sort: { update_at: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage },
            {
                $lookup: {
                    from: 'studentinfos',
                    localField: 'student_info',
                    foreignField: '_id',
                    as: 'student_info'
                }
            },
            {
                $lookup: {
                    from: 'requestinfos',
                    localField: 'request_info',
                    foreignField: '_id',
                    as: 'request_info'
                }
            },
            {
                $lookup: {
                    from: 'companyinfos',
                    localField: 'company_info',
                    foreignField: '_id',
                    as: 'company_info'
                }
            },
            {
                $lookup: {
                    from: 'certificateschemas',
                    localField: 'certificate_info',
                    foreignField: '_id',
                    as: 'certificate_info'
                }
            },
            {
                $addFields: {
                    student_info: { $arrayElemAt: ['$student_info', 0] },
                    request_info: { $arrayElemAt: ['$request_info', 0] },
                    company_info: { $arrayElemAt: ['$company_info', 0] },
                    certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                    foreignField: '_id',
                    as: 'company_info.company'
                }
            },
            {
                $addFields: {
                    'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
                }
            }
        ]).exec();
        
        for (const element of data) {
            const found = element.company_info.company.status == '1';
            if (found) {
                com_add.push('match');
            } else {
                com_add.push('not-match');
            }
        }
    
        res.render('index', { locals,requests:data,count_request:data.length,
            com_add,modal_bg1:bg1,modal1:mod1,modal_bg2,alert,error,current_req });
});

router.get('/upload-docs',async (req,res) => {
    const locals = {
        title : "document",
        description:"Internship request",
        styles: "/css/document.css",
        js: "/js/doc.js",
        user: "teacher",
        username: "teacher01",
        content:"../layouts/teacher/upload-docs.ejs",
        bar4: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
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
        bar5: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
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

router.get('/all-companys',async (req,res) => {
    const locals = {
        title : "company",
        description:"Internship request",
        styles: "/css/company.css",
        js: "/js/company.js",
        user: "teacher",
        content:"../layouts/teacher/all-companys.ejs"   , 
        bar6: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }
    var err = "";
    var status = "";
    try{

        if(modal_bg1 = "" && modal2 == "" && modal_bg2 == "close" && modal2 == "close"){
            console.log("TEST");
        }
        console.log(req.query.page);
        if(req.query.page === undefined && req.session.page === undefined){
            modal_bg2 = "close";
            modal_bg1 = "close";
            modal2 = "close";
        }else if (modal_bg1 == ""){
            if(req.session.page !== undefined || req.query.page !== undefined){
                modal_bg1 = "";
                modal2 = "";
                req.session.page = undefined;
            }
        }else{
            modal_bg2 = "close";
            modal_bg1 = "close";
            modal2 = "close";
        }

        if(req.session.error !== undefined && req.session.error !== ""){
            if(req.session.error == "pass"){
                status = "pass";
                err = "This Position Add Success !";
                alert = "";
                req.session.error = "";
            }else{
                status = "fail";
                err = "This Position Has Used !";
                alert = "";
            }
        }
        
        if(req.session.del !== undefined && req.session.del !== ""){
            if(req.session.del == "success"){
                status = "pass";
                err = "This Position Delete Success !";
                alert = "";
                req.session.del = "";
            }else{
                status = "fail";
                err = "Deleted ERROR !";
                alert = "";
            }
        }

        let page = req.query.page || 1;
        let perPage = 10;

        // const results = await position.find({});
        // console.log(results.length);

        const data = await position.aggregate([ { $sort: {name: 1 }}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = await position.countDocuments({});
        let allPage = Math.ceil(count/perPage);
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= allPage;

        // reset Alert
        var a = alert;
        alert = "close";

        res.render('index', {locals,error:err,status,alert:a,modal_bg1,modal_bg2,modal1,modal2,modal3,data,current: page,all_pages:allPage,
        nextPage: hasNextPage ? nextPage : null});
    }catch(error){  
        console.log(error);
    }
});

router.post('/all-companys/add', async (req, res) => {
    var name = req.body.position_name;
    var job = new position({ name: name });
    var error = "";
    const locals = {
        title: "company",
        description: "Internship request",
        styles: "/css/company.css",
        js: "/js/company.js",
        user: "teacher",
        content: "../layouts/teacher/all-companys.ejs",
        bar6: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }

    var found = await position.find({ 'name': name });
    var page = "1";

    if (found.length === 0 && name.trim().length !== 0) {
        await job.save();
        error = "pass";

        // Store information in session variables
        req.session.page = page;
        req.session.error = error;

        res.redirect('/all-companys');
    } else {
        error = "fail";

        // Store information in session variables
        req.session.page = page;
        req.session.error = error;

        res.redirect('/all-companys');
    }
});

router.get('/all-companys/delete/:id', async (req,res) => {
    var page = "1";
    try{
        del = "success";
    }catch(error){  
        del = "fail";
    }
    req.session.page = page;
    req.session.del = del;
    const result = await position.findByIdAndDelete(req.params.id);
    res.redirect('/all-companys');
});

router.get('/upload-calendar', async (req,res) => {
    const locals = {
        title : "calendar",
        description:"Internship request",
        styles: "/css/calendar.css",
        js: "/js/base.js",
        user: "teacher",
        content:"../layouts/teacher/upload-calendar.ejs"   , 
        bar7: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }
    
    res.render('index', {locals});
});

router.get('/docs-waiting',async (req,res) => {
    const locals = {
        title : "docs-waiting",
        description:"Internship request",
        styles: "/css/docs-waiting.css",
        js: "/js/all-request.js",
        user: "teacher",
        content:"../layouts/teacher/docs-waiting.ejs",
        bar2: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }
    var sort = req.query.sort || 1;
    var error = req.session.error;
    var current_req = req.session.req_id;
    req.session.destroy();

    if(current_req != undefined && current_req != null){
        bg1 = "";
        mod1 = "";
    }else{
        bg1 = "close";
        mod1 = "close";
    }
    if(error){
        modal_bg2 = "";
        alert = "";

    }else{
        modal_bg2 = "close";
        alert = "close";
    }

    const perPage = 20;
    const page = req.query.page || 1;
    var com_add =[];
    const data = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: '0' } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();

    const data2 = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: '1' } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();
    const data3 = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: { $in: ['0', '1' ,'2'] } } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();
    const data4 = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: '2' } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();
    for (const element of data) {
        const found = element.company_info.company.status == '1';
        if (found) {
            com_add.push('match');
        } else {
            com_add.push('not-match');
        }
    }
    data.sort((a, b) => a.update_at - b.update_at);
    var date = new Date();
    if(data.at(0)){
        date = data.at(0).update_at;
    }
    data2.sort((a, b) => a.update_at - b.update_at);
    if(data2.at(0)){
        date = data2.at(0).update_at;
    }
    data3.sort((a, b) => a.update_at - b.update_at);
    if(data3.at(0)){
        date = data3.at(0).update_at;
    }
    data4.sort((a, b) => a.update_at - b.update_at);
    if(data4.at(0)){
        date = data4.at(0).update_at;
    }
    var ttt = []
    if(sort == '1'){
        ttt = data;
    }else if(sort == '2'){
        ttt = data2;
    }else if(sort == '3'){
        ttt = data3;
    }else if(sort == '4'){
        ttt = data4;
    }
    
    res.render('index', { locals,requests:ttt,count_request:data.length,sort,
        com_add,modal_bg1:bg1,modal1:mod1,modal_bg2,alert,error,current_req,date });

});

router.get('/docs-approve', async (req,res) => {
    const locals = {
        title : "approval document",
        description:"Internship request",
        styles: "/css/docs-waiting.css",
        js: "/js/all-request.js",
        user: "teacher",
        content:"../layouts/teacher/docs-approve.ejs", 
        bar3: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }
    var sort = req.query.sort || 1;
    var error = req.session.error;
    var current_req = req.session.req_id;
    req.session.destroy();

    if(current_req != undefined && current_req != null){
        bg1 = "";
        mod1 = "";
    }else{
        bg1 = "close";
        mod1 = "close";
    }
    if(error){
        modal_bg2 = "";
        alert = "";

    }else{
        modal_bg2 = "close";
        alert = "close";
    }

    const perPage = 20;
    const page = req.query.page || 1;
    var com_add =[];
    const data = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: '1' } },
        { $match: { accepted_company_status: '0' } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();

    const data2 = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: '1' } },
        { $match: { accepted_company_status: '1' } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();
    const data3 = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: '1' } },
        { $match: { accepted_company_status: { $in: ['0', '1' ,'2'] } } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();
    const data4 = await request_ser.aggregate([
        { $sort: { update_at: -1 } },
        { $match: { status: '1' } },
        { $match: { approval_document_status: '1' } },
        { $match: { accepted_company_status: '2' } },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
        {
            $lookup: {
                from: 'studentinfos',
                localField: 'student_info',
                foreignField: '_id',
                as: 'student_info'
            }
        },
        {
            $lookup: {
                from: 'requestinfos',
                localField: 'request_info',
                foreignField: '_id',
                as: 'request_info'
            }
        },
        {
            $lookup: {
                from: 'companyinfos',
                localField: 'company_info',
                foreignField: '_id',
                as: 'company_info'
            }
        },
        {
            $lookup: {
                from: 'certificateschemas',
                localField: 'certificate_info',
                foreignField: '_id',
                as: 'certificate_info'
            }
        },
        {
            $addFields: {
                student_info: { $arrayElemAt: ['$student_info', 0] },
                request_info: { $arrayElemAt: ['$request_info', 0] },
                company_info: { $arrayElemAt: ['$company_info', 0] },
                certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                foreignField: '_id',
                as: 'company_info.company'
            }
        },
        {
            $addFields: {
                'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
            }
        }
    ]).exec();
    for (const element of data) {
        const found = element.company_info.company.status == '1';
        if (found) {
            com_add.push('match');
        } else {
            com_add.push('not-match');
        }
    }
    data.sort((a, b) => a.update_at - b.update_at);
    var date = new Date();
    if(data.at(0)){
        date = data.at(0).update_at;
    }
    data2.sort((a, b) => a.update_at - b.update_at);
    if(data2.at(0)){
        date = data2.at(0).update_at;
    }
    data3.sort((a, b) => a.update_at - b.update_at);
    if(data3.at(0)){
        date = data3.at(0).update_at;
    }
    data4.sort((a, b) => a.update_at - b.update_at);
    if(data4.at(0)){
        date = data4.at(0).update_at;
    }
    var ttt = []
    if(sort == '1'){
        ttt = data;
    }else if(sort == '2'){
        ttt = data2;
    }else if(sort == '3'){
        ttt = data3;
    }else if(sort == '4'){
        ttt = data4;
    }
    
    res.render('index', { locals,requests:ttt,count_request:data.length,sort,
        com_add,modal_bg1:bg1,modal1:mod1,modal_bg2,alert,error,current_req,date });

});


router.post('/docs-approval-pop', async (req, res) => {
    req.session.approval = JSON.parse(JSON.stringify(req.body));
    const approval = req.session.approval;

    for (const key in req.session.approval) {
        const reqItem = await request_ser.findOne({ '_id': key });
        const onValue = approval[key];

        if(onValue == 'on'){
            reqItem.approval_document_status = '1';
            await reqItem.save();
        }
    }

    try {
        const zip = new PizZip();
        const documentsData = [];
        const company_list = [];
        const ser_list = [];

        if (approval) {
            for (const key in approval) {
                const temp = [];
                const ser = await request_ser.findOne({ '_id': key });
                const cms = await company_info.findOne({ '_id': ser.company_info._id });
                const cm = await companies.findOne({ '_id': cms.company._id });

                const aggregationPipeline = [
                    { $match: { _id: new ObjectId(key) } },
                    {
                        $lookup: {
                            from: 'studentinfos',
                            localField: 'student_info',
                            foreignField: '_id',
                            as: 'student_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'requestinfos',
                            localField: 'request_info',
                            foreignField: '_id',
                            as: 'request_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'companyinfos',
                            localField: 'company_info',
                            foreignField: '_id',
                            as: 'company_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'certificateschemas',
                            localField: 'certificate_info',
                            foreignField: '_id',
                            as: 'certificate_info'
                        }
                    },
                    {
                        $addFields: {
                            student_info: { $arrayElemAt: ['$student_info', 0] },
                            request_info: { $arrayElemAt: ['$request_info', 0] },
                            company_info: { $arrayElemAt: ['$company_info', 0] },
                            certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
                        }
                    },
                    {
                        $lookup: {
                            from: 'companies',
                            localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                            foreignField: '_id',
                            as: 'company_info.company'
                        }
                    },
                    {
                        $addFields: {
                            'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
                        }
                    }
                ];

                const data = await request_ser.aggregate(aggregationPipeline).exec();

                if (!company_list.includes(cm.name)) {
                    company_list.push(cm.name);
                    temp.push(data);
                    ser_list.push(temp);
                } else {
                    ser_list[company_list.indexOf(cm.name)].push(data);
                }
            }
        }
        
        for (let i = 0; i < company_list.length; i++) {
            const data2 = {};

            // Populate 'data2' based on your requirements...
            
            const student = [];
            data2['date'] = new Date().toLocaleDateString();
            data2['dear'] = ser_list[i][0][0].company_info.receiver_name;
            data2['countStd'] = ser_list[i].length;

            for (let j = 0; j < ser_list[i].length; j++) {
                const element = ser_list[i][j][0];
                const studentObj = {};

                studentObj['num'] = (j + 1).toString();
                studentObj['fname'] = element.student_info.name.split(' ')[0];
                studentObj['lname'] = element.student_info.name.split(' ')[1];
                studentObj['position'] = element.company_info.position;
                studentObj['code'] = element.company_info.student_code;
                student.push(studentObj);
            }

            data2['student'] = student;
            documentsData.push(data2);

            const templatePath = 'public/uploads/official/officcial_doc.docx';

            if (!fs.existsSync(templatePath)) {
                console.error('Template file not found.');
                res.status(404).send(`Template file not found for document ${i + 1}.`);
                return;
            }

            const templateContent = fs.readFileSync(templatePath, 'binary');
            const doc = new Docxtemplater(new PizZip(templateContent));
            doc.setData(data2);
            doc.render();
            const content = doc.getZip().generate({ type: 'nodebuffer' });
            zip.file(`document_${i + 1}.docx`, content);
        }

        // ...
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=documents.zip');
        res.send(zip.generate({ type: 'nodebuffer' }));
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
    
});

router.post('/docs-approval-pop2', async (req, res) => {
    req.session.approval = JSON.parse(JSON.stringify(req.body));
    const approval = req.session.approval;

    for (const key in req.session.approval) {
        const reqItem = await request_ser.findOne({ '_id': key });
        const onValue = approval[key];

        if(onValue == 'on'){
            reqItem.approval_document_status = '1';
            await reqItem.save();
        }
    }

    try {
        const zip = new PizZip();
        const documentsData = [];
        const company_list = [];
        const ser_list = [];

        if (approval) {
            for (const key in approval) {
                const temp = [];
                const ser = await request_ser.findOne({ '_id': key });
                const cms = await company_info.findOne({ '_id': ser.company_info._id });
                const cm = await companies.findOne({ '_id': cms.company._id });

                const aggregationPipeline = [
                    { $match: { _id: new ObjectId(key) } },
                    {
                        $lookup: {
                            from: 'studentinfos',
                            localField: 'student_info',
                            foreignField: '_id',
                            as: 'student_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'requestinfos',
                            localField: 'request_info',
                            foreignField: '_id',
                            as: 'request_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'companyinfos',
                            localField: 'company_info',
                            foreignField: '_id',
                            as: 'company_info'
                        }
                    },
                    {
                        $lookup: {
                            from: 'certificateschemas',
                            localField: 'certificate_info',
                            foreignField: '_id',
                            as: 'certificate_info'
                        }
                    },
                    {
                        $addFields: {
                            student_info: { $arrayElemAt: ['$student_info', 0] },
                            request_info: { $arrayElemAt: ['$request_info', 0] },
                            company_info: { $arrayElemAt: ['$company_info', 0] },
                            certificate_info: { $arrayElemAt: ['$certificate_info', 0] },
                        }
                    },
                    {
                        $lookup: {
                            from: 'companies',
                            localField: 'company_info.company', // Assuming 'company' is the field in 'CompanyInfo' model
                            foreignField: '_id',
                            as: 'company_info.company'
                        }
                    },
                    {
                        $addFields: {
                            'company_info.company': { $arrayElemAt: ['$company_info.company', 0] },
                        }
                    }
                ];

                const data = await request_ser.aggregate(aggregationPipeline).exec();

                if (!company_list.includes(cm.name)) {
                    company_list.push(cm.name);
                    temp.push(data);
                    ser_list.push(temp);
                } else {
                    ser_list[company_list.indexOf(cm.name)].push(data);
                }
            }
        }
        const d = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        for (let i = 0; i < company_list.length; i++) {
            const data2 = {};

            // Populate 'data2' based on your requirements...
            
            const student = [];
            data2['date'] = new Date().toLocaleString('th-TH', options);
            data2['dear'] = ser_list[i][0][0].company_info.receiver_name;
            data2['countStd'] = ser_list[i].length;
            data2['d1'] = ser_list[i][0][0].company_info.start_intern.getDate();
            data2['m1'] = ser_list[i][0][0].company_info.start_intern.toLocaleString('th-TH', { month: 'long' });
            data2['d2'] = ser_list[i][0][0].company_info.end_intern.getDate();
            data2['m2'] = ser_list[i][0][0].company_info.end_intern.toLocaleString('th-TH', { month: 'long' });
            if(ser_list[i][0][0].company_info.start_intern.toLocaleDateString('th-TH', { year: 'numeric' }) == ser_list[i][0][0].company_info.end_intern.toLocaleDateString('th-TH', { year: 'numeric' })){
                data2['y1'] = '';
                data2['y2'] = ser_list[i][0][0].company_info.start_intern.toLocaleDateString('th-TH', { year: 'numeric' });
            }else{
                data2['y1'] = ser_list[i][0][0].company_info.start_intern.toLocaleDateString('th-TH', { year: 'numeric' })+' ';
                data2['y2'] = ser_list[i][0][0].company_info.end_intern.toLocaleDateString('th-TH', { year: 'numeric' });
            }
            for (let j = 0; j < ser_list[i].length; j++) {
                const element = ser_list[i][j][0];
                const studentObj = {};

                studentObj['num'] = (j + 1).toString();
                studentObj['fname'] = element.student_info.name.split(' ')[0];
                studentObj['lname'] = element.student_info.name.split(' ')[1];
                studentObj['position'] = element.company_info.position;
                studentObj['code'] = element.company_info.student_code;
                student.push(studentObj);
            }

            data2['student'] = student;
            documentsData.push(data2);

            const templatePath = 'public/uploads/official/officcial_doc2.docx';

            if (!fs.existsSync(templatePath)) {
                console.error('Template file not found.');
                res.status(404).send(`Template file not found for document ${i + 1}.`);
                return;
            }

            const templateContent = fs.readFileSync(templatePath, 'binary');
            const doc = new Docxtemplater(new PizZip(templateContent));
            doc.setData(data2);
            doc.render();
            const content = doc.getZip().generate({ type: 'nodebuffer' });
            zip.file(`document_${i + 1}.docx`, content);
        }

        // ...
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=documents.zip');
        res.send(zip.generate({ type: 'nodebuffer' }));
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
    
});

router.post('/docs-approval-pop3', async (req, res) => {
    req.session.approval = JSON.parse(JSON.stringify(req.body));
    const approval = req.session.approval;

    for (const key in req.session.approval) {
        const reqItem = await request_ser.findOne({ '_id': key });
        const onValue = approval[key];

        if(onValue == 'on'){
            reqItem.approval_document_status = '1';
            await reqItem.save();
        }
    }

    if (approval) {
        for (const key in approval) {
            const ser = await request_ser.findOne({ '_id': key });
            ser.accepted_company_status = '1';
            await ser.save();
        }
    }
    res.redirect('/docs-approve');
    
});


router.get('/generate-official-document', (req, res) => {
    const templatePath = 'public/uploads/official/officcial_doc.docx';
  
    // Check if the file exists
    if (!fs.existsSync(templatePath)) {
      console.error('Template file not found.');
      res.status(404).send('Template file not found.');
      return;
    }
  
    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip);
  
    const data = {
      date: new Date().toLocaleDateString(),
      dear: 'Mr. Name Lastname',
      countStd: '5',
      num: '1',
      fname: 'Jirakorn',
      lname: 'Donhuabo',
      code: '633020568-3',
    };
  
    doc.setData(data);
  
    try {
      doc.render();
    } catch (error) {
      console.error('Error rendering template:', error);
      res.status(500).send('Error rendering template');
      return;
    }
  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=official_letter.docx');
  
    const outputContent = doc.getZip().generate({ type: 'nodebuffer' });
    res.download(outputContent);
  });

router.get('/uploads/:file', async (req,res) => {
    const file = req.params.file;
    const locals = {
        title : "calendar",
        description:"Internship request",
        styles: "/css/pdf.css",
        js: "/js/base.js",
        user: "teacher",
        filename: file,
        content:"../layouts/file-pdf.ejs"   , 
        bar7: "active",
        c:(await request_ser.find({'status':'0'})).length,
        c2:(await request_ser.find({'approval_document_status':'0'})).length,
        c3:(await request_ser.find({'accepted_company_status':'0'})).length
    }

    res.render('index', {locals});
});


module.exports = router;