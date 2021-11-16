
//--------------------------Selectors--------------------------------//
var citySearchFormEl = $("#citySearch");
var searchInputEl = $("#searchInput");
var recentSearchListEL = $("#recentSearches");
var currentWeatherCardEl = $("#currentWeatherCard");
var forecastContainer = $("#forecastContainer");


//--------------------------Globals--------------------------------//
var searchHistory = [];
const weatherKey = 'a8f0f5f5b1d6bdc3df4466ae6e70fc65';
var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?'; //example https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=key
const locationKey = 'AIzaSyBzDZ9FZrywEiWntD5JFfjbqrnEKXOENiM';
let locationBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?"; //examples https://maps.googleapis.com/maps/api/geocode/json?address=Mountain+View,+CA&key=key
let forcastData;
const day = dayjs().format('MM/DD/YYYY');


//--------------------------Functions--------------------------------//


//gets weather data
const generateWeather = async (location) => {
    const locationData = await fetch(locationBaseUrl + `address=${location},+CA&key=${locationKey}`).then(response => response.json());
    geoLocation = locationData.results[0].geometry.location;

    forcastData = await fetch(weatherApiUrl + `lat=${geoLocation.lat}&lon=${geoLocation.lng}&exclude={part}&units=imperial&appid=${weatherKey}`).then(response => response.json());
    console.log(forcastData);
}

//loads current weather data 
function loadCurrentWeather ()
{
    const city = JSON.parse(localStorage.getItem("searchHistory"));
    console.log(city);
    currentWeatherCardEl.empty();

    if(forcastData.current.uvi > 6)
    {
        uVIndex = "severeUv";
    }else if(forcastData.current.uvi >= 3 && forcastData.current.uvi <= 6)
    {
        uVIndex = "moderateUv";
    }else
    {
        uVIndex = "favorableUv";
    }

    currentWeatherCardEl.append(`<div>
                                    <h1>${city[city.length - 1].toUpperCase()} (${day})<img src = "https://openweathermap.org/img/wn/${forcastData.current.weather[0].icon}.png"></h1>
                                    <p>Temp: ${forcastData.current.temp} &#8457;</p>
                                    <p>Wind: ${forcastData.current.wind_speed} MPH</p>
                                    <p>Humidity: ${forcastData.current.humidity} %</p>
                                    <p>UV Index: <span id = "${uVIndex}">${forcastData.current.uvi}</span></p>
                                </div>`);
}

function loadDailyForcast()
{
    const dailyWeather = forcastData.daily; 
    forecastContainer.empty();

    for(let i = 0; i < 5; i++)
    {
        console.log("test");
        forecastContainer.append(`<div class="card dailyCards" style="width: 18rem;">
                                    <div class="card-body">
                                    <h5>${dayjs().add(i+1, 'day').format('MM/DD/YYYY')}</h5>
                                    <img src = "https://openweathermap.org/img/wn/${dailyWeather[i].weather[0].icon}.png">
                                    <p>Temp: ${dailyWeather[i].temp.day} &#8457;</p>
                                    <p>Wind: ${dailyWeather[i].wind_speed} MPH</p>
                                    <p>Humidity: ${dailyWeather[i].humidity} %</p>
                                    </div>
                                </div>`);

    }
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
    loadDailyForcast();


});


//--------------------------Main--------------------------------//