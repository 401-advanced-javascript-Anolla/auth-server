'use strict';

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET || 'secret';

const userSchema = require('../users/users-schema');
const Model = require('../mongo');

class User extends Model {
  constructor() {
    super(userSchema);
  }

  async save(record){
    let data = await this.read({username:record.username});
    if(!data.length){
      record.password = await bcryptjs.hash(record.password, 3);
      let userSaved = await this.create(record);
      return userSaved;
    }
    return 'This username already exists';

  }

  async authenticateUser (user, pass){
    const data = this.read({username:user}); 
    // console.log(data);
    const valid = await bcryptjs.compare(pass, data[0].password);
    return valid ? data : Promise.reject('Wrong Password');
  }

  generateToken(user){
    const token = jwt.sign({ username: user.username }, SECRET);
    return token;
  }

  //   async authenticateToken (token){
  //     try {
  //       const tokenObject = await jwt.verify(token, SECRET);
  //       // tokenObject = {username:"someone",iat:91223238}  //iat=>issued at
  //       if (this.read(tokenObject.username) {
  //         return Promise.resolve(tokenObject);
  //       } else {
  //         return Promise.reject('User is not found!');
  //       }
  //     } catch (e) {
  //       return Promise.reject(e.message);
  //     }

//   }

}

module.exports = new User;