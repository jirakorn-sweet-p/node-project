const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CompanySchema = new Schema({
    name:{
        type:String,//
        require:true
    },
    tel:{
        type:String,//
        require:true
    },
    type_business:{//
        type: String,
        require:true
    },
    address:{
        type: String, 
        ref: 'Address',
    },
    province:{
        type: String,
        require:true
    },
    district:{
        type: String,
        require:true
    },
    subdistrict:{
        type: String,
        require:true
    },
    provinceID:{
        type: String,
        require:true
    },

    status:{//
        type: String,
        default:"0"
    },
    comment:{
        type: String,
    },
    update_status_at:{//
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Company',CompanySchema);
