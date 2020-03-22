const express = require('express');
const router = express.Router();
const cookieparser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
let upload = multer();
const mongodb = require('../../data/mongoose-post')

let cif = {
     origin:'http://localhost:3000',
     credentials: true,
 }
router.use(cookieparser());
router.use(cors(cif));

router.post('/:id',upload.none(),async (req,res) => {      
     console.log(req.body); 
//      try {   
//           let data = await mongodb.findOne({_id:req.params.id});
//           if(!data) throw new Error('服务器未知错误')
//           let {comment} = data;          
//           comment.push(req.body);
//           console.log(comment);
//           let add = await mongodb.findOneAndUpdate({_id:req.params.id},{comment},{new:true});
//           let list = add.comment;
//           let newlist = list.slice(list.length-1,list.length);
//           res.send(newlist);
//     }catch(err) {
//          res.send(err)
//     }

          res.json('ok')
})





module.exports =router