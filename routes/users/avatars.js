const path = require('path');
const fs = require('fs/promises');
const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const { UsersModel } = require('../../models/usersModel');
const { authUser } = require('../../middlewares/userAuthMiddleware');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp');
  },
  filename: function (req, file, cb) {
    const name = req.user._id.toString();
    const [_, suffix] = file.originalname.split('.');
    cb(null, name + '.' + suffix);
  },
});
const upload = multer({ storage: storage });

router.patch('/', authUser, upload.single('avatar'), async (req, res, next) => {
  const avatarDirPath = path.join('public', 'avatars', req.file.filename);
  await fs.rename(req.file.path, avatarDirPath);
  Jimp.read(avatarDirPath, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).write(avatarDirPath);
  });

  const avatatUrl = `/avatars/${req.file.filename}`;
  await UsersModel.findByIdAndUpdate(req.user._id.toString(), { avatarURL: avatatUrl });
  res.json({ message: 'ok', avatar: avatatUrl });
});

module.exports = router;
