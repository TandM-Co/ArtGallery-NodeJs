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

function routerRegistrationV1 (app) {
  app.use('/api/user', userRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/news', newsRouter);
  app.use('/api/galery', galeryRouter);
  app.use('/api/work', workRouter);
  app.use('/api/shop', shopRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/basket', basketRouter);
  app.use('/api/manager', managerRouter);
  app.use('/api/order', orderRouter);
  app.use('/api/subscription', subscriptionRouter);
}

module.exports = routerRegistrationV1;