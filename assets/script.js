
//selectors
var citySearchFormEl = $("#citySearch");
var searchInputEl = $("#searchInput");
var recentSearchListEL = $("#recentSearches");


//globals
var searchHistory = [];
const weatherKey = 'a8f0f5f5b1d6bdc3df4466ae6e70fc65';
var weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=${weatherKey}`
const locationKey = 'AIzaSyBzDZ9FZrywEiWntD5JFfjbqrnEKXOENiM';
let locationApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Mountain+View,+CA&key=${locationKey}`;


//function definitions
function loadSearchHistory()
{
    //clears current list
    recentSearchListEL.empty();

    //gets search history from local storage
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log("Line 19 - Loading Search list: ", searchHistory);

    //loops through arr of search items
    searchHistory.forEach((item) => {
        //appends button child element to recent searches container
        recentSearchListEL.append(`<button type="submit" class="btn btn-primary recentSearchItem">${item}</button>`);
    })


}

//event listeners
citySearchFormEl.submit((event)=>{
    event.preventDefault();
    //gets the input val on submission. 
    var newSearch = searchInputEl.val();
    
    //checks for local storage item of search history
    if(!localStorage.getItem("searchHistory"))
    {
        //if null will instantiate search history in local storage
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }

    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    searchHistory.push(newSearch);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    loadSearchHistory();

});


//main



// site ref = https://weather-dashboard-uci.netlify.app/?

//current and forecast weather api
// https://openweathermap.org/api/one-call-api

//geocoding api
// https://openweathermap.org/api/geocoding-api

//api key
// a8f0f5f5b1d6bdc3df4466ae6e70fc65