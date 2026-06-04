const express = require('express');
const router = express.Router();
const { createTransaction } = require('../controllers/transactions.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createTransaction);

module.exports = router;