'use strict';

const mongoose = require('mongoose');
// let Schema = mongoose.Schema;
// let ObjectId = Schema.ObjectId;

const users = mongoose.Schema({
  // userId: {type: ObjectId},
  username: { type: String, required: true },
  password: { type: String, required: true},
});

module.exports = mongoose.model('users', users);