import express from 'express';
import fetch from 'node-fetch'; // Note the use of import instead of require
const app = express();
const port = 3000;

const api_key = '86fff77e969165258007612d9e550214';
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
app.get('/weather', async (req, res) => {
    const {location} = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Missing location query parameter' });
    }

    // Note the correction in the use of template literals here
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${api_key}&units=metric`;

    try {
        const response = await fetch(apiurl); // Fixed variable name to match
        const data = await response.json();
        if (data.cod !== 200) {
          return res.status(data.cod).json({ error: data.message });
        }
    
        const weatherData = {
          location: data.name,
          temperature: data.main.temp,
          description: data.weather[0].description,
        };
    
        return res.json(weatherData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Corrected PORT to port
});

      
      