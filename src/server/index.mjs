/*const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const async = require('express-async-errors')
const fetch = require('node-fetch')

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('./dist'));

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});


const trips = [];

app.get('/', (req, res) => {
  res.status(200).send('./dist/index.html');
});

app.post('/save', (req, res, next) => {
  if (req.body !== " ") {
    const trip = req.body.trip;
    trips.push(trip);
    res.status(201).send(trip);
  } else {
    res.status(400).json('Bad Request');
  }
});

app.post('/forecast', async (req, res, next) => {
  if (req.body.endpoint !== " ") {
    const endpoint = req.body.endpoint;
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const jsonRes = await response.json();
        res.status(201).send(jsonRes);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json('Bad Request');
  }
});

export { app };*/

import path from 'path';
import express from 'express';
import mockAPIResponse from './mockAPI.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
/*
var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
*/
dotenv.config();
const api_key = process.env.API_KEY;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ 
    extended: false 
}));
app.use(bodyParser.json());
app.use(express.static('dist'));

const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`);
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
});

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
});

app.post('/userText', async(req, res) => {
    console.log('req.body ===+>', req.body)
    const response = await fetch(`https://api.meaningcloud.com/sentiment-2.1?key=${api_key}&url=${req.body.formText}&lang=en`);
    try {
        const data = await response.json();
        console.log(data);
        res.send(data);
      }catch (error) {
      console.log("error", error);
      }
});