const express=require('express');
const { getAllItems, getItemDetails, createNewItem, updateItem, deleteItem } = require('../controllers/itemController');



const router=express.Router();

router.get('/items',getAllItems);
router.get('/item/:id',getItemDetails);


// admin routes
router.post('/admin/item/create',createNewItem);
router.put('/admin/item/update/:id',updateItem);
router.delete('/admin/item/delete/:id',deleteItem);






module.exports=router;