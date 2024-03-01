const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const StudentInfoSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    student_code:{
        type:String,
        require:true
    },
    education:{
        type: Number,
        require:true
    },
    factory:{
        type: String,
        require:true
    },
    grade:{
        type: Number,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    phone:{
        type: String,
        require:true
    },
    health_coverage:{
        type: String,
        require:true
    },
    image:{
        type: String
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

module.exports = mongoose.model('StudentInfo',StudentInfoSchema);
