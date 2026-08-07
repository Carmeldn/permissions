var express = require('express');
var router = express.Router();

var authenticate = require('../middlewares/authenticate');
var { requirePermission } = require('../middlewares/authorize');
var userRoleController = require('../controllers/userRoleController');

router.get('/', authenticate, requirePermission('user.update'), userRoleController.findAll);
router.get('/user/:userId', authenticate, requirePermission('user.read'), userRoleController.findForUser);
router.post('/assign', authenticate, requirePermission('user.update'), userRoleController.assign);
router.post('/remove', authenticate, requirePermission('user.update'), userRoleController.remove);

module.exports = router;
