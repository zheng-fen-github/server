const express = require('express');
const router = express.Router();
const mongodb = require('../../data/mongoose.js')
const mongodb2 = require('../../data/mongoose-post.js')
const path = require('path');


const fileUpload = require('express-fileupload');  // 上传文件设置
router.use(fileUpload())

 router.post('/post' , async (req,res)=>{

      console.log('upload files');
   

      if(req.files === null) {
        return res.status(404).json('no file')
      } 
      const file = req.files.photoFile;
      let FileMessage;
      if(Array.isArray(file)){   // 多个图片处理

          FileMessage = file.map( photo => {
               let fileName =Date.now() + photo.name;
               photo.mv(`${__dirname}/insFiles/${fileName}`,(err) => {
                   if(err) {
                       console.log(err);
                       return res.status(500).send(err);
                   }                   
               })
               return fileName
          })
          
      }else{
          let fileName =Date.now() + file.name;
          console.log(fileName);
          file.mv(`${__dirname}/insFiles/${fileName}`,(err) => {
            if(err) {
                console.log(err);
                return res.status(500).send(err);
            }                   
        })
        FileMessage = [fileName];
      }
    console.log(req.body);
    let {account,userName,acthorPhotoId,message,PostTitle} = req.body;    
    if(!acthorPhotoId || !message || !PostTitle || !account   || !userName) {
        res.status(404).json('缺少重要信息');
    }
    let postId = Date.now() + account;
    
    
    let user = await mongodb.findOne({account});
    let data = user.message;
    data.all.push({
        postId,
        time:Date.now(),
        key:account +Date.now(),
    }) 
    let undate2 = await mongodb.findOneAndUpdate({account},
        {message:data},
        {new:true});


    let imageAr = FileMessage.map(data => ({
        filename:data,
        time:Date.now(),  
    }));
    new mongodb2({
        postId,
        userName:userName,
        message:imageAr,
        description:message,
        title:PostTitle,
        acthorPhotoId:acthorPhotoId,
    }).save().then(res => console.log(res));
    

    res.status(200).json('帖子已发布');
     
    console.log('done')


});


router.get('/:id',(req,res) => {  //帖子图片获取路径
    console.log('获取帖子图片')
    console.log(req.params.id );
    console.log(path.join(__dirname,'/files'));
    res.sendFile(path.join(__dirname,'/insFiles',req.params.id));

})


module.exports  = router;