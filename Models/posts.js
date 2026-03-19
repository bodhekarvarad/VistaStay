const mongoose = require('mongoose');
const Schema = mongoose.Schema;
main().then(()=> console.log('Connected to MongoDB'))
    .catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://localhost:27017/relationships');
// addData();
console.log('Data added successfully');


}

const userSchema = new Schema({
   username: String,
   email: String,
});

const postSchema = new Schema({
    content: String,    
    like: Number,
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
});

    const User=mongoose.model('User',userSchema);
    const Post=mongoose.model('Post',postSchema);

    const addData=async()=>{
        // let user1=new User({
        //     username:'john',
        //     email:'john@gmail.com'
        // });
        let user1=await User.findOne({ username: 'john' });
        let post2=new Post({
            content:'bye world',
            like:100,        
    });

    post2.user=user1;
    //await user1.save();
    await post2.save();
};

// const del=async()=>{
//    await Post.findByIdAndDelete('69ba1c83e84e5624ec1527f1');
//  await User.findByIdAndDelete('69ba1d45277060b5390ad3f7');   
// };   

// del();

const getData=async()=>{
    let result=await Post.findOne().populate('user','username -_id');
    console.log(result);
};