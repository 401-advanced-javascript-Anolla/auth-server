'use strict';

const base64 = require('base-64');
const users = require('../models/users/users-model');

module.exports = (req, res, next) => {
  const basic = req.headers.authorization.split(' ').pop(); // ["Basic","m4e321$342"]
  // console.log('basic', basic);
  const [user, pass] = base64.decode(basic).split(':'); // "username:1234"
  // console.log('__BasicAuth__', user, pass);
  return users
    .authenticateUser(user, pass)
    .then((validUser) => {
      req.token = users.generateToken(validUser);
      // console.log('anthing',user,pass);
      next();
    })
    .catch((err) => next(err));
  // }
};