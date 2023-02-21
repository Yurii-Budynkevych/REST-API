const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts');
const registerRouter = require('./routes/users/register');
const loginRouter = require('./routes/users/logIn');
const logoutRouter = require('./routes/users/logOut');
const currentUserRouter = require('./routes/users/current');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/users/register', registerRouter);
app.use('/users/logIn', loginRouter);
app.use('/users/logOut', logoutRouter);
app.use('/users/current', currentUserRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
