'use strict';

const express=require('express');
const notFoundHandler = require('./middleware/404');
const errorHandler=require('./middleware/500');
const app=express();
app.use(express.json()); //body-parser to add body to the req\
app.use(express.static('./public'));
const extraRoute=require('./extra-routes');
app.use('/docs', express.static('./docs'));
const router = require('./auth/router');

const cors = require('cors');

app.use('/',router);
app.use(extraRoute);
app.use(cors());

app.use('*',notFoundHandler);
app.use(errorHandler);

module.exports={
  server:app,
  start: ()=>{
    const PORT =  process.env.PORT || 3001 ;
    app.listen(PORT,()=>{console.log(`Port ${PORT} is running`);});
  },
};