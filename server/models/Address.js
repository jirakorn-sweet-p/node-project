const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AddressSchema = new Schema({
    location:{
        type:String,
        require:true
    },
    sub_district:{
        type:String,
        require:true
    },
    district:{
        type: String,
        require:true
    },
    province:{
        type: String,
        require:true
    },
    code:{
        type: String,
        default:"none"
    }
});

module.exports = mongoose.model('Address',AddressSchema);
