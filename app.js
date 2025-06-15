require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/userRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const programRoutes = require('./routes/programRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const countryRoutes = require('./routes/countryRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', countryRoutes); 
app.get('/', (req, res) => {
  res.send('Gym reservation system API is running');
});

// Προαιρετικό error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});