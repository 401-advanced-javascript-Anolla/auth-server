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

  // async authenticateUser (user, pass){
  //   console.log('---------------------',data);
  //   const data = await this.read({username:user}); 
  //   const valid = await bcryptjs.compare(pass, data[0].password);
  //   return valid ? data : Promise.reject('Wrong Password');
  // }

  authenticateUser (user, pass){
    // console.log('---------------------',user,pass);
    return this.read({username:user}).then((data)=>{
      return bcryptjs.compare(pass, data[0].password).then((isValid)=>{  
        return isValid ? data : Promise.reject('Wrong Password');
      });
    });
  }

  generateToken(user){
    // console.log('hello',user._id);
    const token = jwt.sign({username: user.username ,id:user._id, exp: Math.floor(Date.now() / 1000) + (15 * 60)}, SECRET);
    return token;
  }

  authenticateToken (token){
    const tokenObject = jwt.verify(token, SECRET);
    return this.read({_id:tokenObject._id}).then((data)=>{    
      // console.log('after read', data );
      if(data.length===0){
        return Promise.reject('ID not found');
      }
      else{
        return Promise.resolve(data[0]);
      }
    });
    //   // tokenObject = {username:"someone",iat:91223238}  //iat=>issued at
    //   if (this.read(tokenObject.username) {
    //     return Promise.resolve(tokenObject);
    //   } else {
    //     return Promise.reject('User is not found!');
    //   }
  }
}

module.exports = new User;