const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { UsersModel } = require('../../models/usersModel');

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
    res.status(400).json({ message: 'Wrong email or password' });
  }

  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(400).json({ message: 'Wrong email or password' });
  }

  const accsessToken = 'uytbvrfcd';
  res.status(200).json({ accsessToken });
});

module.exports = router;
