'use strict';

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;

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

}

module.exports = new User;