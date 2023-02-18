const express = require('express');
const Joi = require('joi');
const { ContactsModel } = require('../../models/contactsModel');
const { authUser } = require('../../middlewares/userAuthMiddleware');

const router = express.Router();

router.get('/', authUser, async (req, res, next) => {
  const { _id } = req.user;
  const data = await ContactsModel.find({ owner: _id });
  res.json(data);
});

router.get('/:contactId', authUser, async (req, res, next) => {
  const { _id } = req.user;
  const data = await ContactsModel.findOne({ _id: req.params.contactId, owner: _id });
  if (!data) {
    return res.status(404).json({ message: 'contact not found' });
  }
  res.json(data);
});

router.post('/', authUser, async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: 'bad request', info: validationResult.error });
  }

  const { _id } = req.user;
  const { name, email, phone } = req.body;
  const data = await ContactsModel.create({ name, email, phone, owner: _id });
  res.json(data);
});

router.delete('/:contactId', authUser, async (req, res, next) => {
  const { _id } = req.user;
  const data = await ContactsModel.findOneAndDelete({ _id: req.params.contactId, owner: _id });
  if (!data) {
    return res.status(404).json({ message: 'contact not found' });
  }
  res.status(200).json({ message: 'done' });
});

router.put('/:contactId', authUser, async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: 'bad request', info: validationResult.error });
  }
// todo diffrent user logic
  const { _id } = req.user;
  const { name, email, phone } = req.body;
  await ContactsModel.findOneAndUpdate(
    { _id: req.params.contactId, owner: _id },
    { name, email, phone, owner: _id }
  );
  res.status(200).json({ message: 'done' });
});

router.patch('/:contactId', authUser, async (req, res, next) => {
  const schema = Joi.object({
    favorite: Joi.boolean().required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ message: 'bad request', info: validationResult.error });
  }

  await ContactsModel.findByIdAndUpdate(req.params.contactId, req.body);
  res.status(200).json({ message: 'done' });
});

module.exports = router;
