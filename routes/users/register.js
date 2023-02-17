const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { UsersModel } = require('../../models/usersModel');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UsersModel.findOne({ email });

  if (user) {
    return res.status(409).json({ message: 'Email in use' });
  }

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: 'bad request', info: validationResult.error });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await UsersModel.create({ email, password: passwordHash });
  res.status(201).json({ message: 'ok' });
});

module.exports = router;
