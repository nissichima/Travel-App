import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import timeout from 'connect-timeout';
import response from 'express';

const app = express();

export default
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// API FOR GEONAMES
const geoNamesUrl = 'http://api.geonames.org/searchJSON?q=';
const geoNamesUrlArgs = `&maxRows=1&username=${process.env.GEONAMES_USERNAME}`; 

// API FOR PIXABAY
const pixabayUrl = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=`; 
const pixabayUrlArgs = '&image_type=photo&order=popular';

// API FOR WEATHERBIT
const weatherBitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?'; 
const weatherBitUrl1 = `&key=${process.env.WEATHERBIT_API_KEY}`;
const weatherBitUrl2 = '&lang=en';


// DECLARING THE PORT
const port = 8081;
const server = app.listen(port, () => {
    const starter = new Date();
    console.log(`running on localhost: ${port}`);
});

// OBJECT TO STORE DATA
let data = {};

//HELP FUNCTION
const fixSpaces = (stringWithSpace) => {
  let regex = new RegExp(' ', 'g')
  let stringWithPlus = stringWithSpace.replace(regex, '+');
  return stringWithPlus;
}

//Added testing endpoint.
app.get('/test', async (req, res) => {
  res.json({message: 'YAY!'})
})

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.post('/addTrip', (req, res) => {
    console.log('Adding the trip...')
    let newTrip = req.body;
    let newEntry = {
      //GET LOCATION OF TRIP
      location: newTrip.Location,
      //GET ARRIVAL DATE OF TRIP
      arrivalDate: newTrip.Arrival,
      //GET DAYS UNTIL TRIP
      daysToTrip: newTrip.DaysToGo,
    }
    
    data = newEntry;
    res.send('tripAdded');
})


app.get('/getGeonames', (req, res) => {
  console.log('Adding geonames data...')
  const url = `${geoNamesUrl}${fixSpaces(data.location)}${geoNamesUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(res => res.json())
        .then(response =>{
          try {
            console.log('Data From GeoNames')
            console.log(response);
            data['long'] = response.geonames[0].lng;
            data['lat'] = response.geonames[0].lat;
            data['name'] =response.geonames[0].name; 
            data['adminName'] = response.geonames[0].adminName1;
            data['countryName'] = response.geonames[0].countryName;
            data['code'] = response.geonames[0].countryCode;
            data['population'] = response.geonames[0].population;
            res.send(true);
          } catch (e) {
            console.log("Error: ", e);
          }
    })
    .catch(error => {
      res.send(JSON.stringify({error: error}));
    })
})

app.get('/getWeather', (req, res) => {
  console.log('Adding weatherbit data...');
  const url = `${weatherBitUrl}lat=${data.lat}&lon=${data.long}${weatherBitUrl1}${weatherBitUrl2}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          let forecastDay = data.daysToTrip;
          const data = response.data[forecastDay]
          console.log(data)

          data.maxTemp = data.max_temp;
          data.minTemp = data.min_temp;
          data.humidity = data.rh;
          data.precipProb = data.pop; 
          data.weatherDesc = data.weather.description;
          data.weatherIcon = data.weather.icon;

          res.send(true)
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error occured"}));
    })
})

app.get('/getCityImage', (req, res) => {
  console.log('Adding pixabay city data...')
  const url = `${pixabayUrl}${fixSpaces(data.name)}+${fixSpaces(data.countryName)}${pixabayUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          const cityArray = [];
          const result1 = response.hits[0].webformatURL;
          const result2 = response.hits[1].webformatURL;
          const result3 = response.hits[2].webformatURL;

          cityArray.push(result1);
          cityArray.push(result2);
          cityArray.push(result3);
          data.cityArray = cityArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getCountryImage', (req, res) => {
  console.log('Adding pixabay country data...')
  const url = `${pixabayUrl}${fixSpaces(data.countryName)}${pixabayUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          const countryArray = [];
          const result1 = response.hits[0].webformatURL;
          const result2 = response.hits[1].webformatURL;
          const result3 = response.hits[2].webformatURL;
          countryArray.push(result1);
          countryArray.push(result2);
          countryArray.push(result3);
          data.countryArray = countryArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getTrip', (req, res) => {
    console.log(data);
    res.send(data);
})






