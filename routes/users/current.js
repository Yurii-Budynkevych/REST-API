const express = require('express');
const { authUser } = require('../../middlewares/userAuthMiddleware');
// ененнне
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'jyrka95@gmail.com',
  from: 'yurii.budynkevych@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

// аккаваа
const router = express.Router();

router.get('/', authUser, async (req, res, next) => {
  const data = { email: req.user.email, subscription: req.user.subscription };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch(error => {
      console.error(error);
    });
  res.json(data);
});

module.exports = router;
