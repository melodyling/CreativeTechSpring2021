const button = document.getElementById("userclick");
const weatherSection = document.getElementById("weatherContainer");
const newsSection = document.getElementById("newsContainer");

const weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=Pasadena&APPID=af28a81c6270e46710d7deb15b8c992a&units=imperial";
const newsURL = "https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=Ud1GqPVZXUAFxAbZLzK9NhtWwU47a5wd";

button.addEventListener("click", fetchWeather);

function fetchWeather(){
  fetch(weatherURL).
    then((result) => {
      console.log("Result from Weather API: ");
      console.log(result);
      return result.json();
    }).
    then((data) => {
      console.log("JSON data from OpenWeatherMap: ");
      console.log(data);

      displayWeather(data);
      return data;
    }).
    then((data) => {
      fetchNews();
    }).catch((error) => {
      console.error(error);
    });
}

function displayWeather(data){
  while(weatherSection.firstChild){
    weatherSection.removeChild(weatherSection.firstChild);
  }

  const temperature = data.main.temp;

  const tempDisplay = document.createElement("p");
  tempDisplay.innerText = "It's " + temperature + "°";

  weatherSection.appendChild(tempDisplay);
}

function fetchNews(){
  fetch(newsURL).
    then((result) => {
      console.log("Result from NYTimes API: ");
      console.log(result);
      return result.json();
    }).
    then((data) => {
      console.log("JSON data from NYTimes: ");
      console.log(data);

      displayNews(data);

    }).catch((error) => {
      console.error(error);
    });
}

function displayNews(data){
  while(newsSection.firstChild){
    newsSection.removeChild(newsSection.firstChild);
  }

  let iftttURL = "https://maker.ifttt.com/trigger/trigger_ifttt/with/key/cADMniz7EZSShbcVJ6RD12";
  const newsLink = data.results[0].url;

  const newsDisplay = document.createElement("a");
  newsDisplay.href = newsLink;
  newsDisplay.innerText = "Here's what's happening in the world";
  newsDisplay.target = "_blank";

  newsSection.appendChild(newsDisplay);

  $.ajax({url: iftttURL + "?value1=" + newsLink, success: function(result){alert(result)}});
}
