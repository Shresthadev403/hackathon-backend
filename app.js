const morgan=require('morgan');
const express=require('express');
const cookieParser=require('cookie-parser');

const error=require('./middlewares/error');
const cors=require('cors');
const multer=require('multer');

// intant
const app=express();
const upload= multer({ dest: 'uploads/' })


const fileUpload=require('express-fileupload');
// const connectDatabase = require("./config/connectDatabase");
// connectDatabase();

// // importing routes

const userRoutes=require('./routes/userRoutes');
const itemRoutes=require('./routes/itemRoutes');
const eventRoutes=require('./routes/eventRoutes');
const orderRoutes =require('./routes/orderRoutes');

// using middlewares
app.use(express.json({limit:'50mb', extended: true}));
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(cors({origin: true, credentials: true, }));
// app.use(fileUpload());
app.use(express.urlencoded({limit:'10mb',extended:true})); // parsing req.params
// app.use(express.json({limit:'10mb', extended: true}));
app.use(upload.array('image',4));


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });


// getting routes
app.use('/',userRoutes);
app.use('/',itemRoutes);
app.use('/',eventRoutes);
app.use('/',orderRoutes);



// custom middlewares
app.use(error);
// console.log(error);

module.exports =app;