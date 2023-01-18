const Order = require("../models/orderModel");
const User = require("../models/userModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");

// const cloudinary = require("cloudinary");
// const path = require("path");

// create a new product--admin
exports.createNewOrder = async (req, res, next) => {
  //  console.log(req.body);
  //  console.log(req.files[0].path);
  //   const defaultProductImage = path.join(__dirname, "../static/product.png");
  // const productImageUpload = req.files[0].path || defaultProductImage;

  // //   upload avatar imgage to cloudinary
  //   console.log(productImageUpload);
  //   const mycloud = await cloudinary.v2.uploader.upload(productImageUpload, {
  //     folder: "products",
  //     width: 400,
  //     height: 450,
  //     quality: 100,
  //     crop: "scale",
  //   });

  // const productImage={
  //   public_id: mycloud.public_id,
  //   image_url: mycloud.secure_url,
  // }
  //  return res.status(200).json({testing:true});

  // give user and image to req.body
  // req.body.images=productImage;
  // req.body.user = req.user._id;
  const { tableNo, itemId, quantity, macAddress } = req.body;
  User.findOne({ macAddress: macAddress })
    .then((user) => {
      if (!user) {
        return next(new ErrorHandler(400, "please register first"));
      }

      Order.create({
        tableNo: tableNo,
        item: itemId,
        quantity: quantity,
        user: user._id,
      }).then((order) => {
        user.currentOrders.push(order._id);
        return user.save().then(() => {
          return res
            .status(200)
            .json({ sucess: true, order: order, user: user });
        });

        // return res.status(200).json({ sucess: true, order: order });
      });
    })

    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err));
    });
};

// get product info
exports.getOrderDetails = (req, res, next) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (order) {
        return res.status(200).json({ sucess: true, order: order });
      }
      return next(new ErrorHandler(404, "order not found"));
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(404, err));
    });
};

// get all products in database with filter --admin
exports.getAllOrders = async (req, res, next) => {
  Order.find().then(orders=>{
    return res.status(200).json({
        sucess:true,
        orders:orders
    })
  })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(404, err));
    });
};

// exports.getAllFeaturedProductsFirst=(req,res,next)=>{
//   const numofDocument=9
//   Product.find().sort({ isFeatured: -1 }).limit(numofDocument).then((products)=>{
//     if(products){
//       return res.status(200).json({ sucess: true, products: products });
//     }

//   }).catch((err) => {
//     console.log(err);
//     return next(new ErrorHandler(404, err));
//   });
// };

// update product info
exports.updateOrder = (req, res, next) => {
  //remove undefined keys from req.body
  const newData = {
    quantity: req.body.quantity,
  
  };
  for (const i in newData) {
    if (!newData[i]) {
      delete newData[i];
    }
  }
  Order.findByIdAndUpdate(req.params.id, newData, { new: true })
    .then((order) => {
      if (order) {
        return res.status(200).json({ sucess: true, order: order });
      }
      return next(new ErrorHandler(404, "order not found"));
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(404, err));
    });
};

// delete product from database
exports.deleteOrder = (req, res, next) => {
  Order.findByIdAndDelete(req.params.id)
    .then((order) => {
      if (order) {
        // console.log(product);
        // cloudinary.uploader.destroy(product.images[0].public_id, function(result) { console.log(result) });
        return res
          .status(200)
          .json({ sucess: true, message: "order deleted sucessfully" });
      }
      return next(new ErrorHandler(404, "order not found"));
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(404, err));
    });
};

// Review section
