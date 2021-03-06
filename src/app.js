'use strict';

//Load express module with `require` directive
const app = require('connect')();
const http = require('http');
const swaggerTools = require("swagger-tools");
const serverPort = 3000;

// swaggerRouter configuration
const options = {
    controllers: './src/controllers',
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

const swaggerDoc = require('./api/swagger.json');

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());
  
    // Validate Swagger requests
    app.use(middleware.swaggerValidator());
  
    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));
  
    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
  
    // Start the server
    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    });
  });