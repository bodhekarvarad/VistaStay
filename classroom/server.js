const express=require('express');
const app=express();
const userRoutes=require('./routes/user');
const postRoutes=require('./routes/post');
const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use('/posts',postRoutes);
app.use('/users',userRoutes);
app.get('/getcookies',(req,res)=>{
    res.cookie('greet','Hello');
    res.send("Cookie has been set");
});
app.get('/geert',(req,res)=>{
    let {name}=req.cookies;
    console.log(name);
    res.send("Cookie has been set");
});
app.get('/',(req,res)=>{
    console.dir(req.cookies);
    res.send('I am route');
});
app.use(cookieParser('mysecret'));
app.get('/getsignedcookie',(req,res)=>{
 res.cookie('made-in','india',{signed:true});
    res.send("Signed cookie has been set");
} );

app.get('/verify',(req,res)=>{
    console.log(req.cookies);
    res.send("Signed cookie has been set");
});

app.listen(3000,()=>{
    console.log('Server running on port 3000');
}   );
