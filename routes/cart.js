const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cart.controller');

router.all('/', cartController.show);
router.all('/:id/add', cartController.add);
router.all('/:order/remove', cartController.remove);
router.all('/clear', cartController.clear);

module.exports = router;
