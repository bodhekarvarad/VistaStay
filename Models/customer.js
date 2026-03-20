const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ================== DB CONNECTION ================== */
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationships");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}
main();

/* ================== SCHEMAS ================== */

const orderSchema = new Schema({
  item: String,
  price: Number,
});

const customerSchema = new Schema({
  name: String,
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

/* ================== MIDDLEWARE ================== */

// runs BEFORE delete query executes
customerSchema.pre("findOneAndDelete", async function () {
  console.log("🔥 Pre delete middleware triggered");
});

// runs AFTER customer deleted
customerSchema.post("findOneAndDelete", async function (customer) {
  if (customer && customer.orders.length > 0) {
    let res = await Order.deleteMany({
      _id: { $in: customer.orders },
    });
    console.log("🗑 Related orders deleted:", res);
  }
});

/* ================== MODELS ================== */

const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

/* ================== FUNCTIONS ================== */

// create orders
const addOrders = async () => {
  let res = await Order.insertMany([
    { item: "Samosa", price: 10 },
    { item: "Chips", price: 20 },
    { item: "Soda", price: 30 },
  ]);
  console.log("✅ Orders Added:", res);
};

// create customer with new order
const addCustomer = async () => {
  let newOrder = new Order({
    item: "Frooti",
    price: 25,
  });

  await newOrder.save();

  let newCustomer = new Customer({
    name: "Bob",
    orders: [newOrder._id],
  });

  await newCustomer.save();
  console.log("✅ Customer Added:", newCustomer);
};

// show populated customer
const showCustomer = async () => {
  let data = await Customer.findOne({ name: "Bob" }).populate("orders");
  console.log("📄 Populated Customer:", data);
};

// delete customer (cascade delete orders)
const deleteCustomer = async () => {
  let res = await Customer.findByIdAndDelete(
    "PUT_CUSTOMER_ID_HERE"
  );
  console.log("❌ Customer Deleted:", res);
};

/* ================== CALL FUNCTIONS ================== */

// addOrders();
addCustomer();
// showCustomer();
// deleteCustomer();