const rateLimit = require("express-rate-limit");

exports.sauceViewLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000,
    max: 200
});

exports.sauceActionLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 40
});

exports.sauceLikeLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
    message: "Too many likes/dislikes"
});

exports.accessCreateAccountLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5
});