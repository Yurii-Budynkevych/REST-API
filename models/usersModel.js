const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  sessionKey: {
    type: String,
    default: null,
  },
});
const UsersModel = mongoose.model('users', usersSchema);
module.exports = { UsersModel };
