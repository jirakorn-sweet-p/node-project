const path = require('path')
const multer = require('multer')

var storate = multer.diskStorage({
    destination: function(req, file, cd){
        cb(null, 'upload/')
    },
    filename: function(req, file, cd){
        let ext = path.extname(file.originalname)
        cd(null, Date.now()+ ext)
    }
});

var upload = multer({
    storate: storate,
    fileFilter: function(req, file, callback){
        if(
            // file.mimetype == "application/pdf"
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg"
        ){
            callback(null,true)
        }else{
            console.log('only jpg & png file supported!')
            callback(null,false)
        }
    },
    limits:{
        fileSize: 1024 * 1024 * 2
    }
})