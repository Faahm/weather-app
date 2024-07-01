import "./style.css";
import weatherBackgroundColors from "./weatherColors.js";

const city_title = document.querySelector("[data-city-title]");
const city_date = document.querySelector("[data-city-date]");
const current_weather_icon = document.querySelector(
  "[data-current-weather-icon]"
);
const current_condition = document.querySelector("[data-current-condition]");
const current_temp = document.querySelector("[data-current-temp]");
const cityInput = document.getElementById("city-input");
const dropdown = document.getElementById("dropdown");
const forecastContainer = document.getElementById("forecast-container");
const gifImage = document.getElementById("gif-image");

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const GIPHY_API_KEY = "9Nd5eVjW5ErtHsMUHthCTFMYwPeHBI41";

async function getCurrent(city) {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}`
  );
  const cityData = await response.json();

  dropdown.style.display = "none";

  displayCurrentWeather(cityData);
  getForecast(cityData["location"]["name"]);
  generateGif(cityData.current.condition.text);
}

function displayCurrentWeather(cityData) {
  city_title.innerText = `${cityData["location"]["name"]}`;
  city_date.innerText = `${cityData["location"]["localtime"]}`;
  current_weather_icon.src = `${cityData["current"]["condition"]["icon"]}`;
  current_condition.innerText = `${cityData["current"]["condition"]["text"]}`;
  current_temp.innerText = `${cityData["current"]["temp_c"]}°C`;

  const weatherCode = cityData["current"]["condition"]["code"];
  const backgroundColor = weatherBackgroundColors[weatherCode];
  document.body.style.backgroundColor = backgroundColor;
}

async function getForecast(city) {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`
  );
  const forecastData = await response.json();
  displayForecast(forecastData);
}

function displayForecast(forecastData) {
  forecastContainer.innerHTML = "";

  forecastData.forecast.forecastday.forEach((day) => {
    const forecastCard = createForecastCard(day);
    forecastContainer.appendChild(forecastCard);
  });
}

function createForecastCard(dayData) {
  const card = document.createElement("div");
  card.classList.add("weather-card");

  const dateElement = document.createElement("h3");
  dateElement.innerText = dayData.date;
  card.appendChild(dateElement);

  const weatherIcon = document.createElement("img");
  weatherIcon.src = dayData.day.condition.icon;
  card.appendChild(weatherIcon);

  const conditionElement = document.createElement("p");
  conditionElement.innerText = dayData.day.condition.text;
  card.appendChild(conditionElement);

  const tempElement = document.createElement("p");
  tempElement.innerText = `${dayData.day.avgtemp_c}°C`;
  card.appendChild(tempElement);

  return card;
}

async function generateGif(query) {
  let url = `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${query}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    const gifData = await response.json();
    gifImage.src = gifData.data.images.original.url;
  } catch {
    alert("Failed to fetch a GIF.");
  }
}

async function searchCities(query) {
  const response = await fetch(
    `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
  );
  return await response.json();
}

function handleSearch() {
  const city = cityInput.value;
  if (city) {
    getCurrent(city);
    dropdown.innerHTML = "";
  }
}

function createDropdownItem(city) {
  const dropdownItem = document.createElement("div");
  dropdownItem.className = "dropdown-item";
  dropdownItem.innerText = `${city.name}, ${city.region}`;
  dropdownItem.addEventListener("click", () => {
    cityInput.value = city.name;
    handleSearch();
    dropdown.innerHTML = "";
    dropdown.style.display = "block";
  });
  return dropdownItem;
}

function displayDropdown(cities) {
  dropdown.innerHTML = "";
  dropdown.style.display = "block";
  cities.forEach((city) => {
    const item = createDropdownItem(city);
    dropdown.appendChild(item);
  });
}

cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

cityInput.addEventListener("input", async function () {
  const query = cityInput.value;
  if (query.length > 2) {
    const cities = await searchCities(query);
    displayDropdown(cities);
  } else {
    dropdown.innerHTML = "";
    dropdown.style.display = "block";
  }
});

getCurrent("London");
