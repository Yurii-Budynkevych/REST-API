const express = require('express');
const { authUser } = require('../../middlewares/userAuthMiddleware');
const { UsersModel } = require('../../models/usersModel');

const router = express.Router();

router.post('/', authUser, async (req, res, next) => {
  const { _id } = req.user;
  await UsersModel.findByIdAndUpdate(_id, { sessionKey: null });
  res.status(204).send();
});

module.exports = router;
