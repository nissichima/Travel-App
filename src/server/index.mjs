import path from 'path';
import express from 'express';
//import mockAPIResponse from './mockAPI.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

/*var path = require('path');
const express = require('express');
const mockAPIResponse = require('./mockAPI.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');*/

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