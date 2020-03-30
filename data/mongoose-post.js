const mongoose = require('mongoose');

const url = 'mongodb+srv://zhengfen:haoyunlai123@cluster0-4biyb.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});

const model = mongoose.model('ins',{    
    postID:String,
    postTime:{
        type:Date,
        default:Date.now
    },
    message:[],  
    userName:String,
    title:String,
    description:String,
    comment:[],
    acthorPhotoId:String,
    userSave:Array,
    userLike:Array,
    account:String,
},'ins');


module.exports = model;