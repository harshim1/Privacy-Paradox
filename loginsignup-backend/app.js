const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);

// mongoose.connect('mongodb+srv://shreyasa:rAxoQymiL4id41tD@cluster1.bm4u1wu.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
//write a code to connect momngodb without env


mongoose.connect('mongodb+srv://shreyasa:rAxoQymiL4id41tD@cluster1.bm4u1wu.mongodb.net/ChatDB', { useNewUrlParser: true, useUnifiedTopology: true })


  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
