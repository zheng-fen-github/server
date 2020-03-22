const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const mongodb = require('../../data/mongoose');
const cors = require('cors');
const cookieparser = require('cookie-parser');
let cif = {
    origin:'http://localhost:3000',
    credentials: true,
}

const fileUpload = require('express-fileupload');  // 上传文件设置
router.use(fileUpload())

router.use(cookieparser());
router.use(cors(cif));



// 用户上传头像和名字
router.post('/avatar',async (req,res)=>{
      console.log('upload file');
      console.log(req.files);
      console.log(req.cookies);
    //    if(!req.cookies.account){
    //       return res.status(404).json('未获取账号信息');
    //    }
       if(req.files === null) {
        return res.status(404).json('no file')
      } 
      const file = req.files.file;
      let fileName =  Date.now()+file.name;
      console.log(fileName);
      file.mv(`${__dirname}/files/${fileName}`,(err) => {
          if(err) {
              console.error(err);
              return res.status(500).send(err)
          }
      })   
      try{    
        let {message} = await mongodb.findOne({account:req.cookies.account});       
        console.log(message); // 用户信息       
        message.photoId= fileName;
        let a = await mongodb.findOneAndUpdate({account:req.cookies.account},
        {message},
        {new:true});
        console.log(fileName);
        res.sendFile(path.join(__dirname,'files',fileName))

    } catch(err) {
        console.log(err);
    }
})

router.get('/:id',(req,res) => {  //用户头像获取路径
    console.log('获取用户图片')
    console.log(req.params.id );
    console.log(path.join(__dirname,'/files'));
    res.sendFile(path.join(__dirname,'/files',req.params.id))

})







// 更新图片信息
// router.get('/', async(req,res)=>{
//     console.log(req.cookies);
//     if(req.cookies.account){
//         let userData = await mongodb.findOne({account:req.cookies.account});
//         let photosMessage = userData.photos;
//         res.status(200).json(photosMessage)
//       }else{
//           res.status(404).send('user account is not found')
//       }
// });




module.exports  = router;