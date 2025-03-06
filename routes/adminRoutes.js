const express = require('express');
const router = express.Router();
const { 
    adminLogin, 
    getMembers, 
    getMemberById, 
    editMember, 
    addMember, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/adminController');

// Admin authentication routes
router.post('/login', adminLogin);

// Member management routes
router.get('/members', getMembers);
router.get('/members/:memberId', getMemberById);
router.put('/members/:memberId', editMember);
router.post('/members', addMember);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
