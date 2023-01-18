const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  macAddress: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  sessionTimes: [
    {
      type: Date,
    },
  ],
  redemCode: {
    type: String,
    trim:true
  },
  role:{
    type:String,
    default:'user'
  },
  currentOrders:[{
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

// userSchema.pre("save", async function (next) {
//   //console.log("done");
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE_TIME,
//   });
// };

// userSchema.methods.compareMacAddress = async function (enteredMacAddress) {
//   const isTrue = await bcrypt.compare(enteredMacAddress, this.macAddress);
//   return isTrue;
// };

// userSchema.methods.getResetPasswordToken = async function () {
//   const resettoken = crypto.randomBytes(20).toString("hex");
//   this.resetPasswordToken = await crypto
//     .createHash("sha256")
//     .update(resettoken)
//     .digest("hex");
//   return this.resetPasswordToken;
// };

module.exports = mongoose.model("User", userSchema);
