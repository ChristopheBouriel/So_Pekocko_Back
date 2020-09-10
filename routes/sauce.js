const express = require('express');

const router = express.Router();

const reqCheck = require('../middleware/rateLimit-config');


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const checkId = require('../middleware/verifyId');

const sauceCtrl = require('../controllers/sauce');
const modifyValidator = require('../middleware/modifyValidator');

router.get('/',reqCheck.sauceViewLimiter, auth, sauceCtrl.getAllSauces);
router.post('/',reqCheck.sauceActionLimiter, auth, multer, sauceCtrl.createSauce);
router.post('/:id/like',reqCheck.sauceLikeLimiter, auth, sauceCtrl.likeSauce); 
router.get('/:id',reqCheck.sauceViewLimiter, auth, sauceCtrl.getOneSauce);  
router.put('/:id',reqCheck.sauceActionLimiter, auth, checkId, multer, modifyValidator, sauceCtrl.modifySauce);  
router.delete('/:id',reqCheck.sauceActionLimiter, auth, checkId, sauceCtrl.deleteSauce);


module.exports = router;