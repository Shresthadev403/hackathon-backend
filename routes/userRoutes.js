const express=require('express');
const { createNewUser, signIn, signOut, getMyProfile, getAllUser, getUser, deleteUser, updateUserProfile, updateUserRole, forgetPassword, resetPassword, updateMyProfile, addToCart, removeFromCart, userPayOut } = require('../controllers/userController');
const { isAuthorized, isAuthorizedRoles } = require('../middlewares/auth');

const router=express.Router();

router.post('/user/create',createNewUser);
router.post('/signin',signIn);
// router.get('/signout',signOut);
router.get('/myprofile',getMyProfile);
// router.get('/forgetpassword',forgetPassword);
// router.patch('/resetpassword/:token',resetPassword);
router.put('/user/payout',userPayOut);
// router.patch('/user/product/addtocart/:id',isAuthorized,addToCart);
// router.patch('/user/product/removefromcart/:id',isAuthorized,removeFromCart);


// admin routes
router.get('/admin/users',getAllUser);
// router.get('/admin/user/:id',isAuthorized,isAuthorizedRoles("admin"),getUser);
router.delete ('/admin/user/delete',deleteUser);
// router.put('/admin/user/update/:id',isAuthorized,isAuthorizedRoles("admin"),updateUserProfile);
router.patch('/admin/user/update/role',updateUserRole);

module.exports=router;