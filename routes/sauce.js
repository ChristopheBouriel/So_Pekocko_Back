const express = require('express');

const router = express.Router();

const reqCheck = require('../middleware/rateLimit-config');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/',reqCheck.sauceViewLimiter, auth, sauceCtrl.getAllSauces);
router.post('/',reqCheck.sauceActionLimiter, auth, multer, sauceCtrl.createSauce);
router.post('/:id/like',reqCheck.sauceLikeLimiter, auth, sauceCtrl.likeSauce); 
router.get('/:id',reqCheck.sauceViewLimiter, auth, sauceCtrl.getOneSauce);  
router.put('/:id',reqCheck.sauceActionLimiter, auth, multer, sauceCtrl.modifySauce);  
router.delete('/:id',reqCheck.sauceActionLimiter, auth, sauceCtrl.deleteSauce);


module.exports = router;