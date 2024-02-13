const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PositionSchema = new Schema({
    name:{
        type:String,//
        require:true
    },
    update_status_at:{//
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Position',PositionSchema);
