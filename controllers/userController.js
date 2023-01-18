const User = require("../models/userModel");
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const {
  sendToken,
  decodeToken,
  generateCoupon,
  decodeCoupon,
} = require("../utils/jwttoken");
// const cloudinary = require("cloudinary");
const path = require("path");
const { log } = require("console");
const Product = require("../models/itemModel");

exports.createNewUser = async (req, res, next) => {
  // const defaultAvatar = path.join(__dirname, "../static/avatar.png");
  // const avatar = req.body.avatar || defaultAvatar;
  const { name, email, macAddress } = req.body;
  // upload avatar imgage to cloudinary
  // const mycloud = await cloudinary.v2.uploader.upload(avatar, {
  //   folder: "avatars",
  //   width: 150,
  //   height: 100,
  //   quality: 60,
  //   crop: "scale",
  // });

  // create new user with given details
  User.create({
    name,
    email,
    macAddress,
  })
    .then((user) => {
      // sendToken(user, 200, res);
      // user.pa = undefined; // exclude password in resposnse
      res.status(200).json({ sucess: true, user: user });
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err));
    });
};

exports.signIn = (req, res, next) => {
  const { macAddress } = req.body;

  // console.log(email, password);
  // console.log(email, password);
  User.findOne({ macAddress: macAddress })
    .select("+macAddress")
    .then((user) => {
      if (!user) {
        return next(new ErrorHandler(404, "user not registered"));
      }

      return res.status(200).json({
        sucess: true,
        user: user,
      });
    })
    .catch((err) => {
      return next(new ErrorHandler(400, "email doesnot exist"));
    });
};

// exports.signOut = (req, res) => {
//   console.log("odd");
//   res.cookie("token", null, { expires: new Date(Date.now()) });
//   res.status(200).json({
//     sucess: true,
//     message: "Logged out sucessfully",
//   });
// };

exports.getMyProfile = (req, res, next) => {
  // const { token } = req.cookies;
  // if (!token) {
  //   next(new ErrorHandler(400, "please sign in first"));
  // }
  // console.log(token);
  console.log(req.query);
  const { macAddress } = req.query;
  console.log(macAddress);

  User.findOne({ macAddress: macAddress })
    .then(async (user) => {
      if (user) {
        let myOrders = [];
        console.log(user.currentOrders.length);
        if (user.currentOrders.length > 0) {
          for (let i = 0; i < user.currentOrders.length; i++) {
            const orderId = user.currentOrders;
            const order = await Order.findById(orderId).then((order) => {
              // console.log(order);
              // myOrders.push(order);
              return order;
            });
            myOrders.push(order);
          }
          console.log(myOrders, "............");
          user.currentOrders = myOrders;
          return res.status(200).json({
            sucess: true,
            user: user,
          });
        }
        return res.status(200).json({
          sucess: true,
          user: user,
        });
      }

      return next(new ErrorHandler(404, "please register first"));
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err));
    });
};

