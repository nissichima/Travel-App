
import datepicker from 'js-datepicker';

import {
  updateUI,  showErrorMessage, removeErrorMessage,
} from './indexUp';

const queryLocalServer = (path) => {
    const localhost = `http://localhost:${8081}`;
    return new URL(path, localhost);
  return null;
};

const getToday = () => new Date();

const getDaysUntilTrip = (date) => {
  const tripDate = new Date(date).getTime();
  return (Math.floor(((tripDate - getToday().getTime()) / (1000 * 60 * 60 * 24)) + 1));
};

const getInput = async () => {
  const userInput = {
    city: document.getElementById('zip').value,
    countryCode: selectedCountryCode,
    date: document.getElementById('date').value,
    daysUntilTrip: getDaysUntilTrip(document.getElementById('date').value),
  };
  return userInput;
};

// input sent to server
const postUserSelection = async (object = {}) => {
  const settings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(object),
  };
  try {
    const fetchResponse = await fetch(queryLocalServer('/api/postUserSelection'), settings);
    const data = await fetchResponse.json();
    console.log('data received');
    return data;
  } catch (error) {
    console.error('the following error occured: ', error.message);
    return error;
  }
};


// When the page is loaded the content gets updated.
window.addEventListener('load', () => {
  /*
    Datepicker is added. When the page is loaded the current date is set in
    the date input field. Via minDate: getToday() it is prevented for the
    user to select a date in the past.
  */
  const tripDate = datepicker('#date', {
    minDate: getToday(),
    dateSelected: getToday(),
    position: 'tl',
  });

  // Heading is added.
  document.getElementById('main-heading-contents').innerHTML = 'City Guides';

  // Home link to logo is set.
  document.getElementById('home-link').setAttribute('href', queryLocalServer('/'));

  // The overview tab is hidden.
  document.getElementById('nav-item-overview').classList.add('d-none');

 
});

export { getDaysUntilTrip };
export { postUserSelection };