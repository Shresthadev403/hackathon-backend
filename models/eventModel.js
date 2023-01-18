const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the event name"],
    trim: true,
  },
description:{
  type:String,
  required:true,
},
createdAt: {
  type: Date,
  default: Date.now,
},
updatedAt: Date,
  
//   images: [
//     {
//       public_id: String,
//       image_url: String,
//     },
//   ],
// //   brand: {
// //     type: String,
// //   },
//   category: [
//     {
//       type: String,
//     },
//   ],
//   price: {
//     type: String,
//   },
//   stock: {
//     type: Number,
//     required: [true, "Please enter stock product"],
//     maxlength: [4, "Stock cannot exceed more than 4 charaters"],
//     default: 1,
//   },
//   user:{
//       type:mongoose.Schema.ObjectId,
//      ref:'User',
//      required:true

//   },
//   rating: {
//     type: Number,
//     default: 0,
//   },
//   number_of_rating: {
//     type: Number,
//     default: 0,
//   },
//   isFeatured: {
//     type: Boolean,
//     default:false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt:Date,
//   numOfReviews: {
//     type: Number,
//     default: 0,
//   },
//   reviews: [
//     {
//       user: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       rating: {
//         type: Number,
//         required: true,
//       },
//       comment: {
//         type: String,
//         required: true,
//       },
//       postedDate:{
//         type:Date,
//         default:Date.now
//       }
//     },
//   ]
});

module.exports = mongoose.model("Event", eventSchema);