const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailVerificationLetter = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: 'yurii.budynkevych@gmail.com',
    subject: 'Verify your email',
    text: `follow this to verify your email address: localhost:3000/users/vetify/${verificationToken} `,
    html: `<a href="http://localhost:3000/users/verify/${verificationToken}">Click to verify your email address</a>`,
  };
  sgMail
    .send(msg)
    .then()
    .catch(error => {
      console.error(error);
    });
};

module.exports = {
  sendEmailVerificationLetter,
};
