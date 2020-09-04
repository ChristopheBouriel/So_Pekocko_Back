const validate = require('mongoose-validator')
 
exports.idValidator = [
    validate({
      validator: 'isLength',
      arguments: 24,
      message: 'Name should be between 3 and 30 characters',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-z0-9]+$/i,
      //passIfEmpty: true,
      message: 'Id should contain 24 alphanumeric characters',
    }),
  ]

exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [2, 30],
    message: 'Name should be between 2 and 30 characters',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]+$/i,
    message: 'Name should contain only letters, apostrophe and hyphen',
  }),
]

exports.manufacturerValidator = [
    validate({
      validator: 'isLength',
      arguments: [2, 30],
      message: 'Manufacturer name should be between 2 and 30 characters',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]+$/i,
      message: 'Manufacturer name should contain only letters, apostrophe and hyphen',
    }),
  ]

  exports.descriptionValidator = [
    validate({
      validator: 'isLength',
      arguments: [2, 300],
      message: 'Description should be between 2 and 300 characters',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F!?,\. '-]+$/i,
      message: 'Description should contain only alphanumeric characters, dot, comma, exclamation or question marks, apostrophe and hyphen',
    }),
  ]

  exports.pepperValidator = [
    validate({
      validator: 'isLength',
      arguments: [2, 30],
      message: 'Main pepper name should be between 3 and 30 characters',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]+$/i,
      message: 'Main pepper name should contain only letters, apostrophe and hyphen',
    }),
  ]

  