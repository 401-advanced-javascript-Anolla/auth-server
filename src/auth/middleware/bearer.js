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
    return;
  } else {
    const [auth, token] = req.headers.authorization.split(' ');
    if (auth === 'Bearer') {
    // "Bearer kansdlkasndkasndslakdn" => ["Bearer","kansdlkasndkasndslakdn"]
      return  users
        .authenticateToken(token)
        .then((records) => {
          console.log('bearer********',records);
          const validUser = records[0];
          req.user = {
            username: validUser.username,
            acl: validUser.acl,
          };
          req.token = token;
          next();
        })
        .catch((e) => next('Invalid Bearer login ', e.message));
    } else {
      next('Invalid auth header');
    }
  }
};