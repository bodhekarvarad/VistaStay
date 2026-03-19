const mongoose = require('mongoose');
const Schema = mongoose.Schema;
main().then(()=> console.log('Connected to MongoDB'))
    .catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://localhost:27017/relationships');
 addUser();
}

const userSchema = new Schema({
    username: String,
    address:[
        {
            // _id:false,
            location: String,
            city: String,

        },
    ],
});

const User = mongoose.model('User', userSchema);
const addUser = async () => {
let user1=new User({
    username:'John',
    address:[
        {
            location:'123 Main St',     
            city:'New York',
        },
    ],
}); 

user1.address.push({
    location:'456 Elm St',
    city:'Los Angeles',
});
let result=await user1.save();
console.log(result);
};
 