const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RequestServiceSchema = new Schema({
    student_info:{
        type: Schema.Types.ObjectId, 
        ref: 'StudentInfo'
    },
    request_info:{
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
});

module.exports = mongoose.model('RequestService',RequestServiceSchema);
