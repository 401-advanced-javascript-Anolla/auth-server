'use strict';

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET || 'secret';

const userSchema = require('../users/users-schema');
const Model = require('../mongo');

// let roles = {
//   user :  ['read'],
//   writer : ['read' ,'create'],
//   editor : ['read' ,'create' , 'update'],
//   administrator :  ['read' ,'create' , 'update' , 'delete'],
// };

class User extends Model {
  constructor() {
    super(userSchema);
  }

  // async save(record){
  //   return this.read({ username: record.username }).then((result) => {
  //     if (!result.length) {
  //       return bcryptjs.hash(record.password, 5).then((hash) => {
  //         record.password = hash;
  //       });
  //     } else {
  //       console.log('username already exists');
  //     }
  //   });
  // }


  authenticateUser (user, pass){
    // console.log('---------------------',user,pass);
    return this.read({username:user}).then((data)=>{
      // console.log('---------------------',data);
      return bcryptjs.compare(pass, data[0].password).then((isValid)=>{  
        return isValid ? data : Promise.reject('Wrong Password');
      });
    });
  }

  generateToken(user){
    // console.log('-----------------',user.acl);
    const token = jwt.sign({username: user.username ,id:user._id, exp: Math.floor(Date.now() / 1000) + (15 * 60),capabilities:user.acl ? user.acl.capabilities : [],type: user.type || 'user'}, SECRET);
    return token;
  }

  authenticateToken (token){
    try {
      let tokenObject = jwt.verify(token, SECRET);
      console.log(tokenObject._id);
      return this.read({ _id: tokenObject.id });
    } catch (e) {
      throw new Error('Invalid Token');
    }
  }

  can(user, capability) {
    return user.acl.capabilities.includes(capability);
  }
}

module.exports = new User();