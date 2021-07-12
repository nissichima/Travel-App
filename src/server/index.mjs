
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import timeout from 'connect-timeout';
import response from 'express';

//const serverTimeOut = '60s';

dotenv.config();
const api_key = process.env.API_KEY;

//API VARIABLES
const Geo_base = 'http://api.geonames.org/searchJSON'
const restCount_base = 'https://restcountries.eu/rest/v2/alpha/'
const WB_base16 = 'https://api.weatherbit.io/v2.0/forecast/daily'
const WB_base = 'https://api.weatherbit.io/v2.0/current'
const PB_base = 'https://pixabay.com/api/'

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ 
    extended: false 
}));
app.use(bodyParser.json());

//app.use(timeout(serverTimeOut));

const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});


app.use(express.static('dist'));
app.get('/', (req, res) => res.sendFile(path.resolve('dist/index.html')));

app.post('/destination', async (req, res) => {
    const weatherKey = process.env.WEATHERBIT_API_KEY;
    const geoKey = process.env.GEONAMES_USER;
    const pixabayKey = process.env.PIXABAY_API_KEY; 

    const city = req.body.city;
    let data = {};
    
    const geoBase = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${geoKey}`;

    await fetch(geoBase)
    .then(response => response.json())
    .then(response => {
        const { lat, lng, toponymName, countryName } = response.geonames[0];
        data = {
            city: toponymName,
            countryName,
            lat,
            lng
        }
    })
    .catch(error => console.log('error', error));

    const currentWeatherBase = `https://api.weatherbit.io/v2.0/current?lat=${data.lat}&lon=${data.lng}&key=${weatherKey}`;

    await fetch(currentWeatherBase)
    .then(response => response.json())
    .then(response => {
        data = {
            ...data,
            curentWeather: response.data[0]
        }
    })
    .catch(error => console.log('error', error));

    const forecastWeatherBase = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${data.lat}&lon=${data.lng}&key=${weatherKey}`;

    await fetch(forecastWeatherBase)
    .then(response => response.json())
    .then(response => {
        data = {
            ...data,
            forecastWeather: response.data
        }
    })
    .catch(error => console.log('error', error));
    
    const pixabayQueryCity  = `&q=${data.city}&orientation=horizontal&image_type=photo`;
    const pixabayQueryCountry  = `&q=${data.countryName}&orientation=horizontal&image_type=photo`;
    let pixabayBase = `https://pixabay.com/api/?key=${pixabayKey}${pixabayQueryCity}`;
    let imageURL = '';

    await fetch(pixabayBase)
    .then(response => response.json())
    .then(response => {
        imageURL = response.hits[0].webformatURL;
    })
    .catch(error => console.log('error', error));

    if(imageURL === '') {
        let pixabayBase = `https://pixabay.com/api/?key=${pixabayKey}${pixabayQueryCountry}`;
        await fetch(pixabayBase)
        .then(response => response.json())
        .then(response => {
            imageURL = response.hits[0].webformatURL;
        })
        .catch(error => console.log('error', error));
    }

    data = {
        ...data,
        imageURL
    }

    res.send(data);
});

app.get('/background', (req, res) => {
    const key = process.env.PIXABAY_KEY;
    const query = '&q=city&orientation=horizontal&image_type=photo';
    const url = `https://pixabay.com/api/?key=${key}${query}`;
    const options = { 
        method: 'POST' 
    }
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        const randomImage = Math.floor(Math.random() * 20);
        const image = data.hits[randomImage];
        if(image !== undefined || image !== '') {
            res.send({url:image.largeImageURL});
        }
    })
    .catch(error => console.log('error', error));
});






