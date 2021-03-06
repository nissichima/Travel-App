
//import express from 'express';
const express = require('express');

//import bodyParser from 'body-parser';
const bodyParser = require('body-parser')

//import cors from 'cors';
const cors = require('cors');

//import fetch from 'node-fetch';
const fetch = require('node-fetch');

//import {response} from 'express';
const { response } = require('express')

//import dotenv from 'dotenv';
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

//showing keys for submission purpose only
// API FOR GEONAMES
const geoNamesUrl = 'http://api.geonames.org/searchJSON?q=';
const geoNamesUrlArgs = `&maxRows=1&username=nissichima`; 
console.log(process.env.GEONAMES_USER)
// API FOR PIXABAY
const pixabayUrl = `https://pixabay.com/api/?key=22322600-9e065bdb9f8e40d627e3b9e8d&q=`; 
const pixabayUrlArgs = '&image_type=photo&order=popular';

// API FOR WEATHERBIT
const weatherBitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?'; 
const weatherBitUrl1 = `&key=6663294128a3483fb0a519f8fcda6f61`;
const weatherBitUrl2 = '&lang=en';


// DECLARING THE PORT
const port = 8081;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});
module.exports = app
// OBJECT TO STORE DATA
let weatherData = {};

//HELP FUNCTION
const fixSpaces = (stringWithSpace) => {
  let regex = new RegExp(' ', 'g')
   
  return stringWithSpace.replace(regex, '+');
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
    
    weatherData = newEntry;
    res.send('tripAdded');
})


app.get('/getGeonames', (req, res) => {
  console.log('Adding geonames data...')
  const url = `${geoNamesUrl}${fixSpaces(weatherData.location)}${geoNamesUrlArgs}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          try {
            console.log('Data From GeoNames')
            console.log(response);
            weatherData['long'] = response.geonames[0].lng;
            weatherData['lat'] = response.geonames[0].lat;
            weatherData['name'] =response.geonames[0].name; 
            weatherData['adminName'] = response.geonames[0].adminName1;
            weatherData['countryName'] = response.geonames[0].countryName;
            weatherData['code'] = response.geonames[0].countryCode;
            weatherData['population'] = response.geonames[0].population;
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
  const url = `${weatherBitUrl}lat=${weatherData.lat}&lon=${weatherData.long}${weatherBitUrl1}${weatherBitUrl2}`;
  console.log(url);
    fetch(url)
      .then(response => response.json())
        .then(response =>{
          let forecastDay = weatherData.daysToTrip;
          const data = response.data[forecastDay]
          console.log(data)

          weatherData.maxTemp = data.max_temp;
          weatherData.minTemp = data.min_temp;
          weatherData.humidity = data.rh;
          weatherData.precipProb = data.pop; 
          weatherData.weatherDesc = data.weather.description
          weatherData.weatherIcon = data.weather.icon

          res.send(true)
    })
    .catch(error => {
      res.send(JSON.stringify({error: "An error occured"}));
    })
})

app.get('/getCityImage', (req, res) => {
  console.log('Adding pixabay city data...')
  const url = `${pixabayUrl}${fixSpaces(weatherData.name)}+${fixSpaces(weatherData.countryName)}${pixabayUrlArgs}`;
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
          weatherData.cityArray = cityArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getCountryImage', (req, res) => {
  console.log('Adding pixabay country data...')
  const url = `${pixabayUrl}${fixSpaces(weatherData.countryName)}${pixabayUrlArgs}`;
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
          weatherData.countryArray = countryArray
          res.send(true);
        })
        .catch(error => {
          res.send(JSON.stringify({error: "An error has occured"}));
        })
})

app.get('/getTrip', (req, res) => {
    console.log(weatherData);
    res.send(weatherData);
})






