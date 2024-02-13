const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RequestServiceSchema = new Schema({
    student_info:{
        type: Schema.Types.ObjectId, 
        ref: 'StudentInfo'
    },
    request_info:{
        type: Schema.Types.ObjectId, 
        ref: 'RequestInfo'
    },
    company_info:{
        type: Schema.Types.ObjectId, 
        ref: 'CompanyInfo'
    },
    certificate_info:{
        type: Schema.Types.ObjectId, 
        ref: 'CertificateSchema'
    },
    approval_document_status:{//
        type: String,
        default:"0"
    },
    approval_document_comment:{//
        type: String,
        default:""
    },
    accepted_company_status:{//
        type: String,
        default:"0"
    },
    accepted_company_comment:{//
        type: String,
        default:""
    },
    status:{//
        type: String,
        default:"0"
    },
    update_at:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RequestService',RequestServiceSchema);
