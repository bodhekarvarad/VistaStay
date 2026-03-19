const mongoose = require('mongoose');
const Schema = mongoose.Schema;
main().then(()=> console.log('Connected to MongoDB'))
    .catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://localhost:27017/relationships');
//  addOrder();
addCustomer();
}

const orderSchema = new Schema({
    item: String,
    price: Number,
});

const CustomerSchema = new Schema({
    name: String,
    orders:[{
    type:Schema.Types.ObjectId,
    ref:'Order',    
    }]
});

const Customer=mongoose.model('Customer',CustomerSchema);

const Order=mongoose.model('Order',orderSchema);


const addCustomer = async () => {

    // let order1 = await Order.findOne({ item: 'somasa' });
    // let order2 = await Order.findOne({ item: 'chips' });

    // let customer1 = new Customer({
    //     name: 'Alice',
    // });

    // customer1.orders.push(order1._id);
    // customer1.orders.push(order2._id);

    // let result = await customer1.save();
    let result=await Customer.findOne({ name: 'Alice' }).populate('orders');
    console.log(result);
};
// const addOrder=async()=>{
//     let res=await Order.insertMany([
//         { item:"somasa",price:10},
//         { item:"chips",price:20},
//         { item:"soda",price:30},
//     ]);
//     console.log(res);
// };

// addOrder();
const addCust=async()=>{
    let newCust=new Customer({
        name:'Bob',
    });

    let newOrder=new Order({
       item:"Pizza",
       price:250
    });
    newCust.orders.push(newOrder);
    await newOrder.save();
    await newCust.save();

    console.log(newCust);
}

const delCust=async()=>{
    let res=await Customer.findByIdAndDelete('69ba296e50c2f962ef074db3');
    console.log(res);
}
// addCust();
delCust();