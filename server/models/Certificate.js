const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CertificateSchema = new Schema({
    doc_certificate:{
        type:String,
    },
    doc_dailywork:{
        type:String,
    },
    doc_evuluate_work:{
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

module.exports = mongoose.model('Certificate',CertificateSchema);
