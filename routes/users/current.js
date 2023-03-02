const express = require('express');
const { authUser } = require('../../middlewares/userAuthMiddleware');
const router = express.Router();

router.get('/', authUser, async (req, res, next) => {
  const data = { email: req.user.email, subscription: req.user.subscription };
  res.json(data);
});

module.exports = router;
