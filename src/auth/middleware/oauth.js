'use strict';

require('dotenv').config();

const superagent= require('superagent');
const users = require('../models/users/users-model');
const tokenServerUrl = 'https://github.com/login/oauth/access_token'; //will provide the token.
const remoteAPI = 'https://api.github.com/user';
// const mime=require('mime-types');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

module.exports = async (req, res, next) => {
  try {
    const code = req.query.code;
    console.log('__THE CODE__', code);
  
    const remoteToken = await exchangeCodeForToken(code);
    console.log('The TOKEN', remoteToken);
  
    const remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('GITHUB USER', remoteUser);
  
    const [user, token] = await getUser(remoteUser);
    console.log('LOCAL USER', user);
  
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err.message);
  }
};

async function exchangeCodeForToken(code) {
  
  const tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code', 
  });
  const access_token = tokenResponse.body.access_token;
  // console.log(access_token);
  
  return access_token;
}

async function getRemoteUserInfo(token) {
  const userResponse = await superagent
    .get(remoteAPI)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'express-app');
  const user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  const userRecord = {
    username: remoteUser.login,
    password: 'oathpassword', //anypassword
  };
  const user = await users.save(userRecord);
  const token = users.generateToken(user);
  return [user, token];
  
}

//these three function depends on each other (chained).