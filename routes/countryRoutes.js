const express = require('express');
const axios = require('axios');
const router = express.Router();

// Επιστροφή λίστας χωρών
router.get('/countries', async (req, res) => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/positions');
    const countries = response.data.data.map(c => c.name);
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Countries fetch error' });
  }
});

// Επιστροφή πόλεων για συγκεκριμένη χώρα
router.get('/cities', async (req, res) => {
  const country = req.query.country;
  if (!country) return res.status(400).json({ message: 'Country required' });
  try {
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country });
    res.json(response.data.data);
  } catch (err) {
    res.status(500).json({ message: 'Cities fetch error' });
  }
});

module.exports = router;