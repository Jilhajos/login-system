const express = require('express');
const router = express.Router();
const { registerAdmin, getMembers, getTrainers, loginAdmin, assignTrainer } = require('../controllers/adminController');

// ✅ Admin Authentication Routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// ✅ Member & Trainer Management Routes
router.get('/admin/members', getMembers);
router.get('/admin/trainers', getTrainers);  // Fixed missing route
router.put('/admin/assign-trainer/:memberId', assignTrainer);

module.exports = router;
