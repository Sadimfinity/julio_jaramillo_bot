/**
 * NPM required packages
 */
 const bodyParser = require('body-parser');
 const morgan = require('morgan');
 const cors = require('cors');
 
 /**
  * Routes to the different resources
  */

 const morganMode = process.env.Dev ? 'dev' : 'tiny';
 const port = 8080;
 
 /**
  * Sets up the server configuration to an Express app
  * @param {*} app Basic Express app
  */
 const server = (app) => {
 
     app.set('port', port);
     app.use(bodyParser.json());
     app.use(bodyParser.urlencoded({ extended: true }));
     app.use(morgan(morganMode));
     app.use(cors());
 }
 
 module.exports = server;