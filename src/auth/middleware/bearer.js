'use strict';

const users = require('../models/users/users-model.js');

module.exports = (req, res, next) => {
  /*
    req.headers = {
     "authorization":"Bearer kansdlkasndkasndslakdn"
    }
    */
  // do we have the authorization headers or not?
  if (!req.headers.authorization) {
    next('Invalid Login no auth headers');
  } else {
    const [auth, token] = req.headers.authorization.split(' ');
    if (auth === 'Bearer') {
    // "Bearer kansdlkasndkasndslakdn" => ["Bearer","kansdlkasndkasndslakdn"]
      return  users
        .authenticateToken(token)
        .then((validUser) => {
          req.user = {
            username : validUser.username,
            capabilities : validUser.capabilities,
          };
          next();
        })
        .catch((e) => next('Invalid login', e.message));
    } else {
      next('Invalid auth header');
    }
  }
};