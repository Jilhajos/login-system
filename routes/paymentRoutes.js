const express = require('express');
const { createOrder, checkPaymentStatus } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/status', checkPaymentStatus);
router.get('/status', checkPaymentStatus);


module.exports = router;
