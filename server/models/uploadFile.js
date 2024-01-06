const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var uploadFileSchema = new Schema({
	fileName:{
        type: String,
        required: true
    },
    filePath:{
        type: String,
        required: true
    },
    fileType:{
        type: String,
        required: true
    },
    fileSize:{
        type: String,
        required: true
    },
    category:{
        type: String
    },
    std_id:{
        type: String,
        required: true
    }

},{timestamps:true});

module.exports = new mongoose.model('uploadFile', uploadFileSchema);