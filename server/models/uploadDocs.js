const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var uploadDocsSchema = new Schema({
	title:{
        type: String,
        required: true
    },
    docs : [Object]

},{timestamps:true});

module.exports = new mongoose.model('uploadDocs', uploadDocsSchema);