import './styles/style.scss'


import 'bootstrap';

import {
  showSpinner, removeSpinner, resetView,
} from './js/indexUp';


import {
  inputCountry, submitByKeypress, submitInfo,
} from './js/handleSub';


// Search event listener
document.getElementById('generate').addEventListener('click', submitInfo);

// confirm input
document.getElementById('city').addEventListener('keypress', submitByKeypress);

export {
  inputCountry,
  submitInfo,
  submitByKeypress,
  showSpinner,
  removeSpinner,
  resetView,
};