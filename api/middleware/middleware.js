const Users = require('../users/users-model')

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
}

function errorHandling(err, req, res, next) { //eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
  })
}

async function validateUserId(req, res, next) {
  try {
    const userMaybe = await Users.getById(req.params.id)
    if (userMaybe) {
      req.user = userMaybe
      next()
    } else {
      next({ status: 404, message: "user not found" })
    }
  } catch (error) {
    next(error)
  }
}

function validateUser(req, res, next) {
  const { name } = req.body
    if(name && name.trim()){
      req.newUser = req.body
      next()
    } else {
      next({status: 400, message: "missing required name field"})
    }
}

function validatePost(req, res, next) {
  const { text } = req.body
    if(text && text.trim()){
      req.newPost = req.body
      next()
    } else {
      next({status: 400, message: "missing required text field"})
    }
}

module.exports = {
  logger,
  errorHandling,
  validateUserId,
  validateUser,
  validatePost
}