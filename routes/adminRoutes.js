const express = require('express');
const router = express.Router();
const { 
    adminLogin, 
    getMembers, 
    getMemberById, 
    editMember, 
    addMember, 
    deleteMember,  // Added deleteMember function
    forgotPassword, 
    resetPassword,adminRegister 
} = require('../controllers/adminController');

// Admin authentication routes
router.post('/login', adminLogin);
router.post('/register',adminRegister);

// Member management routes
router.get('/members', getMembers);
router.get('/members/:memberId', getMemberById);
router.put('/members/:memberId', editMember);
router.post('/members', addMember);
router.delete('/members/delete/:memberId', deleteMember);  // Added DELETE route


// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
