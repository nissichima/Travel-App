//Change code

//WEATHER ICONS!!
const weatherIcons = {
  201: 'wi-thunderstorm',
  202: 'wi-thunderstorm',
  230: 'wi-storm-showers',
  231: 'wi-storm-showers',
  232: 'wi-storm-showers',
  233: 'wi-thunderstorm',
  300: 'wi-sprinkle',
  301: 'wi-sprinkle',
  302: 'wi-sprinkle',
  500: 'wi-showers',
  501: 'wi-showers',
  502: 'wi-showers',
  511: 'wi-showers',
  520: 'wi-rain',
  521: 'wi-rain',
  522: 'wi-rain',
  600: 'wi-snow',
  601: 'wi-snow',
  602: 'wi-snow',
  610: 'wi-rain-mix',
  611: 'wi-sleet',
  612: 'wi-sleet',
  621: 'wi-snow',
  622: 'wi-snow',
  623: 'wi-rain',
  700: 'wi-fog',
  711: 'wi-smoke',
  721: 'wi-smog',
  731: 'wi-dust',
  741: 'wi-fog',
  751: 'wi-fog',
  800: 'wi-day-sunny',
  801: 'wi-day-cloudy',
  802: 'wi-day-cloudy',
  803: 'wi-day-cloudy',
  804: 'wi-cloudy',
  900: 'wi-na',
};

// The error message is shown by removing the CSS class "d-none".
const showErrorMessage = (error) => {
  document.getElementById('error').classList.remove('d-none');
  document.getElementById('error-message').innerHTML = `Error: ${error}`;
};

// The error message is hidden via the CSS class "d-none".
const removeErrorMessage = () => {
  document.getElementById('error').classList.add('d-none');
};

const resetView = (elementId) => {
  const resultList = document.getElementById(elementId);
  while (resultList.firstChild) {
    resultList.removeChild(resultList.lastChild);
  }
};

