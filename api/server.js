const express = require('express');
const usersRouter = require('./users/users-router');
const { logger, errorHandling } = require('./middleware/middleware')
const server = express();

server.use(express.json());

server.use('/api/users', logger, usersRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res, next) => {
  next({ status: 404, message: `${req.method} ${req.originalUrl} not found!` })
});

server.use(errorHandling) 

module.exports = server;
