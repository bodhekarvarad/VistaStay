const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true ,},
  description: String,
  price: Number,
  location: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1620127682229-33388276e540?q=80&w=791&auto=format&fit=crop",
  },
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = mongoose.model("Listing", listingSchema);
