const express = require('express');
const { token } = require('morgan');
const usersRouter = express.Router();

const morgan = require('morgan');
const { getAllUsers, getUserByUsername } = require('../db');

usersRouter.use(morgan('dev'));
usersRouter.use(express.json())

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
    res.send({
      users
    });
  });

usersRouter.post('/login', async (req, res, next) => {
  const prefix = 'Bearer '
  const auth = req.headers['Authorization'];
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      // create token & return to user
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET)
      res.send({ 
        message: "you're logged in!",
        token: token
    });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;