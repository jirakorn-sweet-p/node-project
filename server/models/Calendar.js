const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CalendartSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    details:{
        type:String,
        require:true
    },
    downloadDoc:{
        type:String,
    },
    createdBy:{
        type:String,
        require:true
    },
    updatedBy:{
        type:String,
        require:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Calendar',CalendartSchema);