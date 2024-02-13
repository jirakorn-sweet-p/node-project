const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CompanyInfoSchema = new Schema({
    company:{
        type: Schema.Types.ObjectId, 
        ref: 'Company'
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
