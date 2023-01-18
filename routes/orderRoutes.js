const express=require('express');
const { createNewOrder, getAllOrders, getOrderDetails, updateOrder, deleteOrder } = require('../controllers/orderController');




const router=express.Router();

router.get('/orders',getAllOrders);
router.get('/order/:id',getOrderDetails);


// admin routes
router.post('/order/create',createNewOrder);
router.put('/admin/order/update/:id',updateOrder);
router.delete('/admin/order/delete/:id',deleteOrder);






module.exports=router;