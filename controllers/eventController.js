const Event = require("../models/eventModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");


// const cloudinary = require("cloudinary");
// const path = require("path");

// create a new product--admin
exports.createNewEvent = async(req, res, next) => {
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
const {name,description}=req.body;
  Event.create({
    name:name,
    description:description
  })
    .then((event) => {
      return res.status(200).json({ sucess: true, event: event });
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(400, err));
    });
};

// get product info
exports.getEventDetails = (req, res, next) => {
  Event.findById(req.params.id)
    .then((event) => {
      if (event) {
        return res.status(200).json({ sucess: true, event: event });
      }
      return next(new ErrorHandler(404, "event not found"));
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(404, err));
    });
};

// get all products in database with filter --admin
exports.getAllEvents = async (req, res, next) => {
  Event.find().then(events=>{
    return res.status(200).json({
        sucess:true,
        events:events
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
exports.updateEvent = (req, res, next) => {
    //remove undefined keys from req.body
    const newData = {
        name: req.body.name,
        description: req.body.description,
      };
      for (const i in newData) {
        if (!newData[i]) {
          delete newData[i];
        }
      }
  Event.findByIdAndUpdate(req.params.id, newData, { new: true })
    .then((event) => {
      if (event) {
        return res.status(200).json({ sucess: true, event: event });
      }
      return next(new ErrorHandler(404, "event not found"));
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(404, err));
    });
};

// delete product from database
exports.deleteEvent = (req, res, next) => {
  Event.findByIdAndDelete(req.params.id)
    .then((event) => {
      if (event) {
       // console.log(product);
        // cloudinary.uploader.destroy(product.images[0].public_id, function(result) { console.log(result) });
        return res
          .status(200)
          .json({ sucess: true, message: "event deleted sucessfully" });
      }
      return next(new ErrorHandler(404, "event not found"));
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(404, err));
    });
};

// Review section

