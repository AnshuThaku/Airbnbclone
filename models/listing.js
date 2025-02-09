const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review=require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String ,
    url: String ,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",

    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});
listingSchema.post("findOneAndDelete",async(Listing)=>{
  if(Listing){
    await review.deleteMany({_id:{$in:Listing.reviews}})

  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
