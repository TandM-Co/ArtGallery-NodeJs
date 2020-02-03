const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-jsdoc');
const {errorHandler} = require('../helpers/index');

function middlewareRegistration(app) {
  app.use(cors());

  app.use(bodyParser.urlencoded({extended: false}));

  app.use(bodyParser.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(
    swaggerDocument, {explorer: true}));

  app.use(passport.initialize());

  // app.use((err, req, res, next) => {
  //   errorHandler(err, res);
  //   next();
  // });

  require('../config/passport')(passport);
}

module.exports = middlewareRegistration;