// update user profile
exports.userPayOut = (req, res, next) => {
  const { macAddress, billAmount } = req.body;

  User.findOne({ macAddress: macAddress })
    .then((user) => {
      if (!user) {
        return next(new ErrorHandler(404, "register first or invalid mac"));
      }
      // for reeediming coupon automatic
      if (user.redemCode) {
        decodeCoupon(user.redemCode).then((data) => {
          const redemAmount = data.amount;
          const netAmount = billAmount - redemAmount;
          if (netAmount < 0) {
            generateCoupon(user.macAddress, Math.abs(netAmount)).then(
              (code) => {
                user.redemCode = code;
              }
            );
          } else {
            user.redemCode = undefined;
          }

          // calculate to paid amount
          const toPaid = (() => {
            if (netAmount < 0) {
              return 0;
            } else {
              return netAmount;
            }
          })();

          user.currentOrders = [];

          return user.save().then(() => {
            return res.status(200).json({
              sucess: true,
              message: "sucessful payout",
              billAmount: billAmount,
              redemAmount: redemAmount,
              payableAmount: toPaid,
              user: user,
            });
          });
        });
      } else {
        user.sessionTimes.push(Date.now());
        if (user.sessionTimes.length >= process.env.SESSION_REEDEM_TIMES) {
          generateCoupon(user.macAddress, process.env.COUPON_AMOUNT).then(
            (code) => {
              user.redemCode = code;
              user.sessionTimes = [];
            }
          );
        }
        user.currentOrders = [];
        user.save().then(() => {
          return res.status(200).json({
            sucess: true,
            message: "sucessful payout",
            redemAmount: 0,
            billAmount: billAmount,
            payableAmount: billAmount,
            user: user,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err));
    });
};

// // add to cart
// exports.addToCart = (req, res, next) => {
//   Product.findById(req.params.id)
//     .then((product) => {
//       if (!product) {
//         return next(new ErrorHandler(404, "product not found"));
//       }
//       console.log(req.user._id);
//       User.findById(req.user._id)
//         .then((user) => {
//           if (user) {
//             for (let i = 0; i < user.cart.length; i++) {
//               if (user.cart[i].toString() == product._id.toString()) {
//                 return next(
//                   new ErrorHandler(
//                     400,
//                     `${product.name} is already in your cart`
//                   )
//                 );
//               }
//             }
//             // return  user.cart.map((productId) => {
//             //     if (productId.toString() == product._id.toString()) {

//             //     }
//             //   });

//             user.cart.push(product._id);
//             user.save(() => {
//               return res.status(200).json({
//                 sucess: true,
//                 message: `${product.name} added to your cart`,
//               });
//             });
//           } else {
//             return next(new ErrorHandler(404, "user not found"));
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           next(new ErrorHandler(400, err));
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       return next(new ErrorHandler(400, err));
//     });
// };

// remove from your cart
// exports.removeFromCart = (req, res, next) => {
//   Product.findById(req.params.id)
//     .then((product) => {
//       if (!product) {
//         return next(new ErrorHandler(404, "product not found"));
//       }
//       console.log(req.user._id);
//       User.findById(req.user._id)
//         .then((user) => {
//           if (user) {
//             for (let i = 0; i < user.cart.length; i++) {
//               if (user.cart[i].toString() == product._id.toString()) {
//                 user.cart.splice(i, 1);
//                 return user.save(() => {
//                   return res.status(200).json({
//                     sucess: true,
//                     message: `${product.name} removed from your cart`,
//                   });
//                 });
//               }
//             }
//             // return  user.cart.map((productId) => {
//             //     if (productId.toString() == product._id.toString()) {

//             //     }
//             //   });

//             return next(
//               new ErrorHandler(400, `${product.name} is not found in your cart`)
//             );
//           } else {
//             return next(new ErrorHandler(404, "user not found"));
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           next(new ErrorHandler(400, err));
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       return next(new ErrorHandler(400, err));
//     });
// };

// admin
exports.getAllUser = (req, res, next) => {
  User.find()
    .then((users) => {
      if (users) {
        return res.status(200).json({ sucess: true, users: users });
      }
      return next(new ErrorHandler(404, "data not found"));
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(400, err));
    });
};

// // update user Details --admin
// exports.updateUserProfile = (req, res, next) => {
//   const newData = {
//     name: req.body.name,
//     email: req.body.email,
//   };
//   for (const i in newData) {
//     if (!newData[i]) {
//       delete newData[i];
//     }
//   }

//   User.findOneAndUpdate({ _id: req.params.id }, newData)
//     .then((user) => {
//       //  console.log(user);
//       if (user) {
//         return res
//           .status(200)
//           .json({ sucess: true, message: "profile updated sucessfully" });
//       }
//       return next(new ErrorHandler(404, "user not found"));
//     })
//     .catch((err) => {
//       console.log(err);
//       return next(new ErrorHandler(400, err));
//     });
// };

// // admin
// exports.getUser = (req, res, next) => {
//   const  macA

//   User.findOne({})
//     .then((user) => {
//       if (user) {
//         return res.status(200).json({ sucess: true, user: user });
//       }
//       return next(new ErrorHandler(404, "user not found"));
//     })
//     .catch((err) => {
//       console.log(err);
//       next(new ErrorHandler(400, err));
//     });
// };

//admin delete user
exports.deleteUser = (req, res, next) => {
  const { macAddress } = req.query;
  User.findOneAndDelete({ macAddress: macAddress })
    .then((user) => {
      //  console.log(user);
      if (user) {
        return res
          .status(200)
          .json({ sucess: true, message: "user deleted sucessfully" });
      }
      return next(new ErrorHandler(404, "user not found"));
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(400, err));
    });
};

//admin update role of user
exports.updateUserRole = (req, res, next) => {
  const { targetMacAddress } = req.query;
  const { macAddress } = req.body;
  User.findOne({ macAddress: targetMacAddress }).then((user) => {
    // console.log(req.user._id);
    console.log(user);
    if (user.macAddress == macAddress) {
      return next(
        new ErrorHandler(400, "you cannot update your role yourself")
      );
    }

    if (user) {
      if (user.role === "admin") {
        user.role = "user";
      } else {
        user.role = "admin";
      }
    }

    user.save(() => {
      return res
        .status(200)
        .json({ sucess: true, message: `role changed to ${user.role}` });
    });
  });
};
