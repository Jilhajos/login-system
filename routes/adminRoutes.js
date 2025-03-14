const express = require('express');
const router = express.Router();
const { 
    adminLogin, 
    adminRegister, 
    getMembers, 
    getMemberById, 
    editMember, 
    addMember, 
    deleteMember,  
    forgotPassword, 
    resetPassword 
} = require('../controllers/adminController');

// Admin authentication routes
router.post('/login', adminLogin);
router.post('/register', adminRegister); // Ensure this is secure

// Member management routes
router.get('/members', getMembers);
router.get('/members/:membershipID', getMemberById); // Change if controller uses membershipID
router.put('/members/:membershipID', editMember);    // Ensure consistency
router.post('/members', addMember);
router.delete('/members/:membershipID', deleteMember); // RESTful format

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
