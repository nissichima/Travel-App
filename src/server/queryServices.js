//CHANGE CODE

// Node fetch is required to query the external API via fetch()
const fetch = require('node-fetch');

// NLP library to process info texts
const nlp = require('compromise');
nlp.extend(require('compromise-sentences'));

// Modules required for image download
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Module to send queries to SPARQL endpoints, used to query DBpedia
const { SparqlEndpointFetcher } = require('fetch-sparql-endpoint');

// An empty JS object acts as a container for the retrieved data.
let locationInfo = {
};

/*
  DBpedia is queried for additional information. DBpedia provides a SPARQL endpoint
  which is queried with the help of the fetch-sparql-endpoint library. The article of
  a city is tried to retrieve via the latitude and longitude values that are provided
  by the Geonames API. The coordinates get adjusted since they do not match exactly
  the values in DBpedia. Therefore a range is set via various FILTER settings in the
  SPARQL query.
*/
exports.queryDbPedia = async (type, object = {}) => {
  const { longitude } = object;
  const { latitude } = object;
  const { city } = object;
  const fetcher = new SparqlEndpointFetcher();
  const longLess = parseFloat(longitude) - 0.25;
  const longMore = parseFloat(longitude) + 0.25;
  const latLess = parseFloat(latitude) - 0.25;
  const latMore = parseFloat(latitude) + 0.25;
  let sparqlQuery;

  if (type === 'cityInfo') {
    sparqlQuery = `
      PREFIX : <http://dbpedia.org/resource/>
      SELECT DISTINCT ?place ?abstract ?area ?population ?comment
      WHERE {
        VALUES ?cityType { schema:City wikidata:Q486972 dbo:City } 
        ?place geo:lat ?lat .
        ?place geo:long ?long .
        ?place rdf:type ?cityType .
        ?place rdfs:label ?label .
        ?place dbo:abstract ?abstract .
        OPTIONAL {?place dbo:areaTotal ?area}
        OPTIONAL {?place dbo:populationTotal ?population}
        FILTER (?lat <= "${latMore}"^^xsd:float)
        FILTER (?lat >= "${latLess}"^^xsd:float)
        FILTER (?long <= "${longMore}"^^xsd:float)
        FILTER (?long >= "${longLess}"^^xsd:float)
        FILTER (lang(?abstract) = 'en' and lang(?label) = 'en')
        FILTER STRSTARTS(?label,"${city}")
      } ORDER BY DESC(?population) LIMIT 1`;
  }
  console.log(sparqlQuery);
  try {
    const data = await fetcher.fetchBindings('https://dbpedia.org/sparql', sparqlQuery);
    data.on('data', (bindings) => {
      locationInfo.abstract = bindings.abstract.value;
      /*
        NLP processing is carried out to separate the sentences of the abstract.
        This way CSS styling can be carried out via the client.
      */
      locationInfo.abstractParsed = nlp(bindings.abstract.value).sentences().data();
      if (bindings.area) {
        locationInfo.area = bindings.area.value;
      }
      if (bindings.population) {
        locationInfo.population = bindings.population.value;
      }
    });
    return locationInfo;
  } catch (error) {
    console.error('the following error occured: ', error.message);
  }
  return null;
};

/*
  Pixabay is queried two times: firstly for getting a home page image, and secondly if the
  user searches for a city. Therefore the queried URLs vary.
*/
exports.queryPixabay = async (apiKey, object = {}) => {
  console.log(`object.city ${object.city}`);
  console.log(`object.countryName: ${object.countryName}`);
  let uri;

  // General query with one key/value from passed object
  uri = `https://pixabay.com/api/?key=${apiKey}&q=${object[Object.keys(object)[0]]}&image_type=photo&orientation=horizontal&per_page=200`;

  // City specific query
  if (object.city && object.countryName) {
    uri = `https://pixabay.com/api/?key=${apiKey}&q=${object.city}+${object.countryName}&image_type=photo&orientation=horizontal&per_page=200`;
  }

  let res = await fetch(encodeURI(uri));
  console.log(`get image from Pixabay API: ${encodeURI(uri)}`);

  /*
    The following function to get a random number from an interval is adapted from
    Francisc and jonschlinkert
    (https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript).
  */
  const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  try {
    // If the API sends OK, text information is returned.
    if (res.ok) {
      let response = await res.json();

      /*
        If no image is found for the city and country, a search only for
        the country is carried out.
      */
      if (object.city && object.countryName && response.totalHits === 0) {
        uri = `https://pixabay.com/api/?key=${apiKey}&q=${object.countryName}+flag&image_type=photo&orientation=horizontal&per_page=200`;
        console.log(`get country info from Pixabay API: ${encodeURI(uri)}`);
        res = await fetch(encodeURI(uri));
        response = await res.json();
      }

      const pixabayImages = response.hits;

      // Getting a random number
      const randomIndexNumber = randomIntFromInterval(0, 200);

      /*
        Getting the image with the most favorites (city and country search). The solution to find
        the image in the response object is adapted from senocular
        (https://www.reddit.com/r/javascript/comments/7xhjg9/es6_find_the_maximum_number_of_an_array_of_objects/).
        Otherwise a random image is selected.
      */
      const selectImage = () => {
        if (object.city && object.countryName) {
          return (pixabayImages.reduce(
            (max, image) => (max && max.favorites > image.favorites ? max : image), null,
          ));
        }
        return pixabayImages[randomIndexNumber];
      };

      locationInfo.imageId = selectImage().id;
      locationInfo.largeImageURL = selectImage().largeImageURL;
      console.log(`queryPixabay imageId: ${locationInfo.imageId}`);
      return locationInfo;
    }
    if (!res.ok) {
      // Fallback image is set, if Pixabay request is not successful.
      locationInfo.imageId = 'smart-vagabond-background-default';
      // Path is set since downloadFile() needs one.
      if (process.env.NODE_ENV === 'development') {
        locationInfo.largeImageURL = `http://localhost:${process.env.PORT_DEV_FRONTEND}/dist/cache/smart-vagabond-background-default.jpg`;
      }
      if (process.env.NODE_ENV === 'production') {
        locationInfo.largeImageURL = `http://localhost:${process.env.PORT_PROD}/cache/smart-vagabond-background-default.jpg`;
      }
      return locationInfo;
    }
  } catch (error) {
    console.error('the following error occured: ', error.message);
  }
  return null;
};

