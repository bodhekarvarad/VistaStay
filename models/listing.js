const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { required } = require("joi");
const { urlencoded } = require("express");



const listingSchema = new Schema({
  title: { type: String, required: true ,},
  description: String,
  price: Number,
  location: String,
  image: {

    url: String,
    filename: String,
  },
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
owner:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User',
  required:true

},
geomatry: {
type: {
  type: String,
  enum: ["Point"],
  required: true,

},
coordinates: {
  type: [Number],
  required: true,
}
}

});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
  await Review.deleteMany({
    _id: { $in: listing.reviews },
  });
}
});
module.exports = mongoose.model("Listing", listingSchema);
