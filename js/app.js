// STEP 1: Get city search item, Store in LS, Auto Generate Recent Searches
const apiKey = '439db1f08b48933364bec16a500bd22f';
const cityInput = $('#searchCityMenu');
const countryInput = $('#country');
const cityInputBtn = $('#cityInputBtn');
const itemsList = $('#searchItems');
const currentLocation = $('#currentLocation');

// Check if local storage exists for search history, is so get it, if not create empty array.
let searchHistory = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [];
let searchHistoryCountry = localStorage.getItem("searchHistoryCountry") ? JSON.parse(localStorage.getItem("searchHistoryCountry")) : [];
let searchCity;
let searchCountry;

// Prevent Button History Count exceeding 10;
for (let i = 9; i < searchHistory.length; i++) {
    searchHistory.pop();
    searchHistoryCountry.pop();
}
// Create Initial History Button List 
createHistButtons(searchHistory, searchHistoryCountry);

// On Click, Check For blank entry or duplicat then:
// Add the city and country to local storage and re-run create hist buttons function
cityInputBtn.on('click', function(event) {
    event.preventDefault();

    if ( cityInput.val() != '') {
        // Prevent Duplicate Buttons Being Created
        let newsearch = cityInput.val().toUpperCase();
        let arrayCheck = searchHistory.map(function(x){ return x.toUpperCase(); })
        searchCity = cityInput.val();   
        searchCountry = countryInput.val();
        let checks = $.inArray(newsearch, arrayCheck);
        if ( checks < 0 ) {
            addCity(searchCity, searchCountry);
            createHistButtons(searchHistory, searchHistoryCountry);
        }  
        setLocationData(searchCity, searchCountry); 
    }
    cityInput.val(''); 
});

// // Using unshift to add to beginning of array so latest search stays on top
function addCity(searchCity, searchCountry) {
    searchHistory.unshift(searchCity);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    searchHistoryCountry.unshift(searchCountry);
    localStorage.setItem("searchHistoryCountry", JSON.stringify(searchHistoryCountry));
} 

function createHistButtons(searchHistory, searchHistoryCountry) {   
    itemsList.empty()      
    for(let i = 0; i < searchHistory.length; i++){
        let newButton = $('<li>');
        newButton.attr("data-country", searchHistoryCountry[i]).text(searchHistory[i]);
        newButton.addClass("btn btn-primary mb-2 historyButton");
        itemsList.append(newButton);
    }     
}

function setLocationData(city, country) {
    const url = 'http://api.openweathermap.org/geo/1.0/direct?';
    let cityName = 'q=' + city;
    let countryCode = ',' + country;
    const myAPI = '&appid=' + apiKey
    let queryURL = url + cityName + countryCode + myAPI;

    let lat;
    let lon;

    fetch(queryURL)
        .then((response) => response.json())
        .then(function (data) {
            lat = data[0].lat;
            lon = data[0].lon;
            fetchWeather(lat, lon)
        })
        .catch(() => {
            errorActions();
        });
}

function errorActions() {
    alert("Location not found. \nPlease check country searched."); 
    searchHistory.shift();
    searchHistoryCountry.shift();
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    localStorage.setItem("searchHistoryCountry", JSON.stringify(searchHistoryCountry));
    createHistButtons(searchHistory, searchHistoryCountry)
}

function fetchWeather(lat, lon) {
    let url = 'https://api.openweathermap.org/data/3.0/onecall?';
    let latitude = "lat=" + lat;
    let longitude = "&lon=" + lon;
    const myAPI = '&appid=' + apiKey;
    let queryURL = url + latitude + longitude + myAPI;

    fetch(queryURL)
        .then((response) => response.json())
        .then(function (data) {
            displayWeather(data)
        });
}

// Display Weather for Stored Buttons
$('.historyButton').on('click', function () {
    setLocationData($(this).text(), this.dataset.country);
});

function displayWeather(data) {
    console.log(data)
}






// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={API key}