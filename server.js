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

if (process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(port, () => console.log(`Server start on port ${port}`));
