const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //delete req.body._id;
    const sauce = new Sauce({
      userId: sauceObject.userId,
name: sauceObject.name,
manufacturer: sauceObject.manufacturer,
description: sauceObject.description,
mainPepper: sauceObject.mainPepper,
heat: sauceObject.heat,
likes: 0,
dislikes: 0,
usersLiked: [],
usersDisliked: [],
      imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    console.log(sauce);
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {

    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {});
    });

    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),        
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
    if (req.body.like === 1) {
      Sauce.update({ _id: req.params.id }, { $inc:{likes: 1}, $push:{usersLiked: req.body.userId}})
        .then(() => res.status(201).json({ message: 'Like ajouté !'}))
        .catch(error => res.status(404).json({ error }));
    }
    else if (req.body.like === -1) {
      Sauce.update({ _id: req.params.id }, { $inc:{dislikes: 1}, $push:{usersDisliked: req.body.userId}})
        .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
        .catch(error => res.status(404).json({ error }));
    }
    else {
      if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.update({ _id: req.params.id }, { $inc:{likes: -1}, $pull:{usersLiked: req.body.userId}})
        .then(() => res.status(201).json({ message: 'Like supprimé !'}))
        .catch(error => res.status(404).json({ error }));
      }
      else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.update({ _id: req.params.id }, { $inc:{dislikes: -1}, $pull:{usersDisliked: req.body.userId}})
        .then(() => res.status(201).json({ message: 'Dislike supprimé !'}))
        .catch(error => res.status(404).json({ error }));
      }
    }
  })
};

