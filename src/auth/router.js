'use strict';

const express = require('express');
const users = require('../auth/models/users/users-model');
const router = express.Router();
const basicAuth = require('./middleware/basic.js');


router.post('/signup', signUp);
router.post('/signin', basicAuth, signIn);
router.get('/users', usersHandler);

function signUp (req, res)  {
  users
    .save(req.body)
    .then((data) => {
      const token = users.generateToken(data);
      res.json({ token }); // => {token:aklndkalsndalksnd}
    })
    .catch((err) => res.status(403).send(err.message));
}

function signIn(req, res){
  return res.json({token:req.token, user: req.username});  
}

function usersHandler(req, res){
  return users.read().then((list)=> {
    return res.json(list);
  });
}

module.exports = router;