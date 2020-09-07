const express = require('express');
const router = express.Router();

const accessCheck = require('../middleware/rateLimit-config');
const userCtrl = require('../controllers/user');

router.post('/signup', accessCheck.accessCreateAccountLimiter, userCtrl.signup);
router.post('/login', accessCheck.accessCreateAccountLimiter, userCtrl.login);

module.exports = router;