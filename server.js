const express = require('express');
const path = require('path');

const middlewareRegistration = require('./services/middlewareRegistration');
const dbConnection = require('./services/dbConnection');
const API_REGISTRATION = require('./services/apiRegistration');


const app = express();
const port = process.env.PORT || 5000;

dbConnection();
middlewareRegistration(app);
API_REGISTRATION.V1(app)
API_REGISTRATION.V2(app);

app.listen(port, () => console.log(`Server start on port ${port}`));