/*
  Hotlinking of Pixabay images is not allowed. Therefore the image is downloaded.
  The following solution was adapted by Senthil Muthuvel
  (https://gist.github.com/senthilmpro/072f5e69bdef4baffc8442c7e696f4eb)
*/
exports.downloadFile = async (object = {}) => {
  const uri = object.largeImageURL;
  const { imageId } = object;

  const dirPath = path.join(`${process.cwd()}/dist`, '/cache', `${imageId}.jpg`);

  // axios image download is started.
  const response = await axios.get(uri, {
    responseType: 'stream',
  });

  // The result stream is written into a file.
  response.data.pipe(fs.createWriteStream(dirPath));

  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve(locationInfo);
    });

    response.data.on('error', () => {
      reject(locationInfo);
    });
  });
};

// The Weatherbit API is queried.
exports.queryWeatherbit = async (apiKey, object = {}) => {
  let uri = '';

  if (object.daysUntilTrip <= 15) {
    // If the trip is within the next 16 days the forecast for the location is requested.
    uri = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${object.latitude}&lon=${object.longitude}&key=${apiKey}`;
  }

  if (object.daysUntilTrip > 15) {
    /*
      If the trip is later than 16 days the average weather data for the date is retrieved.
      The date is adjusted via slice() to match the API's requirements.
    */
    uri = `https://api.weatherbit.io/v2.0/normals?lat=${object.latitude}&lon=${object.longitude}&start_day=${object.date.slice(5)}&end_day=${object.date.slice(5)}&tp=monthly&key=${apiKey}`;
  }

  const res = await fetch(encodeURI(uri));
  console.log(`get Info from Weatherbit API: ${uri}`);
  try {
    // If the API sends OK, text information is returned.
    if (res.ok) {
      const response = await res.json();

      if (object.daysUntilTrip <= 15) {
      // The daily forecasts are iterated and appended to the dailyForecast object.
        const getDailyForecasts = () => {
          const dailyForecast = {};
          // eslint-disable-next-line no-restricted-syntax
          for (const [i, forecastInfo] of response.data.entries()) {
            dailyForecast[i] = {
              date: forecastInfo.valid_date,
              avg_temp: forecastInfo.temp,
              temp_min: forecastInfo.app_min_temp,
              temp_max: forecastInfo.app_max_temp,
              pop: forecastInfo.pop,
              uv: forecastInfo.uv,
              code: forecastInfo.weather.code,
              icon: forecastInfo.weather.icon,
              description: forecastInfo.weather.description,
            };
          }
          return dailyForecast;
        };

        // Adding the dailyForecast object to the locationInfo object.
        const getExtensiveForecast = () => {
          locationInfo.forecastDays = {};
          Object.assign(locationInfo, locationInfo.forecastDays);
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(getDailyForecasts())) {
            locationInfo.forecastDays[`${key}`] = value;
          }
          Object.assign(locationInfo, locationInfo.forecast);
        };
        getExtensiveForecast();
      }
      /*
        If the travel day is too far in the future historical weather data
        is added to the locationInfo object.
      */
      if (object.daysUntilTrip > 15) {
        locationInfo.forecastMonth = {};
        locationInfo.forecastMonth.month = response.data[0].month;
        locationInfo.forecastMonth.min_temp = response.data[0].min_temp;
        locationInfo.forecastMonth.max_temp = response.data[0].max_temp;
        locationInfo.forecastMonth.avg_temp = response.data[0].temp;
        Object.assign(locationInfo, locationInfo.forecastMonth);
        return locationInfo;
      }
    }
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      return errorData;
    }
  } catch (error) {
    console.error('the following error occured: ', error.message);
  }
  return locationInfo;
};

// The GeoNames API is called to get latitude and longitude values for a user submitted location.
exports.getGeoData = async (apiKey, location, countryCode, date, daysUntilTrip) => {
  console.log('GeoNames API is called');
  // The URL is composed.
  const uri = `http://api.geonames.org/search?name_equals=${location}&country=${countryCode}&username=${apiKey}&type=json`;
  // Spaces are replaced with dashes for the URI
  const res = await fetch(encodeURI(uri.replace(/\s+/g, '-')));
  console.log(`get Info from GeoNames API: ${uri}`);
  try {
    // If the API sends OK, text information is returned.
    if (res.ok) {
      const response = await res.json();
      /*
        An array of different locations is returned. The first location is the
        most suitable and therefore the needed data added to the locationInfo object.
      */
      locationInfo = {
        city: response.geonames[0].name,
        latitude: response.geonames[0].lat,
        longitude: response.geonames[0].lng,
        countryName: response.geonames[0].countryName,
        date,
        daysUntilTrip,
      };
      return locationInfo;
    }
  } catch (error) {
    console.error('the following error occured: ', error.message);
  }
  return null;
};