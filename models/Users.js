/* const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
// creating a new Schema
// DB connection initialization
// const awaitConnect = await mongoose.connect(process.env.URI,{
//     keepAlive: 1,
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
// })
const connect = mongoose.createConnection(process.env.URI);
autoIncrement.initialize(connect);

const UserSchema = new Schema({
    _id:{
        type: Number,
        required: true
    },
    FirstN:{
        type: String,
        required:true
    },
    LastN:{
        type: String,
        required:true
    } ,
    Email:{
        type: String,
        required:true
    },
    Psw:{
        type:String,
        required:true
    },
    Date:  {
        type: Date,
        default: Date.now
    },
    
    ProfilePic:{
        type:String,
        required:false
    }
});

UserSchema.plugin(autoIncrement.plugin, 'Users')
// exporting the module
module.exports = connect.model('Users',UserSchema); */