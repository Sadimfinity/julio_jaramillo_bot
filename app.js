/**
 * NPM packages
 */
 const express = require('express');

 /**
  *  Imports the server of server.js 
  */
 const server = require('./server');
 
 /**
  * Initializes the express server
  */
 let app = new express();
 server(app);
 
 app.listen(process.env.PORT || 5000, () => {
     console.log(`The app is listening on the port ${app.get('port')}`);
 });