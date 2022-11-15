// Setup empty JS object to act as endpoint for all routes
projectData = {};


// Express: Run the server and control the routes.
const express = require('express');

// Fire up an Instance of (APP).
const app = express();


/* Middleware*/
// Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());


const path = require('path');

// Initialize the main project folder
app.use(express.static(path.join(__dirname, '..')));


// Setup Server
const base_url = "http://localhost";
const port = 8080;

//spin up the server
const listening = () => {
    console.log('[STATUS] Server started...');
    console.log(`[STATUS] Website currently hosted on: ${base_url}:${port}/`);
};

const server = app.listen(port, listening);


// GET route
const sendData = (request, response) => {
    response.send(projectData);
};

app.get('/all', sendData);

// Post route
const addData = (request, response) => {
    console.log(request.body);
    projectData = request.body;
};

app.post('/data', addData);