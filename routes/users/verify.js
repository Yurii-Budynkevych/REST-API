const express = require('express');
const { authUser } = require('../../middlewares/userAuthMiddleware');

const router = express.Router();

router.get('/verify/:verificationToken', authUser, async (req, res, next) => {});

module.exports = router;
