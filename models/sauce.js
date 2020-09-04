const mongoose = require('mongoose');
const inputValidator = require('../middleware/inputValidator');

const sauceSchema = mongoose.Schema({
    
    userId: {type: String, required: true, validate: inputValidator.idValidator},
    name: {type: String, required: true, validate: inputValidator.nameValidator},
    manufacturer: {type: String, required: true, validate: inputValidator.manufacturerValidator},
    description: {type: String, required: true, validate: inputValidator.descriptionValidator},
    mainPepper: {type: String, required: true, validate: inputValidator.pepperValidator},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
})

module.exports = mongoose.model('Sauce', sauceSchema);