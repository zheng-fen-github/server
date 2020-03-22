const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongodb2 = require('../../data/mongoose-post.js');
const mongodb = require('../../data/mongoose.js');
const multer = require('multer');
const cors = require('cors');
const cookieparser = require('cookie-parser');
let cif = {
    origin:'http://localhost:3000',
    credentials: true,
}


router.use(cors(cif));
router.use(cookieparser());

const parse = multer();


router.post('/save/:id',parse.none(),async(req,res) => {
    console.log('收藏帖子')
       console.log(req.cookies)
       console.log(req.params.id)
        if(!req.cookies.account) {
            res.status(404).json('未获取账号信息')
        }

       let data = await mongodb2.findOne({_id:req.params.id});
       let {userSave} = data;
       let result = userSave.find(item=> item.user == req.cookies.account)
       
       if(!result) {    
            userSave.push({
                user:req.cookies.account,
                time:Date.now(),
            })
            let a = await mongodb2.findOneAndUpdate({_id:req.params.id},
                {userSave},
                {new:true});
           
       }
       
       
      

       let user = await mongodb.findOne({account:req.cookies.account});
       let {message} = user;
       let result2 = message.save.find(item=> item.postId == req.params.id)
       if(!result2) {
            message.save.push({
                postId:req.params.id,
                time:Date.now(),
            })
            let u = await mongodb.findOneAndUpdate({account:req.cookies.account},
            {message},
            {new:true});
            console.log(u)
       }
 
       res.json('cool');
})
router.post('/save/remove/:id',parse.none(),async(req,res) => {
    console.log('取消收藏帖子')
    try {
       console.log(req.cookies)
       console.log(req.params.id)
        if(!req.cookies.account) {
            res.status(404).json('未获取账号信息')
        }

       let data = await mongodb2.findOne({_id:req.params.id});
       let {userSave} = data;
       let newMessage = userSave.filter(item=> item.user != req.cookies.account);
       console.log(newMessage);
       
       await mongodb2.findOneAndUpdate({_id:req.params.id},
            {userSave:newMessage},
            {new:true});
           
                          
       let user = await mongodb.findOne({account:req.cookies.account});
       let {message} = user;
       let newMessage2 = message.save.find(item=> item.postId != req.params.id);
       message.save = !newMessage2?[]:newMessage;              
       console.log(message.save)
            let u = await mongodb.findOneAndUpdate({account:req.cookies.account},
            {message},
            {new:true});
            res.json(u);
    }catch(err) {
        console.log(err);
         res.status(303).json('服务器出错2');
    }
})





router.post('/like/:id',parse.none(),async(req,res) => {
    console.log('点赞帖子')
    try {
       console.log(req.cookies);
       console.log(req.params.id);
        if(!req.cookies.account) {
            res.status(404).json('未获取账号信息');
        }
       
       let data = await mongodb2.findOne({_id:req.params.id});
       let {userLike} = data;
       let result = userLike.find(item=> item.user == req.cookies.account)
       
       if(!result) {    
            userLike.push({
                user:req.cookies.account,
                time:Date.now(),
            })
            let a = await mongodb2.findOneAndUpdate({_id:req.params.id},
                {userLike},
                {new:true});
           
       }                   
       let user = await mongodb.findOne({account:req.cookies.account});
       let {message} = user;
       let result2 = message.like.find(item=> item.postId == req.params.id)
       if(!result2) {
            message.like.push({
                postId:req.params.id,
                time:Date.now(),
            })
            let u = await mongodb.findOneAndUpdate({account:req.cookies.account},
            {message},
            {new:true});
            res.json(u);
       }       
    }catch(err) {
        console.log(err);
         res.status(500).json('服务器未知出错');
    }
})

router.post('/like/remove/:id',parse.none(),async(req,res) => {
    console.log('取消点赞帖子')
    try {
       console.log(req.cookies)
       console.log(req.params.id)
        if(!req.cookies.account) {
            res.status(404).json('未获取账号信息')
        }

       let data = await mongodb2.findOne({_id:req.params.id});
       let {userLike} = data;
       let newMessage = userLike.filter(item=> item.user != req.cookies.account);
       console.log(newMessage);
       
        let a = await mongodb2.findOneAndUpdate({_id:req.params.id},
            {userLike:newMessage},
            {new:true});
           
                          
       let user = await mongodb.findOne({account:req.cookies.account});
       let {message} = user;
       let newMessage2 = message.like.find(item=> item.postId != req.params.id);
       message.like = !newMessage2?[]:newMessage;              
       console.log(message.like)
            let u = await mongodb.findOneAndUpdate({account:req.cookies.account},
            {message},
            {new:true});
            res.json(u);
    }catch(err) {
        console.log(err);
         res.status(303).json('服务器出错2');
    }
})





router.post('/comment/:id',parse.none(),async(req,res) => {
    console.log(req.cookies)
    console.log(req.params.id)
    console.log(req.body)
    // if(!req.cookies.account) {
    //         res.status(404).json('未获取账号信息')
    // }
    let postData = await mongodb2.findOne({_id:req.params.id});
    let {comment} = postData;
    comment.push({
        user:req.cookies.account,
        comment:req.body.comment,
        time:Date.now(),
    })
    let undate = await mongodb2.findOneAndUpdate({_id:req.params.id},
        {comment},
        {new:true});
     
    
        res.status(200).json(undate.comment)

})

router.get('/',async (req,res) => {
    console.log('获取帖子数据');
    let data = await mongodb2.where('userName');
    setTimeout(() => {
        res.json(data);
    })
})





module.exports  = router;