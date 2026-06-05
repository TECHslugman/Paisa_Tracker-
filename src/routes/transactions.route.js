const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions, deleteTransaction, updateTransaction,getTransactionById} = require('../controllers/transactions.controller');
const { getHomeSummary } = require('../controllers/transactions.analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransactions);
router.get('/home-summary', authMiddleware, getHomeSummary);
router.delete('/:id', authMiddleware, deleteTransaction);
router.patch('/:id', authMiddleware, updateTransaction);
router.get('/:id', authMiddleware, getTransactionById);
module.exports = router;