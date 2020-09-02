const express = require('express');

const router = express.Router();

const rateLimit = require("express-rate-limit");
const sauceViewLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    max: 200
});

const sauceActionLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 40
});

const sauceLikeLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    max: 200,
    message: "Too many likes/dislikes"
});


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('',sauceViewLimiter, auth, sauceCtrl.getAllSauces);
router.post('',sauceActionLimiter, auth, multer, sauceCtrl.createSauce);
router.post('/:id/like',sauceLikeLimiter, auth, sauceCtrl.likeSauce); 
router.get('/:id',sauceViewLimiter, auth, sauceCtrl.getOneSauce);  
router.put('/:id',sauceActionLimiter, auth, multer, sauceCtrl.modifySauce);  
router.delete('/:id',sauceActionLimiter, auth, sauceCtrl.deleteSauce);


module.exports = router;