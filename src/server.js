'use strict';

const express=require('express');
const notFoundHandler = require('./middleware/404');
const errorHandler=require('./middleware/500');
const app=express();

app.use('/docs', express.static('./docs'));
const router = require('./auth/router');
app.use(express.json()); //body-parser to add body to the req\



app.use(router);

app.use('*',notFoundHandler);
app.use(errorHandler);

module.exports={
  server:app,
  start: ()=>{
    const PORT =  process.env.PORT || 5000 ;
    app.listen(PORT,()=>{console.log(`Port ${PORT} is running`);});
  },
};