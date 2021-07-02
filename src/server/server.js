const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const { response } = require('express')
const dotenv = require('dotenv').config()
const { dateHandler } = require('./dateHandler')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('dist'))

app.get('/', (req,res) => { 
    res.sendFile('dist/index.html')
    // res.send('dist/index.html')
})

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
// app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

//api
const Geo_base = 'http://api.geonames.org/searchJSON'
const WB_base = 'https://api.weatherbit.io/v2.0/current'
const restCount_base = 'https://restcountries.eu/rest/v2/alpha/'
const WB_base16 = 'https://api.weatherbit.io/v2.0/forecast/daily'
const PB_base = 'https://pixabay.com/api/'

// makes all API requests
app.post('/getCityInfo', async (req,res) => {

    const {city, date} = req.body

    // date info
    const {daysAway, today} = dateHandler(date)
    
    // console.log(`Today = ${today}`)
    // console.log(`daysAway = ${daysAway}`)

    // use city to fetch GeoName info
    const response = await fetch(`${Geo_base}?q=${city}&maxRows=1&username=${process.env.GeoN_KEY}`)
    const response1 = await response.json()
    
    // console.log(response1)

    if(response1.totalResultsCount == 0) {
        const name = 'invalid'
        res.send({name})
        return
    }
    
    const {lat, lng, name, countryName, countryCode} = response1.geonames[0]
    
    // console.log(name)
    // console.log(countryName)

    // get weather data for appropriate date
    if(daysAway < 7) {
        var WBresp1 = await fetch(`${WB_base}?&lat=${lat}&lon=${lng}&key=${process.env.WB_KEY}`)
        const WBresp2 = await WBresp1.json()
        // console.log(WBresp2)
        const {data} = WBresp2
        var {weather, rh, pres, temp, precip} = data[0]
        var {description} = weather
        var forecastDate = today

    }else if(daysAway < 16) {
        var WBresp1 = await fetch(`${WB_base16}?&lat=${lat}&lon=${lng}&key=${process.env.WB_KEY}`)
        const WBresp2 = await WBresp1.json()
        // console.log(WBresp2)
        const {data} = WBresp2
        var {weather, rh, pres, temp, precip, valid_date} = data[daysAway]
        var {description} = weather
        var forecastDate = valid_date
        // var forecastDate = date

    } else {
        var description = '<i class="fas fa-exclamation"></i>Date too far into the future, unable to predict weather forecast'
        var rh = 'N/A'
        var pres = 'N/A'
        var temp = 'N/A'
        var precip = 'N/A'
        var forecastDate = date
    }

    // console.log(`descriptiopn: ${description} /// precip: ${precip} /// rh: ${rh} /// pres: ${pres} /// temp: ${temp} /// forecastDate: ${forecastDate}`)
    
    // fetch PixaBay image of city and if hits = 0, then fetch country image
    const resp8 = await fetch(`${PB_base}?key=${process.env.PB_KEY}&q=${name}`)
    const resp9 = await resp8.json()
    // console.log(resp9)
    if(resp9.total != 0){
        var {webformatURL} = resp9.hits[0]    
        console.log("city found showing city")
    }else {
        const resp10 = await fetch(`${PB_base}?key=${process.env.PB_KEY}&q=${countryName}`)
        const resp11 = await resp10.json()
        // console.log(resp11)
        var {webformatURL} = resp11.hits[0]    
        console.log("city not found showing country")
    }

    // use countryCode to fetch info about Country from restCountries API 
    const RCresp = await fetch(`${restCount_base}${countryCode}`)
    const RCresp1 = await RCresp.json()

    // console.log(RCresp1)

    const capital = RCresp1.capital
    const currencies = RCresp1.currencies[0].name
    const currSymb = RCresp1.currencies[0].symbol
    const languages = RCresp1.languages[0].name
    const population = RCresp1.population
    const flag = RCresp1.flag

    // console.log(capital, currencies, currSymb, languages, population, flag)

    let backData = {rh, pres, temp, name, date, precip, description, webformatURL, forecastDate, countryName, 
        capital, currencies, currSymb, languages, population, flag}
    // console.log(webformatURL)
    res.send({rh, pres, temp, name, precip, description, webformatURL, forecastDate, countryName,
        capital, currencies, currSymb, languages, population, flag})

})


module.exports = {
    app
}