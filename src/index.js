import "./style.css";

const city_title = document.querySelector("[data-city-title]");
const city_date = document.querySelector("[data-city-date]");
const current_weather_icon = document.querySelector(
  "[data-current-weather-icon]"
);
const current_condition = document.querySelector("[data-current-condition]");
const current_temp = document.querySelector("[data-current-temp]");

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

async function get_current(city) {
  const response = await fetch(
    `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`
  );
  const currentCityData = await response.json();

  console.log(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}`);

  currentCityData;
  display_current_weather(currentCityData);
}

function display_current_weather(currentCityData) {
  city_title.innerText = `${currentCityData["location"]["name"]}`;
  city_date.innerText = `${currentCityData["location"]["localtime"]}`;
  current_weather_icon.src = `${currentCityData["current"]["condition"]["icon"]}`;
  current_condition.innerText = `${currentCityData["current"]["condition"]["text"]}`;
  current_temp.innerText = `${currentCityData["current"]["temp_c"]}°C`;
}

// async function get_forecast("London") {

// }

get_current("London");
