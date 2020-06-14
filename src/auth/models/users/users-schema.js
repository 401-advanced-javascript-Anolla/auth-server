'use strict';

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const roles=require('./roles-schema'); // it's not used but it's needed 


const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true},
  role : {
    type : String,
    default : 'user',
    enum : ['administrator', 'editor' ,'writer','user'],
  },
  // after virtual join (not stored)
  // acl : {
  // id :*,
  // role:*,
  // capabilities:[**],
  // }
},
{toObject:{virtuals:true}, toJSON:{virtuals:true}});

// this is not persisted into the db only to show on run time
// to put a doc in another doc
users.virtual('acl', {
  ref: 'roles', // the collection name
  localField: 'role', //a field in users schema field
  foreignField: 'role', // in roles schema field
  justOne: true,
});
users.pre('find', function () {
  // put the roles doc values on the acl key in the user doc
  // in pre we dont need to call .execPopulate()
  this.populate('acl');
});
users.pre('save', async function () {
  //this.password = "1234"
  this.password = await bcryptjs.hash(this.password, 10);
});
users.post('save', async function () {
  // put the roles doc values on the acl key in the user doc
  // in post we need to call .execPopulate()
  await this.populate('acl').execPopulate();
});
module.exports = mongoose.model('users', users);