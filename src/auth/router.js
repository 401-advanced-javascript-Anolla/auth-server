'use strict';

const express = require('express');
const users = require('../auth/models/users/users-model');
const router = express.Router();
const basicAuth = require('./middleware/basic');
const oauth = require('./middleware/oauth');

router.post('/signup', signUp);
router.post('/signin', basicAuth, signIn);
router.get('/users', usersHandler);
router.get('/oauth', oauth, oauthHandler); // the same endpoint as in the api server


function signUp (req, res)  {
  users
    .create(req.body)
    .then((data) => {
      req.token = users.generateToken(data);
      req.user = {
        username: data.username,
        acl: data.acl,
      };
      res.cookie('auth', req.token);
      res.set('auth', req.token);
      res.json({user: req.user, token: req.token});      // => {token:aklndkalsndalksnd}
    })
    .catch((err) => res.status(403).send(err.message));
}

function signIn(req, res){
  console.log('siiiiiggggnnnn iiiinnnn');
  res.cookie('auth', req.token);
  res.set('auth', req.token);
  return res.json({user: req.username, token:req.token});    
}

function usersHandler(req, res){
  return users.read().then((list)=> {
    return res.json(list);
  });
}

function oauthHandler(req, res){
  res.json({ token: req.token});
}

module.exports = router;