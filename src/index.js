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
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}`
  );
  const cityData = await response.json();

  console.log(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}`);

  display_current_weather(cityData);
  get_forecast(cityData);
}

function display_current_weather(cityData) {
  city_title.innerText = `${cityData["location"]["name"]}`;
  city_date.innerText = `${cityData["location"]["localtime"]}`;
  current_weather_icon.src = `${cityData["current"]["condition"]["icon"]}`;
  current_condition.innerText = `${cityData["current"]["condition"]["text"]}`;
  current_temp.innerText = `${cityData["current"]["temp_c"]}°C`;
}

async function get_forecast(cityData) {}

get_current("London");
