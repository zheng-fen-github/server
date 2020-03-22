const express = require('express');
const router = express.Router();
const cors = require('cors');


let cif = {
    origin:'http://49.234.96.80:3000',
    credentials: true,
}
router.get('/',cors(cif),(req,res) => {
    res.cookie('account','aaa3319906',{maxAge:12000,path:'/',httpOnly:true});
    res.send("设置cookie成功");
})

router.get('/a',cors(cif),(req,res) => {
    console.dir(req.cookies);
    res.send('nice'+req.cookies.account);
})


module.exports  = router;