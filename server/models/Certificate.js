const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CertificateSchema = new Schema({
    doc_certificate:{
        type:String,
        require:true
    },
    doc_dailywork:{
        type:String,
        require:true
    },
    doc_evuluate_work:{
        type: String,
        require:true
    },
    status:{
        type: String,
        default:"Pending"
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
