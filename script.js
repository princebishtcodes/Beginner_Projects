const apiKey = "631a28573cd7e01a854b84af5521e157";


let userInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn')

const notFound = document.querySelector('.error');
const mainWeather = document.querySelector('.weather-info');
const searchField = document.querySelector('.search-city');

// All names and their changes
const cityName = document.querySelector('.country-txt');
const date = document.querySelector('.current-date-txt');
const cityTemp = document.querySelector('.temp-txt');
const condition = document.querySelector('.condition-txt');
const humidVal = document.querySelector('.humidity-value');
const windSpeed = document.querySelector('.wind-speed-value');
const weatherSumIMG = document.querySelector('.weather-img');


const forecastContainer = document.querySelector('.forecast-items-container')

searchButton.addEventListener('click', () => {
    if (userInput.value === "") {
        alert("Please Enter a Valid City Name...");
    }
    else if (userInput.value.trim() != '') {
        updateWeatherInfo(userInput.value.trim());
        userInput.value = '';
        userInput.blur();
    }
});

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && userInput.value.trim() != '') {
        updateWeatherInfo(userInput.value.trim());
        userInput.value = '';
        userInput.blur();
    }
})

async function fetchWeatherData(endPoint, city) {
    const url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id <= 800) return 'clear.svg';
    if (id <= 232) return 'thunderstorm.svg';
    else return 'clouds.svg';
}

function getCurrentDate() {
    const newDate = new Date();
    const options = {
        day: '2-digit',
        weekday: 'short',
        month: 'short'
    }
    return newDate.toLocaleDateString('en-GB', options);

}

async function updateWeatherInfo(city) {
    const weatherData = await fetchWeatherData('weather', city);

    if (weatherData.cod != '200') {
        showDisplay(notFound);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } = weatherData

    cityName.textContent = country;
    cityTemp.textContent = Math.round(temp) + '°C';
    condition.textContent = main;
    humidVal.textContent = humidity + ' %';
    windSpeed.textContent = speed + ' M/s';

    weatherSumIMG.src = `img/weather/${getWeatherIcon(id)}`;
    date.textContent = getCurrentDate();

    showDisplay(mainWeather);

    await updateForecastInfo(city);

}

async function updateForecastInfo(city) {
    const forecastData = await fetchWeatherData('forecast', city);
    // console.log(forecastData);
    const timeTaken = '12:00:00';
    const forecastDate = new Date().toISOString().split('T')[0];

    forecastContainer.innerHTML = '';

    forecastData.list.forEach((forecastWeather) => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(forecastDate)) {
            // console.log(forecastWeather);
            updateForecastItems(forecastWeather);
        }
    })
}

function updateForecastItems(forecastWeather) {
    // console.log(forecastWeather);
    const {
        dt_txt: date,
        main: { temp },
        weather: [{ id }]
    } = forecastWeather;

    const dateTaken = new Date(date);

    const options = {
        day: '2-digit',
        month: 'short'
    };

    const resultDate = dateTaken.toLocaleDateString('en-US', options);

    const forecastItems = `
        <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${resultDate}</h5>
                <img src="img/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>
    `

    forecastContainer.insertAdjacentHTML('beforeend', forecastItems);
}

function showDisplay(section) {
    [searchField, mainWeather, notFound].forEach((section) => {
        section.style.display = 'none';
    })

    section.style.display = 'flex';
}