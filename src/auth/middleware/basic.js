'use strict';

const base64 = require('base-64');
const users = require('../models/users/users-model');

module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    next('Invalid login!');
    return;
  }
  const basic = req.headers.authorization.split(' ').pop(); // ["Basic","m4e321$342"]
  // console.log('basic', basic);
  const [user, pass] = base64.decode(basic).split(':'); // "username:1234"
  // console.log('__BasicAuth__', user, pass);
  return users
    .authenticateUser(user, pass)
    .then((validUser) => {
      console.log('*******basic*****',validUser);
      req.user = {
        username: validUser[0].username,
        acl:validUser[0].acl,
      };
      req.token = users.generateToken(validUser[0]);
      next();
    })
    .catch((err) => next(err));
  // }
};