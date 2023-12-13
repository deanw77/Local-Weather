// STEP 1: Get city search item, Store in LS, Auto Generate Recent Searches
const cityInput = $('#cityInput');
const cityInputBtn = $('#cityInputBtn');
const itemsList = $('#itemsList');

// Check if local storage exists for search history, is so get it, if not create empty array.
let searchHistory = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [];
let searchCity;

// Prevent Button History Count exceeding 10;
for (let i = 10; i < searchHistory.length; i++) {
    searchHistory.pop();
}

cityInputBtn.on('click', function() {
    searchCity = cityInput.val();
    setLocationData()
});

function setLocationData() {
    // Prevent Empty Buttons Being Created
    if ( cityInput.val() != '') {
        // Prevent Duplicate Buttons Being Created
        let checks = $.inArray(cityInput.val(), searchHistory);
        if ( checks < 0 ) {
            addCity(searchCity);
            cityInput.value('');
            addCityButtons();
        }
    }
}

console.log(searchCity);
// Using unshift to add to beginning of array so latest search stays on top
function addCity(searchCity) {
    searchHistory.unshift(searchCity);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
} 

// Create the Search History Buttons
for (let i = 0; i < searchHistory.length; i++) {
    let newBtn = $('<div>');
    newBtn.addClass("col-6 col-sm-12 btn bg-primary");
    newBtn.text(searchHistory[i]);
    itemsList.append(newBtn);
}

// TODO: STEP 2: Using Latest Search item, Get Todays Weather Details

// let fullWeatherData;
// let lat;
// let lon;
// let url;

// let weatherData;

//     url = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchCity + ',uk&APPID=' + apiKey;
//     data = fetch(url)
//         .then(function (response) {
//             return response.json();
//         }).then(function (data) {
//             weatherData = data;
//             return(data);
//         });   


// //getWeatherData('London');
// console.log(weatherData)
const apiKey = '439db1f08b48933364bec16a500bd22f';

function fetchWeather(queryCity) {
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchHistory[0] + ',uk&APPID=' + apiKey;

    fetch(url)
        .then((response) => response.json())
        .then((data) => console.log(data));
}

fetchWeather();

// TODO: Display Todays Relevant Weather Icon

// TODO: Display Todays Weather Data

// TODO: Using Latest Search item, Get the five day forecast

// TODO: Update the days starting from tomorrow

// TODO: Update each Daily Weather Icon

// TODO: Update daily data for the five day

// TODO: Fill in the final box with some kind of summary