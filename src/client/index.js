//IMPORT STYLE
import './styles/style.scss'

//IMPORTING WEATHER ICONS
import './icons/a01d.png'
import './icons/a02d.png'
import './icons/a03d.png'
import './icons/a04d.png'
import './icons/a05d.png'
import './icons/a06d.png'
import './icons/c01d.png'
import './icons/c02d.png'
import './icons/c03d.png'
import './icons/c04d.png'
import './icons/d01d.png'
import './icons/d02d.png'
import './icons/d03d.png'
import './icons/f01d.png'
import './icons/r01d.png'
import './icons/r02d.png'
import './icons/r03d.png'
import './icons/r04d.png'
import './icons/r05d.png'
import './icons/r06d.png'
import './icons/s01d.png'
import './icons/s02d.png'
import './icons/s03d.png'
import './icons/s04d.png'
import './icons/s05d.png'
import './icons/s06d.png'
import './icons/t01d.png'
import './icons/t02d.png'
import './icons/t03d.png'
import './icons/t04d.png'
import './icons/t05d.png'
import './icons/u00d.png'


import {handleSubmit} from './js/indexUp';
import {formatDate} from './js/handleSub';



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate').addEventListener('click', handleSubmit);
});

export {
    handleSubmit,
    formatDate
}

// IIFE function used to restrict the departure dates a user can select starting 
// "today," or the day they use this app, to 15 days from today. This is to 
// work around the weatherbit 16 day, starting from the respective "today," forecast limit
//might remove?
/*
(function () {
    const d = new Date();
    const dateArrival = document.getElementById('date');

    let minDay = d.getDate();
    let minMonth = d.getMonth() + 1; 
    let minYear = d.getFullYear();

    d.setDate(d.getDate() + 15);
    // console.log(d);

    let maxDay = d.getDate();
    let maxMonth = d.getMonth() + 1;
    let maxYear = d.getFullYear();
    // console.log(d.getYear());
    // console.log(maxYear);

    let minDate = formatDate(minDay, minMonth, minYear);
    let maxDate = formatDate(maxDay, maxMonth, maxYear);
    // console.log(minDate, maxDate);

    dateDeparture.setAttribute('min', minDate);
    dateDeparture.setAttribute('max', maxDate);
    dateReturn.setAttribute('min', minDate);

    dateDeparture.value = minDate;
    dateReturn.value = maxDate;
})();*/