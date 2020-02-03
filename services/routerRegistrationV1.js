const userRouter = require('../routes/api/user');
const profileRouter = require('../routes/api/profile');
const newsRouter = require('../routes/api/news');
const galeryRouter = require('../routes/api/galery');
const workRouter = require('../routes/api/work');
const shopRouter = require('../routes/api/shop');
const searchRouter = require('../routes/api/search');
const basketRouter = require('../routes/api/basket');
const managerRouter = require('../routes/api/manager');
const orderRouter = require('../routes/api/order');
const subscriptionRouter = require('../routes/api/subscription');

const URL_ROOT = '/api';

function routerRegistrationV1 (app) {
  app.use(`${URL_ROOT}/user`, userRouter);
  app.use(`${URL_ROOT}/profile`, profileRouter);
  app.use(`${URL_ROOT}/news`, newsRouter);
  app.use(`${URL_ROOT}/galery`, galeryRouter);
  app.use(`${URL_ROOT}/work`, workRouter);
  app.use(`${URL_ROOT}/shop`, shopRouter);
  app.use(`${URL_ROOT}/search`, searchRouter);
  app.use(`${URL_ROOT}/basket`, basketRouter);
  app.use(`${URL_ROOT}/manager`, managerRouter);
  app.use(`${URL_ROOT}/order`, orderRouter);
  app.use(`${URL_ROOT}/subscription`, subscriptionRouter);
}

module.exports = routerRegistrationV1;
