const mongoose = require('mongoose');
const connectDB = async () => {

    try{
        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
        });
        console.log(`DATABASE CONNECTED: ${conn.connection.host}`);
    }catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;