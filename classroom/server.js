const express=require('express');
const app=express();
const userRoutes=require('./routes/user');
const postRoutes=require('./routes/post');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const flash=require('connect-flash');
const path=require('path');
// app.use(cookieParser());
// app.use('/posts',postRoutes);
// app.use('/users',userRoutes);
// app.get('/getcookies',(req,res)=>{
//     res.cookie('greet','Hello');
//     res.send("Cookie has been set");
// });
// app.get('/geert',(req,res)=>{
//     let {name}=req.cookies;
//     console.log(name);
//     res.send("Cookie has been set");
// });
// app.get('/',(req,res)=>{
//     console.dir(req.cookies);
//     res.send('I am route');
// });
// app.use(cookieParser('mysecret'));
// app.get('/getsignedcookie',(req,res)=>{
//  res.cookie('made-in','india',{signed:true});
//     res.send("Signed cookie has been set");
// } );

// app.get('/verify',(req,res)=>{
//     console.log(req.cookies);
//     res.send("Signed cookie has been set");
// });


// app.get('/reqcount',(req,res)=>{
 
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You have visited this page ${req.session.count} times`);
// });

// app.get('/test',(req,res)=>{
//     res.send("Session test");
// });
app.use(flash());

const sessionOptions={
    secret:'mysecret',
    resave:false,
    saveUninitialized:true,
  
};
app.use(session(sessionOptions));
app.set('view engine','ejs');
app.set("view engine","ejs");

app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});

app.get('/register',(req,res)=>{
let {
name='anonymous'}=req.query;
req.session.name=name;
if(!name=='anonymous'){
req.flash("success",`Welcome ${name}`);
}else{
req.flash('error',`Something went wrong`);
}
res.redirect('/hello');
});

app.get('/hello',(req,res)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
   res.render('page.ejs',{name:req.session.name,success:req.flash('success')});
})

app.listen(3000,()=>{
    console.log('Server running on port 3000');
});
