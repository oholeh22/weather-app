import React, { useState } from 'react'
import './App.css'

function App() {
  const apiKey = '9af723795d04c8ad28e099f0d856be49'
  const [weatherData, setWeatherData] = useState({})
  const [city, setCity] = useState("")
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [backgroundImage, setBackgroundImage] = useState('')

  const fetchCityBackground = (cityName) => {
    const unsplashAccessKey = 'lBlcj5FUg82ibbWN453xakMRA74PXWgFmit1KT90woE' 
    fetch(`https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashAccessKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          setBackgroundImage(`url(${data.results[0].urls.regular})`);
        } else {
          setBackgroundImage('url("https://i.imgur.com/QztlVTN.jpeg")');
        }
      })
      .catch(() => setBackgroundImage('url("https://i.imgur.com/QztlVTN.jpeg")')) 
  }

  const getWeather = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData(city);
    }
  }

  const fetchWeatherData = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.cod !== 200) {
          setError(data.message)
          setWeatherData({})
        } else {
          setWeatherData(data)
          setHistory(prevHistory => [city, ...prevHistory])
          setCity("")
          setError(null)

          fetchCityBackground(data.name);
        }
      })
      .catch(() => setError("Something went wrong. Please try again."));
  }

  const date = weatherData.dt ? new Date(weatherData.dt * 1000).toLocaleString() : null

  return (
    <div className='container' style={{ backgroundImage: backgroundImage }}>
      <input
        className='input'
        placeholder='Enter City...'
        onChange={e => setCity(e.target.value)}
        value={city}
        onKeyPress={getWeather}
      />
      
      {error && <p>{error}</p>}

      {typeof weatherData.main === 'undefined' ? (
        <div>
          <p>Welcome to weather app! Enter in a city to get the weather of.</p>
        </div>
      ) : (
        weatherData.cod === 404 ? (
          <p className='city-found'>City not found!</p>
        ) : (
          <div className='weather-data'>
            <p className='city'>{weatherData.name}</p>
            <p className='temp'>
              {Math.round(weatherData.main.temp)}°C
            </p>
            <p className='weather'>{weatherData.weather[0].main}</p>
            <img 
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} 
              alt={weatherData.weather[0].description} 
            />
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            <p>Pressure: {weatherData.main.pressure} hPa</p>
            {date && <p>{date}</p>}
          </div>
        )
      )}

      <div>
        <h3>Recent Searches:</h3>
        <ul>
          {history.map((city, index) => (
            <li key={index}>{city}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
