# TRAVEL WEATHER APP

## Project Description

- develop an app which allows user to enter a city and date and update display UI with city, country and weather information for the appropriate date

### Project Requirements

- utilize [GeoNames.org](https://www.geonames.org/) API to fetch location data

- utilize [Pixabay.com](https://pixabay.com/) API to fetch images of city and country

- utilize [Weatherbit.io](https://www.weatherbit.io/) to fetch weather for certain dates

- use webpack for development and production builds

- use jest to test

- install and use service workers

### Weatherbit fetching options

- if user enters a date less than 7 days away, show immediate forecast

- if user enters a date less than 16 days away, show forecast for that date

- if user enters a date 16 days away or more, show forecast as unavailable

### Project Extensions

- utilized [restcountries.eu](https://restcountries.eu/) to fetch additional info about the country

- if picture of city is not found on pixabay, fetch and show picture of country instead

- utilize LocalStorage so that when the user closes the page, and then revisits the page, the info is still there

- allow user to remove the trip by pressing the reset button

### Starting Instructions

- git clone this repo

- run npm install

- obtain API keys for Weatherbit, Pixabay and GeoNames with your own accounts and place them in .env file matching api keys in server.js

- run npm run go

- go to [http://localhost:8081/](http://localhost:8081/)

## Screenshot of App
.../src/client/images/travel.png
