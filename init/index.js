const mongoose = require("mongoose");
const data = require("./data");
const Listing = require("../models/listing");

// database connection
const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlustdb";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
}

main().catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

const initDB = async () => {
   // Assuming data is an object with a 'data' property containing the listings array
  // remove old data
  await Listing.deleteMany({});
  

     // Replace with the actual user ID)
  // FIX image object -> image URL string
  const fixedData = data.data.map(obj => ({
    ...obj,
    owner:new mongoose.Types.ObjectId("64a1c8e5b9c0f2b1d8e4f123"),
    image:{
   url: obj.image.url,
   filename: obj.image.filename || "listingimage"
  
    } 
  }));

  // insert all listings
  await Listing.insertMany(fixedData);

  console.log("Database initialized with sample data");
};

initDB();
