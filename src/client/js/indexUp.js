//Change code

//WEATHER ICONS!!
import {    convertTimeUnits, splitDate, formatLanguages } from './handleSub';

// Trip Planner - User Entry Point
const resultID = document.getElementById('result-data');

const daysOut = document.getElementById('days-out');

const entryForm = document.getElementById('plan-create');

// Info Message
const msgInfo = document.getElementById('msg');

// Error Message
const errorInfo = document.getElementById('error');

// Location Results Selectors
const cityResult = document.getElementById('city');
const countryResult = document.getElementById('country');


// Weather Selectors
const highTemp = document.getElementById('high-temp');
const lowTemp = document.getElementById('low-temp');
const humidity = document.getElementById('humidity');
const precipProb = document.getElementById('precipitation');
const weatherDesc = document.getElementById('weather-desc');
const weatherIconRef = document.getElementById('weather-icon');

// Pixabay Image selectors
const image1 = document.getElementById('pixabay1');

async function handleSubmit(event) {
    event.preventDefault();
    msgInfo.style.display = 'block';
    msgInfo.innerHTML = "Loading...";
    errorInfo.style.display = 'none';
    errorInfo.innerHTML = "";
    resultID.style.display = 'none';
    
    // Selectors defined to obtain user input data
    let location = document.getElementById('zip').value;
    let start = document.getElementById('date').value;
    // Variables to initiate date instances for calculations
    const today = new Date();
    const arrivalDate = new Date(start);

    const travelTime = arrivalDate.getTime();
    const daysInTravel = convertTimeUnits(travelTime);
    // Calculates days from today until trip
    const timeUntilTrip = arrivalDate.getTime() - today;
    const daysUntilTrip = convertTimeUnits(timeUntilTrip) + 1;
    console.log(daysUntilTrip);




    if(daysInTravel > 0)
    {
      await postTrip('http://localhost:8081/addTrip', { 
        Location: location, 
        Start : arrivalDate,
        DaysToGo: daysUntilTrip
      });

      await fetchLocal(`http://localhost:8081/getGeonames`);
      
      await fetchLocal(`http://localhost:8081/getCityImage`);

      await fetchLocal(`http://localhost:8081/getCountryImage`);

      await fetchLocal(`http://localhost:8081/getWeather`);  


      const trip = await fetchLocal(`http://localhost:8081/getTrip`);

      console.log('###############');
      console.log(trip);
      console.log('###############');
      updateUI(trip);

  }else{
    //alert('Please enter a valid trip duration!
    msgInfo.style.display = 'none';
    msgInfo.innerHTML = "";
    errorInfo.style.display = 'block';
    errorInfo.innerHTML ="Entries must start today or in the future and end at least one day after.";

  }

}

  async function postTrip(url, trip){
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trip)
    });
    console.log(response.status);
}

const fetchLocal = async(url) => {
  const asyncParams = {
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
  };

    const res = await fetch(url, asyncParams);
      try{
        const data = await res.json();
        return data;
      } 
      catch {
        console.log(`Error: ${res.statusText}`)
      }
}

// UI Functions
const updateUI = async (results) => {
  resultID.style.display = 'block';

  // Update Trip Date Info Section
  daysOut.innerHTML = results.daysToTrip;

  //Update City Info Section
  cityResult.innerHTML = results.name;
  countryResult.innerHTML = results.countryName;

  //Update Weather Info Section
  highTemp.innerHTML = results.maxTemp;
  lowTemp.innerHTML = results.minTemp;
  humidity.innerHTML = results.humidity;
  precipProb.innerHTML = results.precipProb;
  weatherDesc.innerHTML = results.weatherDesc;
  let weatherIconCall = `${results.weatherIcon}.png`;
  weatherIconRef.setAttribute('src', weatherIconCall);

  //Update Images
  if(results.cityArray === undefined || results.cityArray.length < 3){
    image1.setAttribute('src', results.countryArray[0]);    
  } else {
    image1.setAttribute('src', results.cityArray[0]);    
  }

  msgInfo.style.display = 'none';
  errorInfo.style.display = 'none';
  msgInfo.innerHTML = "";
  
}


export { handleSubmit}