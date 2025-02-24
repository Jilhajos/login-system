const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = express();
const morgan = require('morgan')
const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))


app.use('/api', authRoutes);
app.use('/api', trainerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
