const mongoose = require('mongoose');

const url = 'mongodb+srv://zhengfen:haoyunlai123@cluster0-4biyb.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});

const model = mongoose.model('user',{
    account:String,
    password:String,
    email:String,    
    time:{
        type:Date,
        default:Date.now
    },
    message:{
        name: { type: String },
        id:{ type:Number },
        photoId: { type: String },
        like:[],
        save:[],
        all:[],
        Introduction:{ type: String },
    },
    chat:[
    ],
},'user');




module.exports = model;