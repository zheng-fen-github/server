const express = require('express');
const router = express.Router();
const mongodb = require('../../data/mongoose');
const cookieparser = require('cookie-parser');
const multer = require('multer');
let upload = multer();
const cors = require('cors');

let cif = {
    origin:'http://localhost:3000',
    credentials: true,
}
router.use(cookieparser());
router.use(cors(cif));

router.get('/:account', async(req,res)=>{
    try{
      let user = await mongodb.findOne({account:req.params.account});
      
      if(!user) {
          res.status(404).json('未找到账号');
      }else{
         res.status(200).json(true);
      }
      
   }catch(err) {
       console.log(err)
   }
      
    
});
// 获取账号信息
router.get('/',async (req,res) => {    // 测试cookie 是否获取的到
    console.log('cookie 查看 +++');
    console.log(req.cookies);
    let {account} = req.cookies;
    if(account) {
        let message = await mongodb.findOne({account:account});
        if(message) {
            res.json(message)
        }else{
            res.status(404).json('未找到账号信息')
        }
    }else{
        res.status(404).json('未找到cookie')
    }
})

router.get('/cookie/look',async (req,res) => {    // 测试cookie 是否获取的到
    console.log('cookie');
    console.log(req.cookies);
    let {account} = req.cookies;
    if(account) {
        let userMessage = await mongodb.findOne({account:account});
        if(userMessage){
            res.status(200).json(userMessage);
        }else{
            res.status(404).json('未找到信息')
        }                
    }else{
        res.status(404).json('未找到cookie')
    }
})




router.post('/',upload.none(),async (req,res) => {  //登录检测
    
    try{
        let {email,account} = req.body;
        let user = await mongodb.findOne({account:email || account});
        if(!user) {
            res.status(400).json('not account')
        }else{
            let {account,password} = user; 
            let result = account === req.body.account && req.body.password === password;
            if(result) {
                res.cookie('account',req.body.account,{maxAge:600000,path:'/',httpOnly:true});
                res.cookie('password',req.body.password,{maxAge:600000,path:'/',httpOnly:true})
                res.json('ok');
            }else{
                res.status(303).json('密码不对');
            }
        }
                        
     }catch(err) {
         console.log(err)
     }
})
router.post('/registered',upload.none(),async (req,res) =>{
     try{
         console.log(req.body);
       let find = await mongodb.findOne({account:req.body.account});
       let find2 = await mongodb.findOne({email:req.body.email});
       if(find || find2){
           find?res.status(412).json('account is has'):res.status(412).json('email is has')           
       }else{
           let {account,email,password} = req.body;
           if(account && email && password) {
               console.log('test')
                  let now = Date.now();
                    new mongodb({account,email,password,userName:email,message:{id:+now,photoId:"",name:now}}).save()
                    .then(result =>{
                        if(result){
                            res.status(201).json(result);
                        }
                    }).catch(err=>{
                        res.status(500).send('注册失败了，可能是运气不好'+err)
                    })
           }else {
                     res.status(404).json('包含的信息缺少内容')
           }
       }

       
     }catch(err){
         if(err) console.log('server err :     '+err)
     }
})

module.exports =router