const express = require('express');
const { UsersModel } = require('../../models/usersModel');
const { sendEmailVerificationLetter } = require('../../services/email');

const router = express.Router();

router.get('/:verificationToken', async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await UsersModel.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await UsersModel.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
  res.status(204).send();
});

router.post('/', async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: 'missing required field email' });
  }
  const user = await UsersModel.findOne({ email });
  if (!user.verificationToken) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }
  sendEmailVerificationLetter(email, user.verificationToken);
  res.status(204).send();
});

module.exports = router;
