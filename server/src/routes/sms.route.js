const express = require('express');
const router = express.Router();
const { receiveSMS } = require('../controllers/sms.controller');

router.post('/receive', receiveSMS);

module.exports = router;