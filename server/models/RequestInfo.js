const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RequestInfoSchema = new Schema({
    student_code:{
        type:String,
        require:true
    },
    doc_request_intern:{
        type:String,
        require:true
    },
    doc_resume:{
        type:String,
        require:true
    },
    intern_format:{
        type: String,
        require:true
    },
    doc_approve_parrent:{
        type: String,
        require:true
    },
    doc_transcript:{
        type: String,
        require:true
    },
    doc_approve_company:{
        type: String,
        require:true
    },
    working_style:{
        type: String,
        require:true
    },
    comment:{
        type: String,
    },
    status:{
        type: String,
        default:"0"
    },
    editor:{
        type: String,
        default:"none"
    },
    update_status_at:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('RequestInfo',RequestInfoSchema);
