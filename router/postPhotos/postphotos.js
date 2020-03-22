const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose')
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongodb = require('../../data/mongoose')
const mongodb2 = require('../../data/mongoose-post')
const cors = require('cors');
const cookieparser = require('cookie-parser');
let cif = {
    origin:'http://localhost:3000',
    credentials: true,
}


router.use(cookieparser());
router.use(cors(cif));

// 图片存储方式 设置
const url = 'mongodb://localhost:27017/test';
let storage = new GridFsStorage({
    url:url,
    file: (req, file) => ({
        filename: file.originalname,
        bucketName: 'imageUploads'
    })
  });
 let gfs;
 let conn = mongoose.createConnection(url);
 conn.once('open',  () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('imageUploads')
  })


const upload = multer({storage:storage})

// 用户上传头像和名字
router.post('/avatar',upload.array('file',1),async (req,res)=>{
       console.log(req.files[0]);
       console.log(req.cookies);
       let {message} = await mongodb.findOne({account:req.cookies.account});
       console.log(message);
       message.photoId= req.files[0].id;
       let a = await mongodb.findOneAndUpdate({account:req.cookies.account},
       {message},
       {new:true});
       res.status(200).json('ok');
})

// 获取帖子数据
router.get('/',async (req,res) => {
    console.log('get post all');
    let data = await mongodb2.where('userName');
    setTimeout(() => {
        res.json(data);
    })
    

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