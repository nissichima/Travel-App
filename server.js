// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
// Include packages in server.js
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server that will allow app to run locally in browser
const port = 7778;
const server = app.listen(port, listening);
//debug function
function listening(){
     console.log("server running"); 
     console.log(`running on localhost: {$port}`);
}

//GET route that returns the projectData object


app.get('/all', function (req, res) {
  res.send(projectData);
})

//POST route adds temperature, date, user response incoming data to projectData

app.post('/addData', addData);
function addData(request, response) {
    const newWeatherJournal = {
        temperature: request.body.temperature,
        date: request.body.date,
        userResponse: request.body.userResponse
    };
    projectData=newWeatherJournal;
}


 /* solution: The problem is that these properties are not defined in Express module
 *           - they are added dynamically in runtime.
 *           Install express typings (@types/express)
 *           hit Alt+Enter on "express" in require('express'),
 *           choose Install Typescript definitions for better type information.!
 */

