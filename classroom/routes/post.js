const express=require('express');
const router=express.Router();
//Post index route
//index route
router.get('/:id',(req,res)=>{
    res.send("GET for posts");
});

//show route
router.get('/:id',(req,res)=>{
    res.send("SHOW for posts id");
});
//post
router.post('/',(req,res)=>{
    res.send("POST for posts");
});
//delete
router.delete('/:id',(req,res)=>{
    res.send("DELETE for posts id");
});

module.exports = router;