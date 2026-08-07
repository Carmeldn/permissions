var express = require('express');
var router = express.Router();

var authenticate = require('../middlewares/authenticate');
var loginRateLimit = require('../middlewares/loginRateLimit');
var authController = require('../controllers/authController');

/* POST login */
router.post('/login', loginRateLimit, authController.login);

/* POST refresh */
router.post('/refresh', authController.refresh);

/* POST logout */
router.post('/logout', authController.logout);

/* POST logout-all (révoque toutes les sessions) */
router.post('/logout-all', authenticate, authController.logoutAll);

module.exports = router;
