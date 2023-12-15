// // STEP 1: Get city search item, Store in LS, Auto Generate Recent Searches
// const cityInput = $('#cityInput');
// const cityInputBtn = $('#cityInputBtn');
// const itemsList = $('#itemsList');
// let lat;
// let lon;

// // Check if local storage exists for search history, is so get it, if not create empty array.
// let searchHistory = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [];
// let searchCity;

// // Prevent Button History Count exceeding 10;
// for (let i = 10; i < searchHistory.length; i++) {
//     searchHistory.pop();
// }

// cityInputBtn.on('click', function(event) {
// event.preventDefault();

//     searchCity = cityInput.val();
//     setLocationData()
// });

// function setLocationData() {
//     // Prevent Empty Buttons Being Created
//     if ( cityInput.val() != '') {
//         // Prevent Duplicate Buttons Being Created
//         let checks = $.inArray(cityInput.val(), searchHistory);
//         if ( checks < 0 ) {
//             addCity(searchCity);
            
//             //addCityButtons();
//             cityInput.value('');
//         }
//         geoCode(cityInput.val())
//     }
// }

// // Using unshift to add to beginning of array so latest search stays on top
// function addCity(searchCity) {
//     searchHistory.unshift(searchCity);
//     localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
// } 

// // Create the Search History Buttons
// for (let i = 0; i < searchHistory.length; i++) {
//     let newBtn = $('<div>');
//     newBtn.addClass("col-6 col-sm-12 btn bg-primary");
//     newBtn.text(searchHistory[i]);
//     itemsList.append(newBtn);
// }

// const apiKey = '439db1f08b48933364bec16a500bd22f';

// function geoCode(searchCity) {
//     let url = 'http://api.openweathermap.org/geo/1.0/direct?'
//     let city = searchCity;
//     let limit = 10;
//     let queryURL = url + 'q=' + city + "&limit=" + limit + '&appid=' + apiKey;

//     fetch(queryURL)
//         .then((response) => response.json())
//         .then(function (data) {
//             if ( data.length > 0 ) {
//                 $('#modal').css("display", "block");
//                 $('#overlay').css("display", "block");
//                 for (let i = 0; i < data.length; i++) {
//                     let div = $('<tr>')
//                     div.addClass("d-flex col-12 justify-content-around align-items-center justify-items-around mb-2 flex-wrap")
// ;
//                     let cityName = $('<td>').addClass("col-3 mt-2").text(data[i].name);
//                     let state = $('<td>').addClass("col-3 mt-2").text(data[i].state);
//                     let country = $('<td>').addClass("col-3 mt-2").text(data[i].country);
//                     let button = $('<td>').addClass("col-3 mt-2").text("Select");
//                     button.attr("data-lat", data[i].lat);
//                     button.attr("data-lon", data[i].lon);
//                     button.addClass("btn btn-primary p-0 mt-2");

//                     div.append(cityName, state, country, button)
//                     $('#citySelection').append(div)
//                 }
//                 $('.btn').on('click', function() {
//                     lat = this.dataset.lat
//                     lon = this.dataset.lon
//                     console.log(lat)
//                     console.log(lon) 
//                 });

//                 // console.log(lat)
//                 // console.log(lon) 
//             } else {

//             }
//         });  
        
           
// }

// //geoCode(searchCity);

// // function fetchWeather(queryCity) {
// //     let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchHistory[0] + ',uk&APPID=' + apiKey;

// //     fetch(url)
// //         .then((response) => response.json())
// //         .then(function (data) {
// //             $('#cityName').text(data.name);
// //             $('#tempLabel').text(((data.main.temp)-273.15).toFixed(0) + "°C");
// //             console.log(data)
// //         });
// // }

// // fetchWeather();

// // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={API key}