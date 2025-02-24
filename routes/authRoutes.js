const express = require('express');
const router = express.Router();
const { registerMember, getMembers,loginMember } = require('../controllers/authController');

router.post('/register', registerMember);
router.get('/members', getMembers);
router.post('/login',loginMember)

module.exports = router;
