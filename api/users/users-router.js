const express = require('express');
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await Users.get()
    res.status(200).json(users)
  }
  catch (err) {
    next(err)
  }
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert(req.newUser)
  .then(user => res.status(200).json(user))
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, req.body)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await Users.remove(req.params.id)
    res.status(200).json(req.user)
  }
  catch (err) {
    next(err)
  }
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  Users.getUserPosts(req.params.id)
  .then( users => {
    res.status(200).json(users)
  })
  .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  Posts.insert(req.body)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(next)
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

module.exports = router;