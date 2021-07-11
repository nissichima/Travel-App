
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import timeout from 'connect-timeout';
import queryService from './js/queryServ.js';

const serverTimeOut = '60s';

let projectData = {};

dotenv.config();

//API VARIABLES
const Geo_base = 'http://api.geonames.org/searchJSON'
const WB_base16 = 'https://api.weatherbit.io/v2.0/forecast/daily'
const WB_base = 'https://api.weatherbit.io/v2.0/current'
const PB_base = 'https://pixabay.com/api/'

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ 
    extended: false 
}));
app.use(bodyParser.json());
app.use(express.static('dist'));
app.use(timeout(serverTimeOut));

const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
});

// Proccessing input and querying API'S
const processUserInput = async (req, res) => {
  console.log(`daysUntilTrip: ${req.body.daysUntilTrip}`);
  // Format date
  const dateFormatted = new Date(req.body.date).toISOString().slice(0, -14);
  projectData = {
    city: req.body.city,
    countryCode: req.body.countryCode,
    date: dateFormatted,
    preferredLanguage: req.body.preferredLanguage,
    daysUntilTrip: req.body.daysUntilTrip,
  };
  await queryServ.getGeoData(
    process.env.GEONAMES_USER,
    projectData.city,
    projectData.countryCode,
    projectData.date,
    projectData.daysUntilTrip,
  )
    .catch()
    .then((response) => queryServ.queryWeatherbit(process.env.WEATHERBIT_API_KEY, response))
    .catch()
    .then((response) => queryServ.queryDbPedia('cityInfo', response))
    .catch()
    .then((response) => queryServ.queryPixabay(process.env.PIXABAY_API_KEY, response))
    .catch()
    .then((response) => queryServ.downloadFile(response))
    .catch()
    .then((response) => res.send(response))
    .catch((error) => {
      console.error('the following error occured: ', error.message);
      if (error.message === "Cannot read property 'daysUntilTrip' of null") {
        return res.send({
          error: 'City was not found.',
        });
      } return res.send({
        error: 'There was an internal server error.',
      });
    });
};
app.post('/api/postUserSelection', processUserInput);
  
  // makes all API requests
  app.post('/getCityInfo', async (req,res) => {

    const {city, date} = req.body

    // getting date info
    const {daysAway, today} = dateHandler(date)
    
    // console.log(`Today = ${today}`)
    // console.log(`daysAway = ${daysAway}`)

    // use city to fetch GeoName info
    const response = await fetch(`${Geo_base}?q=${city}&maxRows=1&username=${process.env.GEONAMES_USER}`)
    const response1 = await response.json()
    
    // console.log(response1)

    if(response1.totalResultsCount == 0) {
        const name = 'invalid'
        res.send({name})
        return
    }
  
   // image fetching
    const response8 = await fetch(`${PB_base}?key=${process.env.PIXABAY_API_KEY}&q=${name}`)
    const response9 = await response8.json()

   // if city is found, display it. other wise display the country
    if(response9.total != 0){
        var {webformatURL} = response9.hits[0]    
        console.log("dislapying the city")
    }else {
        const response10 = await fetch(`${PB_base}?key=${process.env.PIXABAY_API_KEY}&q=${countryName}`)
        const response11 = await response10.json()
        // console.log(response11)
        var {webformatURL} = response11.hits[0]    
        console.log("displaying country")
    }
    })







