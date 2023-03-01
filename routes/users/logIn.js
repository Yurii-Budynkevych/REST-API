const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken');
const { UsersModel } = require('../../models/usersModel');

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: 'bad request', info: validationResult.error });
  }

  const user = await UsersModel.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'Wrong email or password' });
  }
  if (user.verificationToken) {
    res.status(401).json({ message: 'Verify your email first please' });
  }

  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).json({ message: 'Wrong email or password' });
  }

  const key = crypto.randomUUID();
  await UsersModel.findOneAndUpdate({ email }, { sessionKey: key });

  const accsessToken = jsonWebToken.sign(
    { userId: user._id.toString(), sessionKey: key },
    JWT_SECRET,
    {
      expiresIn: '10h',
    }
  );
  res.status(200).json({ accsessToken });
});

module.exports = router;
