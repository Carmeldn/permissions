var express = require('express');
var router = express.Router();

var authenticate = require('../middlewares/authenticate');
var { requirePermission } = require('../middlewares/authorize');
var userController = require('../controllers/userController');

router.post('/', authenticate, requirePermission('user.create'), userController.create);
router.get('/', authenticate, requirePermission('user.read'), userController.findAll);
router.get('/:id', authenticate, requirePermission('user.read'), userController.findOne);
router.put('/:id', authenticate, requirePermission('user.update'), userController.update);
router.delete('/:id', authenticate, requirePermission('user.delete'), userController.remove);

module.exports = router;
