const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const mongodb = require('./data/mongoose.js')


const uploadUserPhoto = require('./router/postPhotos/test');
const notes = require('./router/notes')
const form = multer();
const cookieparser = require('cookie-parser');

const usermessage = require('./router/usermessage/user')

const login = require('./router/login/account.js')

const ins = require('./router/ins/post')

const socket = require('socket.io')

app.use(express.json());
let cif = {
    origin:'http://49.234.96.80:3000',
    credentials: true,
}
app.use(cors(cif));
app.use(cookieparser());


//帖子功能路由
app.use('/post',ins)


//上传图片
app.use('/upload',uploadUserPhoto)  //修改用户头像

//上传notes
app.use('/notespost',notes)
// app.use('/cookie',cookie)

//用户资料 
app.use('/user',usermessage)

// 登录账号
app.use('/login',login)

const get  = require('./router/postPhotos/getPhoto')
app.use('/getphoto',get)

// const comment = require('./router/comment/comment') //帖子评论路由
// app.use('/comment',comment)


// 验证账号
app.post('/account',form.none(),async (req,res)=>{
   console.log(req.body);
   const yanzheng = await mongodb.findOne({account:req.body.account})
   console.log(yanzheng)
   if(yanzheng){
       if(req.body.password===yanzheng.password){
           console.log('验证成功')
           res.cookie('account',req.body.account,{maxAge:600000,path:'/',httpOnly:true});
           res.cookie('password',req.body.password,{maxAge:600000,path:'/',httpOnly:true})
           console.log(res.cookies);
           res.status(200).send('true');
       }else{
           res.status(303).send('密码错误！！')
       }
   }else{
       res.status(404).send('请查看账号是否无误！！')
   }
   
});



app.get('/users/:id',async (req,res)=>{
    let userMessage = await mongodb.findOne({account:req.params.id});
    console.log(req.params.id);
    console.log(userMessage);
    if(userMessage){
        res.status(200).send(userMessage);
    }else{
        res.status(404).send('未找到相关信息。')
    }
    
});
// 修改密码
app.put('/:id',async (req,res)=>{
    console.log(req.params.id);
    let a = await mongodb.findOneAndUpdate({email:req.params.id},{password:'12678'},{new:true});
    console.log(a);
    res.send(a);
})



const server = app.listen(3001,()=>console.log('server started ....'));

let io = socket(server);

io.on('connection',(socket) => {
    console.log('made socket connection',socket.id);   

    socket.on('chat',(data) => {
        console.log(data.message);
        io.sockets.emit('chat',data);
    })
    socket.on('post',(data) => {
       console.log(data);
       io.sockets.emit('chat',data); 
    })
})



module.exports = io;