const updateUI = async (object = {}) => {
  // Displaying the days until the trip starts.
  const showDaysUntilTripMessage = () => {
    if (object.daysUntilTrip === 0) {
      return 'Your trip is today. Better start packing.';
    }
    if (object.daysUntilTrip === 1) {
      return 'Your trip is tomorrow.';
    }
    if (object.daysUntilTrip >= 2) {
      return `Your trip is in ${object.daysUntilTrip} days.`;
    }
    return null;
  };
  document.getElementById('trip-departure').innerHTML = showDaysUntilTripMessage();

  const showWeatherData = () => {
    if (object.daysUntilTrip < 16) {
      resetView('weather-forecast');
      for (let i = object.daysUntilTrip; i < 16; i += 1) {
        const weatherList = document.getElementById('weather-forecast');
        const date = new Date(object.forecastDays[i].date);
        const weatherInfo = `
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-3 mb-sm-1">${date.toDateString()}</div>
          <div class="col-md-1 mb-sm-1"><i class="wi ${weatherIcons[`${object.forecastDays[i].code}`]}"></i></div>
          <div class="col-md-3 mb-sm-1">${object.forecastDays[i].temp_min} °C</i> / ${object.forecastDays[i].temp_max} °C</div>
          <div class="col-md-2 mb-sm-1"><i class="wi wi-raindrop"></i> ${object.forecastDays[i].pop}%</div>
          <div class="col-md-3 mb-sm-1">${object.forecastDays[i].description}</div>
        </div>
      </li>`;
        weatherList.insertAdjacentHTML('beforeend', weatherInfo);
      }
    } else {
      // If there is no weather forecast, historical weather data is shown.
      resetView('weather-forecast');
      const weatherList = document.getElementById('weather-forecast');
      const date = new Date(object.date);
      const weatherInfo = `
      <li class="list-group-item">
        <div class="row">
          There is no weather forecast for ${date.toDateString()} since your travel day is too far in the future. Historical weather data shows that in ${object.city} in this day of the month the minimum temperature is ${object.forecastMonth.min_temp} °C, the maximum temperature is ${object.forecastMonth.max_temp} °C and the average temperature is ${object.forecastMonth.avg_temp} °C.
        </div>
      </li>`;
      weatherList.insertAdjacentHTML('beforeend', weatherInfo);
    }
  };
  showWeatherData();


//MIGHT REMOVE
  // If an abstract is present, i.e. facts about a city, it gets displayed.
  if (object.abstract) {
    const locationOverview = document.getElementById('locationOverview');
    if (locationOverview) {
      locationOverview.parentNode.removeChild(locationOverview);
    }

    // The locationOverview card is created to present the retrieved data.
    const accordionTripOverview = document.getElementById('accordionTripOverview');
    const accordionTripOverviewContent = `
    <div class="card" id="locationOverview">
      <div id="headingLocationOverview" class="card-header bg-white">
        <h2 class="mb-0 font-weight-bold h"><a href="#" data-toggle="collapse"
            data-target="#collapseLocationOverview" aria-expanded="false"
            aria-controls="collapseLocationOverview"
            class="d-block position-relative collapsed text-dark collapsible-link py-2 h5"
            id="accordion-heading-city"></a></h2>
      </div>
      <div id="collapseLocationOverview" aria-labelledby="headingLocationOverview" class="collapse">
        <div class="card-body">
          <div class="alert alert-primary float-md-left col-md-6 mr-md-3 col-lg-4" role="alert">
            <dl class="row mb-0" id="tab-item-facts" />
          </div>
          <p id="overview-content" class="mb-0" />
        </div>
      </div>
    </div>`;

    // Adding the heading.
    accordionTripOverview.insertAdjacentHTML('beforeend', accordionTripOverviewContent);
    document.getElementById('accordion-heading-city').innerHTML = `About ${object.city}`;

    const overviewContent = document.getElementById('overview-content');
    for (let i = 0; i < object.abstractParsed.length; i += 1) {
      overviewContent.insertAdjacentHTML('beforeend', `<span>${object.abstractParsed[i].text} </span>`);
    }

    // The data of the overview tab gets inserted. Previously loaded data is removed.
    resetView('tab-item-facts');
    document.getElementById('tab-item-facts').insertAdjacentHTML('beforeend', '<dt class="col-sm-4 col-lg-6">Country</dt>');
    document.getElementById('tab-item-facts').insertAdjacentHTML('beforeend', `<dd class="col-sm-8 col-lg-6">${object.countryName}</dd>`);

    /*
      Additional facts displayed in a info box.
    */
    if (object.area) {
      document.getElementById('tab-item-facts').insertAdjacentHTML('beforeend', '<dt class="col-sm-4 col-lg-6">City\'s area</dt>');
      document.getElementById('tab-item-facts').insertAdjacentHTML('beforeend', `<dd class="col-sm-8 col-lg-6">${parseInt((object.area / 1000000), 10).toLocaleString('en-US')} km<sup>2<sup></dd>`);
    }
    if (object.population) {
      document.getElementById('tab-item-facts').insertAdjacentHTML('beforeend', '<dt class="col-sm-4 col-lg-6">Population</dt>');
      document.getElementById('tab-item-facts').insertAdjacentHTML('beforeend', `<dd class="col-sm-8 col-lg-6">${parseInt(object.population, 10).toLocaleString('en-US')}</dd>`);
    }
  } else {
    /*
      If there is no abstract, the accordion element and its children are removed.
      Solution adapted from Catalin Rosu (https://catalin.red/removing-an-element-with-plain-javascript-remove-method/).
    */
    const locationOverview = document.getElementById('locationOverview');
    if (locationOverview) {
      locationOverview.parentNode.removeChild(locationOverview);
    }
  }


  // The retrieved object is shown in the console.
  console.log(object);
};

//MIGHT REMOVE

export { resetView };
export { updateUI };
export { showErrorMessage };
export { removeErrorMessage };