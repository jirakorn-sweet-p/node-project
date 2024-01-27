const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CompanyInfoSchema = new Schema({
    company_name:{
        type:String,//
        require:true
    },
    tel:{
        type:String,//
        require:true
    },
    address:{
        type: String, //
        ref: 'Address',
    },
    type_business:{//
        type: String,
        require:true
    },
    student_code:{//
        type: String,
        require:true
    },
    position:{//
        type: String,
        require:true
    },
    province:{//
        type: String,
        require:true
    },
    district:{//
        type: String,
        require:true
    },
    subdistrict:{//
        type: String,
        require:true
    },
    provinceID:{//
        type: String,
        require:true
    },
    receiver_name:{//
        type: String,
        require:true
    },
    mentor:{//
        type: String
    },
    tel_mentor:{//
        type: String
    },
    start_intern:{//
        type: Date,
        require:true
    },
    end_intern:{//
        type: Date,
        require:true
    },
    submission_date:{
        type: Date,
        require:true
    },
    status:{//
        type: String,
        default:"0"
    },
    comment:{
        type: String,
        default:"no comment"
    },
    editor:{//
        type: String,
        default:"none"
    },
    update_status_at:{//
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('CompanyInfo',CompanyInfoSchema);
