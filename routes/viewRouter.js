const express = require('express');
const router = express.Router();
const viewController = require('./../controllers/viewsController')

router.get('/', viewController.getAll)
router.get('/overview', viewController.getOverview);
router.get('/tour/:name', viewController.getTour)
module.exports = router;