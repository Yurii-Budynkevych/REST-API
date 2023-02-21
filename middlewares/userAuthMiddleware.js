const jsonwebtoken = require('jsonwebtoken');
const { UsersModel } = require('../models/usersModel');

const JWT_SECRET = process.env.JWT_SECRET;

const authUser = async (req, res, next) => {
  const MESSAGE = 'Authorization failed';
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: MESSAGE });
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ message: MESSAGE });
    }
    try {
      const { userId, sessionKey } = jsonwebtoken.verify(token, JWT_SECRET);
      const user = await UsersModel.findById(userId);
      if (!user) {
        return res.status(401).json({ message: MESSAGE });
      }
      if (user.sessionKey !== sessionKey) {
        return res.status(401).json({ message: MESSAGE });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: MESSAGE });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authUser };
