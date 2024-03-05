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
    },
    factory:{
        type: String,
    },
    grade:{
        type: Number,
    },
    email:{
        type: String,
    },
    phone:{
        type: String,
    },
    health_coverage:{
        type: String,
    },
    image:{
        type: String
    },
    comment:{
        type: String,
    },
    status:{
        type: String,
        default:"1"
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
