const Sauce = require('../models/sauce');
const fs = require('fs');

const xssFilters = require('xss-filters');

const regex1 = RegExp(/^[a-z0-9]{24}$/);
const regex2 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]{2,30}$/);
const regex3 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]{2,30}$/);
const regex4 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F !?:(),\.'-]{2,600}$/);
const regex5 = RegExp(/^[A-Z\u00C0-\u00D6\u00D8-\u00DF]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F '-]{2,30}$/);



exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //delete req.body._id; 
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
    if (!req.file === false) {
      Sauce.findOne({_id: req.params.id})
        .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {});
          });
      sauceObject = {...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`};
    }
    else{sauceObject = {...req.body};};

    let test1 = regex1.test(sauceObject.userId);
    let test2 = regex2.test(sauceObject.name);
    let test3 = regex3.test(sauceObject.manufacturer);
    let test4 = regex4.test(sauceObject.description);
    let test5 = regex5.test(sauceObject.mainPepper);

    let sauceValid;
    let acceptModif;
    if (test1===true && test2===true && test3===true && test4===true && test5===true) {
      sauceValid = {
      userId: xssFilters.inHTMLData(sauceObject.userId),
      name: xssFilters.inHTMLData(sauceObject.name),
      manufacturer: xssFilters.inHTMLData(sauceObject.manufacturer),
      description: xssFilters.inHTMLData(sauceObject.description),
      mainPepper: xssFilters.inHTMLData(sauceObject.mainPepper),
      heat: xssFilters.inHTMLData(sauceObject.heat),
      };
      acceptModif = true;
    }

    Sauce.updateOne({ _id: req.params.id }, { ...sauceValid })
      .then(() => {
        if (acceptModif === true) {
          res.status(200).json({ message: 'Sauce modifiée !'});
        }
        else {
          res.status(400).json({ message: 'Sauce non modifiée, il y a au moins une erreur dans l\'un des champs'});
        }
      })
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
        .then(() => res.status(201).json('Like ajouté !'))
        .catch(error => res.status(400).json({ error }));
    }
    else if (req.body.like === -1) {
      Sauce.update({ _id: req.params.id }, { $inc:{dislikes: 1}, $push:{usersDisliked: req.body.userId}})
        .then(() => res.status(201).json('Dislike ajouté !'))
        .catch(error => res.status(400).json({ error }));
    }
    else {
      if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.update({ _id: req.params.id }, { $inc:{likes: -1}, $pull:{usersLiked: req.body.userId}})
        .then(() => res.status(201).json('Like supprimé !'))
        .catch(error => res.status(400).json({ error }));
      }
      else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.update({ _id: req.params.id }, { $inc:{dislikes: -1}, $pull:{usersDisliked: req.body.userId}})
        .then(() => res.status(201).json('Dislike supprimé !'))
        .catch(error => res.status(400).json({ error }));
      }
    }
  })
  .catch(error => res.status(404).json({ error }));
};

