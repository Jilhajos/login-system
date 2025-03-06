const express = require('express');
const { adminLogin, getMembers, getMemberById, editMember, addMember } = require('../controllers/adminController');

const router = express.Router();

// Admin login route
router.post('/admin/login', adminLogin);

// Fetch all members
router.get('/admin/members', getMembers);

// Fetch a single member by ID (for editing)
router.get('/admin/members/edit/:memberId', getMemberById);

// Edit member details
router.put('/admin/members/edit/:memberId', editMember);

// Add new member
router.post('/admin/members', addMember);

module.exports = router;
