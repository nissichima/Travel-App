
// Function to create a date string "yyyy-mm-dd"
const formatDate = (day, month, year) => {

    day = day.toString();
    month = month.toString();
    year = year.toString();

    if(day.length === 1){
        day = `0${day}`;
    }
    if(month.length === 1){
        month = `0${month}`;
    }

    return `${year}-${month}-${day}`
}

// Converts time from miliseconds to days
const convertTimeUnits = (timeInMilliseconds) => {
    let timeInDays = timeInMilliseconds/(1000 * 60 * 60 * 24);
    return Math.ceil(timeInDays);
  }
  
// Splits the date (yyyy-mm-dd) from the time separated by "T"
const splitDate = (dateAPI) => {
    let newDate = dateAPI.split('T')
    return newDate[0];
}

export {
    formatDate, convertTimeUnits, splitDate
}