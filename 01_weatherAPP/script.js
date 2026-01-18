const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const key = "631a28573cd7e01a854b84af5521e157";

const input = document.querySelector('.search-bar');
const button = document.querySelector('.search-icon');
const weatherImg = document.querySelector('.icon');


async function checkWeather(city) {
    const response = await fetch(url + city + `&appid=${key}`);
    var data = await response.json();

    console.log(data);

    document.querySelector('.celcius').innerHTML = Math.round(data.main.temp) + `°c`;
    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.humidval').innerHTML = data.main.humidity + `%`;
    document.querySelector('.wind1').innerHTML = data.wind.speed + ` km/hr`;

    if(data.weather[0].main === 'Clear'){
        weatherImg.src = 'img/clear.png'
    }
    else if(data.weather[0].main === 'Clouds'){
        weatherImg.src = 'img/clouds.png'
    }
}

// checkWeather();

button.addEventListener('click', () => {
    // input.preventDefault();
    checkWeather(input.value);
})