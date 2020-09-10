const Sauce = require('../models/sauce');
const fs = require('fs');
const xssFilters = require('xss-filters');

const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    
    const sauce = new Sauce({
      userId: xssFilters.inHTMLData(sauceObject.userId),
      name: xssFilters.inHTMLData(sauceObject.name),
      manufacturer: xssFilters.inHTMLData(sauceObject.manufacturer),
      description: xssFilters.inHTMLData(sauceObject.description),
      mainPepper: xssFilters.inHTMLData(sauceObject.mainPepper),
      heat: xssFilters.inHTMLData(sauceObject.heat),
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
      imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch((error) => {
        res.status(400).json({ error });
        const filename = sauce.imageUrl.split('/images/')[1];//effacer l'image parce qu'elle a déjà été enregistré par multer
        fs.unlink(`images/${filename}`, () => {});
      });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    let sauceObject;
    let filename;
    let sauceValid;
    if (!req.file === false) {
        Sauce.findOne({_id: req.params.id})
          .then(sauce => {
          filename = sauce.imageUrl.split('/images/')[1];
          //fs.unlink(`images/${filename}`, () => {});
          });
        sauceObject = { ...JSON.parse(req.body.sauce) };
       
        sauceValid = {
          userId: xssFilters.inHTMLData(sauceObject.userId),
          name: xssFilters.inHTMLData(sauceObject.name),
          manufacturer: xssFilters.inHTMLData(sauceObject.manufacturer),
          description: xssFilters.inHTMLData(sauceObject.description),
          mainPepper: xssFilters.inHTMLData(sauceObject.mainPepper),
          heat: xssFilters.inHTMLData(sauceObject.heat),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          };

        Sauce.updateOne({ _id: req.params.id }, { ...sauceValid })
          .then(() => {
            fs.unlink(`images/${filename}`, () => {});
            res.status(200).json({ message: 'Sauce et/ou image modifiée(s) !'});
          })
          
          .catch(error => res.status(400).json({ error }));
    } else {
        let filename;
        Sauce.findOne({_id: req.params.id})
          .then(sauce => { filename = sauce.imageUrl });

        sauceObject = {...req.body,};
        sauceValid = {
          userId: xssFilters.inHTMLData(sauceObject.userId),
          name: xssFilters.inHTMLData(sauceObject.name),
          manufacturer: xssFilters.inHTMLData(sauceObject.manufacturer),
          description: xssFilters.inHTMLData(sauceObject.description),
          mainPepper: xssFilters.inHTMLData(sauceObject.mainPepper),
          heat: xssFilters.inHTMLData(sauceObject.heat),
          };
        
        Sauce.updateOne({ _id: req.params.id }, { ...sauceValid })
          .then(()=> Sauce.update({ _id: req.params.id }, { set:{imageUrl:`${filename}`} }))
          .then(() => {res.status(200).json({ message: 'Sauce modifiée !'})})
          .catch(error => res.status(400).json({ error }));
      };
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }))
        })
        
    })
    .catch(error => res.status(400).json({error}));
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
      Sauce.updateOne({ _id: req.params.id }, { $inc:{likes: 1}, $push:{usersLiked: req.body.userId}})
        .then(() => res.status(201).json('Like ajouté !'))
        .catch(error => res.status(400).json({ error }));
    }
    else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc:{dislikes: 1}, $push:{usersDisliked: req.body.userId}})
        .then(() => res.status(201).json('Dislike ajouté !'))
        .catch(error => res.status(400).json({ error }));
    }
    else {
      if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id }, { $inc:{likes: -1}, $pull:{usersLiked: req.body.userId}})
        .then(() => res.status(201).json('Like supprimé !'))
        .catch(error => res.status(400).json({ error }));
      }
      else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id }, { $inc:{dislikes: -1}, $pull:{usersDisliked: req.body.userId}})
        .then(() => res.status(201).json('Dislike supprimé !'))
        .catch(error => res.status(400).json({ error }));
      }
    }
  })
  .catch(error => res.status(404).json({ error }));
};

