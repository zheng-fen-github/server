const express = require('express');
const router = express.Router();
const mongodb = require('../../data/mongoose')


router.get('/:account', async(req,res)=>{
    console.log(req.params.account)
    let userphoto = await mongodb.findOne({account:req.params.account});
    
    res.json( userphoto);
});



module.exports =router