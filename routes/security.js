const express = require('express');

const router = express.Router();

const securityController = require('../controllers/security.controller');

router.post('/login', securityController.login);
router.all('/logout', securityController.logout);
router.post('/register', securityController.register);

module.exports = router;
