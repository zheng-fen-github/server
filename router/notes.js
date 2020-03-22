const express = require('express');
const router = express.Router();
const mongodb = require('../data/mongoose')
const multer = require('multer');
let upload = multer();


router.post('/',upload.none(),async (req,res)=>{
    let userMessage = await mongodb.findOne({account:"aaa3319906"});
    let notes = userMessage.notes;    
    let filter = notes.filter(item => item.id !== req.body.id);
    let newNotes = [req.body,...filter];    
    newNotes.forEach(e => console.log(e.message))
    let save = await mongodb.findOneAndUpdate(
        {account:"aaa3319906"},
        {notes:newNotes},
        {new:true}
        );
    res.status(200).send('保存成功');
})
//获取日记数据
router.get('/', async(req,res)=>{
  console.log(req.cookies);
  if(req.cookies.account){
    let userData = await mongodb.findOne({account:req.cookies.account});
    let notesMessage = userData.notes;
    res.status(200).json(notesMessage)
  }else{
      res.status(404).send('user account is not found')
  }
})


router.get('/:account', async(req,res)=>{
    let userData = await mongodb.findOne({account:req.params.account});
    let notesMessage = userData.notes;
    res.status(200).json(notesMessage)
});

module.exports  = router;