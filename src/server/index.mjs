import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import {response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

export default
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));
// API FOR GEONAMES
const geoNamesUrl = 'http://api.geonames.org/searchJSON?q=';
const geoNamesUrlArgs = `&maxRows=1&username=${process.env.GEONAMES_USER}`; 
console.log(process.env.GEONAMES_USER)
// API FOR PIXABAY
const pixabayUrl = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=`; 
const pixabayUrlArgs = '&image_type=photo&order=popular';

// API FOR WEATHERBIT
const weatherBitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?'; 
const weatherBitUrl1 = `&key=${process.env.WEATHERBIT_API_KEY}`;
const weatherBitUrl2 = '&lang=en';


// DECLARING THE PORT
const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});

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






