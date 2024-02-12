const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

//Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

const url = "https://api.open-meteo.com/v1/forecast";
const location = {
  latitude: -36.8485,
  longitude: 174.7635,
  hourly: "temperature_2m",
  timezone: "Australia/Sydney",
};

//The API https://open-meteo.com doesn't need an API key

// Endpoint to get weather data for the default location
app.get("/weather", async (req, res) => {
  try {
    const weatherData = await getWeatherData(location);
    res.json(weatherData);
    //console.log(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to fetch weather data from Open Meteo API
async function getWeatherData(location) {
  try {
    const response = await axios.get(
      `${url}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m&timezone=Pacific%2FAuckland`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
}

// Endpoint to change default location and get new weather data
app.get("/setLocation/:newLocation", async (req, res) => {
  const newLocation = req.params.newLocation;
  try {
    const weatherData = await getWeatherData(newLocation);
    defaultLocation = newLocation;
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
