var express = require('express');
var router = express.Router();

var authenticate = require('../middlewares/authenticate');
var { requirePermission } = require('../middlewares/authorize');
var roleController = require('../controllers/roleController');

router.post('/', authenticate, requirePermission('role.create'), roleController.create);
router.get('/', authenticate, requirePermission('role.read'), roleController.findAll);
router.get('/:id', authenticate, requirePermission('role.read'), roleController.findOne);
router.put('/:id', authenticate, requirePermission('role.update'), roleController.update);
router.delete('/:id', authenticate, requirePermission('role.delete'), roleController.remove);

module.exports = router;
