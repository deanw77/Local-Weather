// STEP 1: Get city search item, Store in LS, Auto Generate Recent Searches
const apiKey = '439db1f08b48933364bec16a500bd22f';
const cityInput = $('#searchCityMenu');
const countryInput = $('#country');
const cityInputBtn = $('#cityInputBtn');
const itemsList = $('#searchItems');
const currentLocation = $('#currentLocation');
const cards = $('#fiveDayForecast');

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
    const url = 'https://api.openweathermap.org/geo/1.0/direct?';
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
            fetchWeather(lat, lon, city);
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

function fetchWeather(lat, lon, city) {
    let url = 'https://api.openweathermap.org/data/3.0/onecall?';
    let latitude = "lat=" + lat;
    let longitude = "&lon=" + lon;
    const myAPI = '&appid=' + apiKey;
    let queryURL = url + latitude + longitude + myAPI;

    fetch(queryURL)
        .then((response) => response.json())
        .then(function (data) {
            displayWeather(data, city)
            fiveDayWeather(data);
        });
}

// Display Weather for Stored Buttons
$('.historyButton').on('click', function () {
    setLocationData($(this).text(), this.dataset.country);
});

// Display Weather for Current Location
$('#currentLocation').on('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationSuccess);
    } else {
        $("#locationData").html('Your browser does not support location data retrieval.');
    }
});

function locationSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    $("#locationData").html("Latitude: " + latitude + "<br>Longitude: " + longitude);
    $('.cityName').text('');
    fetchWeather(latitude, longitude)
}

// ---- Button Functionality Complete ----

// ---- Display the Weather to Page   ----
// Display the current date
const currentDay = $("#currentDay");
const currentDate = dayjs(); 
const formattedDate = currentDate.format('dddd[,] MMMM D'); 
const day = parseInt(currentDate.format('D'));
// Switch statement to get the correct suffix for date
const nthNumber = (D) => {
    if (D > 3 && D < 21) return 'th';
    switch (D % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
};

function displayWeather(data, city) {
    $('#todaysWeather').removeClass("invisible");
    $('.cityName').text(city);
    $('.date').text(formattedDate + nthNumber(day));
    let icon = 'https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png';
    $('.weatherIcon').attr("src", icon);
    $('.weatherIcon').removeClass("invisible");
    $('.weatherIcon').attr("style", "width:120px;");
    $('.weatherSummary').text(data.current.weather[0].description).css('textTransform', 'capitalize');
    let temp = (data.current.temp - 273.15).toFixed(0);
    $('#temperature').text(temp + "°C");
    $('#windSpeed').text((data.current.wind_speed).toFixed(1) + " km/h");
    $('#humidity').text(data.current.humidity + "%");

    let timezoneOffset = data.timezone_offset;
    let unixSunrise = dayjs.unix((data.current.sunrise) + timezoneOffset);
    $("#sunrise").text(unixSunrise.format('HH[:]MM'));
    let unixSunset = dayjs.unix((data.current.sunset) + timezoneOffset);
    $("#sunset").text(unixSunset.format('H[:]MM'));
    console.log(data)
}

function fiveDayWeather(data) {
    cards.empty();
    const imageArray = [
        "images/weatherIcons/013-thermometer.png",
        "",
        ""
    ];

    for (let i = 1; i < 6; i++) {
        let newCard = $('<div>');
        newCard.attr("id", "card"+ [i]);
        newCard.addClass("card col-6  col-sm-2 text-center mt-2 p-1 bg-primary text-white border-2 border-white");
        let day = $("<h6>");
        day.addClass("card-header")
        let unixDay = dayjs.unix(data.daily[i].sunrise);
        let days = parseInt(unixDay.format('D'));
        day.text(unixDay.format('ddd D') + nthNumber(days));
        
        let newIcon = $('<img>');
        newIcon.attr("src", 'https://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png');
        newIcon.attr("style", "width:44px;");
        newIcon.addClass("m-auto");

        let summary = $('<h6>').text(data.daily[i].weather[0].main);

        let tempDiv = $('<div>')
        tempDiv.addClass("d-flex justify-content-between align-items-center col-11 m-auto");
        let tempImage = $('<img>');
        tempImage.attr("src", "images/weatherIcons/013-thermometer.png");
        tempImage.attr("style", "width:32px;");
        let temp = $('<h6>').text(((data.daily[i].temp.day) - 273.15).toFixed(0) + "°C");
        tempDiv.append(tempImage, temp)

        let windDiv = $('<div>')
        windDiv.addClass("d-flex justify-content-between align-items-center col-11 m-auto");
        let windImage = $('<img>');
        windImage.attr("src", "images/weatherIcons/008-wind.png");
        windImage.attr("style", "width:24px; margin-right:2px;");
        let wind = $('<h6>').text((data.daily[i].wind_speed).toFixed(1) + " km/h");
        windDiv.append(windImage, wind)

        let humidityDiv = $('<div>')
        humidityDiv.addClass("d-flex justify-content-between align-items-center col-11 m-auto");
        let humidityImage = $('<img>');
        humidityImage.attr("src", "images/weatherIcons/012-humidity.png");
        humidityImage.attr("style", "width:24px; margin-right:2px;");
        let humidity = $('<h6>').text(data.daily[i].humidity + "%");
        humidityDiv.append(humidityImage, humidity)
        

        newCard.append(day, newIcon, summary, tempDiv, windDiv, humidityDiv);

        cards.append(newCard);     
    }
}