require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes'); // Εισαγωγή των user routes

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

// Χρησιμοποίησε τα user routes στο API prefix /api/users
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Gym reservation system API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});