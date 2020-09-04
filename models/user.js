const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const inputValidator = require('../middleware/inputValidator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, validate: inputValidator.emailValidator },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);