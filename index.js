import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    const apiKey = '86fff77e969165258007612d9e550214';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    res.json({
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description
    });

  } catch (err) {
    console.error('Error fetching weather:', err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
