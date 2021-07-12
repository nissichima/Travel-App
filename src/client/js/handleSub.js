
//CHANGE CODE

import datepicker from 'js-datepicker';

import {
  updateUI,  showErrorMessage, removeErrorMessage,
} from './indexUp';

const getToday = () => new Date();

const getDaysUntilTrip = (date) => {
  const tripDate = new Date(date).getTime();
  return (Math.floor(((tripDate - getToday().getTime()) / (1000 * 60 * 60 * 24)) + 1));
};

const getInput = async () => {
  const userInput = {
    city: document.getElementById('city').value,
    countryCode: selectedCountryCode,
    date: document.getElementById('trip-date').value,
    daysUntilTrip: getDaysUntilTrip(document.getElementById('trip-date').value),
  };
  return userInput;
};

// The user input is sent to the server. On the server side the APIs are queried.
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

const submitInfo = (event) => {
  // If a result is already shown the view gets reset.
  const forms = document.getElementsByClassName('needs-validation');
  /*
    The following function validates user input and carries out feedback if the input
    is not valid. This function is adapted from the Bootstrap Starter code
    (https://getbootstrap.com/docs/4.6/components/forms/#validation).
  */
  Array.prototype.filter.call(forms, (form) => {
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (form.checkValidity() === true) {
      event.preventDefault();
      // The spinner is shown to feedback the loading process.
      removeErrorMessage();
      showSpinner();
      getInput()
        .then((response) => postUserSelection(response))
        .then(
          // After getting a response from the server the data is processed.
          (response) => {
            if (!response.error) {
              updateUI(response);
            }
            if (response.error) {
              console.log(response);
              removeSpinner();
              showErrorMessage(response.error);
            }
          },
        );
    }
    form.classList.add('was-validated');
  });
};

const submitByKeypress = (event) => {
  if (event.key === 'Enter') {
    submitInfo(event);
  }
};

// The selected country is read.
const inputCountry = () => {
  selectedCountryCode = document.getElementById('country').value;
  console.log(selectedCountryCode);
};

// When the page is loaded the content gets updated.
window.addEventListener('load', () => {
  /*
    Datepicker is added. When the page is loaded the current date is set in
    the date input field. Via minDate: getToday() it is prevented for the
    user to select a date in the past.
  */
  const tripDate = datepicker('#trip-date', {
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

  // The home page image is set: a random city image provided via Pixabay.

  const getHomePageImage = async () => {
    const res = await fetch(queryLocalServer('/api/getHomePageImage'));
    let image = {};
    try {
      image = await res.json();
      return image;
    } catch (error) {
      console.error('the following error occured: ', error.message);
      image.imageId = 'smart-vagabond-background-default';
      return image;
    }
  };
  getHomePageImage()
    .then((result) => {
      if (process.env.NODE_ENV === 'production') {
        document.getElementById('hero').style.backgroundImage = `url("./cache/${result.imageId}.jpg")`;
      }
      if (process.env.NODE_ENV === 'development') {
        document.getElementById('hero').style.backgroundImage = `url("./dist/cache/${result.imageId}.jpg")`;
      }
    });
});

export { inputCountry };
export { submitInfo };
export { submitByKeypress };
export { getDaysUntilTrip };
export { postUserSelection };