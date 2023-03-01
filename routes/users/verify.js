const express = require('express');
const { UsersModel } = require('../../models/usersModel');

const router = express.Router();

router.get('/:verificationToken', async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await UsersModel.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await UsersModel.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
  res.status(204).send;
});

module.exports = router;
