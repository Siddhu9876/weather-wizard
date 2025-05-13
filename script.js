const apiKey = "b4cc042c67412920352c807a5cd32013"; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const errorMsg = document.getElementById("errorMsg");
const forecastContainer = document.getElementById("forecast");

// Handle intro screen
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const intro = document.getElementById("introScreen");
    const weatherBg = document.getElementById("weatherBg");

    startBtn.addEventListener("click", () => {
        intro.style.display = "none";
        weatherBg.classList.remove("hidden");
    });
});


searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});

function getWeather(city) {
    // Show loading animation
    document.getElementById("loader").style.display = "block";

    // Clear previous results
    weatherResult.classList.add("hidden");
    errorMsg.classList.add("hidden");
    weatherResult.innerHTML = `<p class="weather-info">Loading...</p>`;

    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found.");
            }
            return response.json();
        })
        .then(data => {
            showWeather(data);
            getForecast(city);
        })
        .catch(error => {
            showError(error.message);
        })
        .finally(() => {
            // Hide loading animation
            document.getElementById("loader").style.display = "none";
        });
}

function updateBackground(condition) {
    const bg = document.getElementById("weatherBg");

    // Reset all background classes
    bg.className = "weather-bg";

    if (condition.includes("Clear")) {
        bg.classList.add("sunny");
    } else if (condition.includes("Rain")) {
        bg.classList.add("rainy");
    } else if (condition.includes("Cloud")) {
        bg.classList.add("cloudy");
    } else {
        bg.classList.add("default");
    }
}

const iconCode = data.weather[0].icon;
const isNight = iconCode.includes("n");

document.body.classList.toggle("night-theme", isNight);

if (isNight) {
    document.getElementById("weatherBg").classList.add("night");
}


function showWeather(data) {
    const { name } = data;
    const { temp } = data.main;
    const { main, icon } = data.weather[0];

    weatherResult.innerHTML = `
    <div class="weather-card">
      <div class="weather-top">
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${main}" class="weather-icon" />
        <div>
          <h2>${name}</h2>
          <p class="condition">${main}</p>
        </div>
      </div>
      <div class="weather-details">
        <p><strong>Temperature:</strong> ${temp.toFixed(1)} °C</p>
        <p><strong>Feels like:</strong> ${data.main.feels_like.toFixed(1)} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      </div>
    </div>
  `;
    weatherResult.classList.remove("hidden");

    updateBackground(main);
    const iconCode = data.weather[0].icon;
    const isNight = iconCode.includes("n");

    document.body.classList.toggle("night-theme", isNight);
}


function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
}

function getForecast(city) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=5`;

    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            showForecast(data);
        });
}

function showForecast(data) {
    forecastContainer.innerHTML = '';

    for (let i = 1; i <= 3; i++) {
        const day = data.list[i * 8]; // Each forecast is every 3 hours, and we need 3 days
        const { dt_txt, main, weather } = day;
        const { temp, humidity } = main;
        const { description, icon } = weather[0];

        const forecastHTML = `
      <div class="forecast-card">
        <p><strong>${new Date(dt_txt).toLocaleDateString()}</strong></p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
        <p>${description}</p>
        <p>Temp: ${temp.toFixed(1)} °C</p>
        <p>Humidity: ${humidity}%</p>
      </div>
    `;
        forecastContainer.innerHTML += forecastHTML;
    }
}