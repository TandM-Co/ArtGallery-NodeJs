const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Art Gallery API', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  apis: [
    './routes/api/*.js',
  ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
module.exports = swaggerJSDoc(options);