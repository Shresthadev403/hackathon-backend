const express=require('express');
const { getAllEvents, getEventDetails, createNewEvent, updateEvent, deleteEvent } = require('../controllers/eventController');




const router=express.Router();

router.get('/events',getAllEvents);
router.get('/event/:id',getEventDetails);


// admin routes
router.post('/admin/event/create',createNewEvent);
router.put('/admin/event/update/:id',updateEvent);
router.delete('/admin/event/delete/:id',deleteEvent);






module.exports=router;