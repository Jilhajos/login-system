const express = require('express');
const router = express.Router();
const { addTrainer, getTrainers, deleteTrainer } = require('../controllers/trainerController');

router.post('/add-trainer', addTrainer);
router.get('/trainers', getTrainers);
router.delete('/delete/trainer/:id', deleteTrainer);

module.exports = router;
