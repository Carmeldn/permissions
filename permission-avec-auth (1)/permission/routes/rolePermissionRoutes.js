var express = require('express');
var router = express.Router();

var authenticate = require('../middlewares/authenticate');
var { requirePermission } = require('../middlewares/authorize');
var rolePermissionController = require('../controllers/rolePermissionController');

router.get('/', authenticate, requirePermission('role.update'), rolePermissionController.findAll);
router.get('/role/:roleId', authenticate, requirePermission('role.read'), rolePermissionController.findForRole);
router.post('/assign', authenticate, requirePermission('role.update'), rolePermissionController.assign);
router.post('/remove', authenticate, requirePermission('role.update'), rolePermissionController.remove);

module.exports = router;
