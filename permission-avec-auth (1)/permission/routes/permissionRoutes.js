var express = require('express');
var router = express.Router();

var authenticate = require('../middlewares/authenticate');
var { requirePermission } = require('../middlewares/authorize');
var permissionController = require('../controllers/permissionController');

router.post('/', authenticate, requirePermission('permission.create'), permissionController.create);
router.get('/', authenticate, requirePermission('permission.read'), permissionController.findAll);
router.get('/:id', authenticate, requirePermission('permission.read'), permissionController.findOne);
router.put('/:id', authenticate, requirePermission('permission.update'), permissionController.update);
router.delete('/:id', authenticate, requirePermission('permission.delete'), permissionController.remove);

module.exports = router;
