const express = require('express');
const router = express.Router();

const rateLimit = require("express-rate-limit");
const accessCreateAccountLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5
});

const userCtrl = require('../controllers/user');


router.post('/signup', accessCreateAccountLimiter, userCtrl.signup);
router.post('/login', accessCreateAccountLimiter, userCtrl.login);

module.exports = router;