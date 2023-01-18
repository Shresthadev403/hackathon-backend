const jwt=require('jsonwebtoken');

exports.sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  console.log(token);
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options);
};

exports.decodeToken =async (token) => {
  
  return  await jwt.verify(token, process.env.JWT_SECRET);
};

exports.generateCoupon =async (macAddress,amount) => {
  console.log(process.env.COUPON_SECRET_KEY);
  return jwt.sign({ macAddress:macAddress,amount:amount }, process.env.COUPON_SECRET_KEY, {
    expiresIn: process.env.COUPON_EXPIRE_TIME,
   });
};

exports.decodeCoupon =async (copoun) => {
  
  return  await jwt.verify(copoun, process.env.COUPON_SECRET_KEY);
};

