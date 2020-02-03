const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const keys = require('../config/keys.js');

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  '469218239176-ut5gg7ioqj192v5h9i8vnmg6v54rnj6u.apps.googleusercontent.com', // ClientID
  "lR-_GMULiqSl6l5SYMfyS9yC", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: "1//04-lLAi6txOM1CgYIARAAGAQSNwF-L9IrhdM7OY0OiNgvA2mqQdrm7_ThetR-XPsMqXlixkSoGe79VCmuQcb2dAQeXy6l9mew0uE",
  token_type: "Bearer",
  access_token: 'ya29.Il-1B7DxEg_kTicDQ-MZ5EewFRRUNGIePFr7oNYeiezWBF7UQRDDKtxaIXGSVg3RS6OV98K0Q4hTvO6KVPJoqQi8RXsnJRxki5VZSK-rhM7vOKuq4H_tsIh-XXzgK82i8Q'
});

const accessToken = oauth2Client.getAccessToken()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    type: 'OAuth2',
    user: 'aleksandrtiunchik8s@gmail.com',
    clientId: '469218239176-ut5gg7ioqj192v5h9i8vnmg6v54rnj6u.apps.googleusercontent.com',
    clientSecret: 'lR-_GMULiqSl6l5SYMfyS9yC',
    refreshToken: "1//04-lLAi6txOM1CgYIARAAGAQSNwF-L9IrhdM7OY0OiNgvA2mqQdrm7_ThetR-XPsMqXlixkSoGe79VCmuQcb2dAQeXy6l9mew0uE",
    accessToken,
  }
});

transporter.use('compile', hbs({
  viewEngine: {
    extName: '.handlebars',
    defaultLayout: '',
    partialsDir: path.join(__dirname, '../views'),
    layoutsDir: path.join(__dirname, '../views')
  },
  viewPath: path.join(__dirname, '../views'),
}));

module.exports = transporter;
