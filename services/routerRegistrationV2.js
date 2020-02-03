const authenticationRouter = require('../routes/v2/authentication');

const URL_ROOT = '/api/v2';

function routerRegistrationV2 (app) {
  app.use(`${URL_ROOT}/authentication`, authenticationRouter);
}

module.exports = routerRegistrationV2;
