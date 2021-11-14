
//--------------------------Selectors--------------------------------//
var citySearchFormEl = $("#citySearch");
var searchInputEl = $("#searchInput");
var recentSearchListEL = $("#recentSearches");
var currentWeatherCardEl = $("#currentWeatherCard");


//--------------------------Globals--------------------------------//
var searchHistory = [];
const weatherKey = 'a8f0f5f5b1d6bdc3df4466ae6e70fc65';
var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?'; //example https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=key
const locationKey = 'AIzaSyBzDZ9FZrywEiWntD5JFfjbqrnEKXOENiM';
let locationBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?"; //examples https://maps.googleapis.com/maps/api/geocode/json?address=Mountain+View,+CA&key=key
let forcastData;


//--------------------------Functions--------------------------------//


//gets weather data
const generateWeather = async (location) => {
    const locationData = await fetch(locationBaseUrl + `address=${location},+CA&key=${locationKey}`).then(response => response.json());
    geoLocation = locationData.results[0].geometry.location;

    forcastData = await fetch(weatherApiUrl + `lat=${geoLocation.lat}&lon=${geoLocation.lng}&exclude={part}&appid=${weatherKey}`).then(response => response.json());
    console.log(forcastData);
}

//loads current weather data 
function loadCurrentWeather ()
{
    const city = JSON.parse(localStorage.getItem("searchHistory"));
    console.log(city);
    currentWeatherCardEl.empty();
    currentWeatherCardEl.append(                        `<div>
                            <h1>${city[city.length - 1].toUpperCase()}</h1>
                            <p>temp: ${forcastData.current.temp}</p>
                            <p>Wind: ${forcastData.current.wind_speed}</p>
                            <p>Humidity: ${forcastData.current.humidity}</p>
                            <p>UV Index: ${forcastData.current.uvi}</p>
                        </div>`);
}


//store Search history
function storeSearch()
{
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

}



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

//--------------------------Event Listeners--------------------------------//

//event listeners
citySearchFormEl.submit(async (event)=>{
    event.preventDefault();
    
    storeSearch();
    loadSearchHistory();
    await generateWeather(searchInputEl.val());
    loadCurrentWeather();

});


//--------------------------Main--------------------------------//