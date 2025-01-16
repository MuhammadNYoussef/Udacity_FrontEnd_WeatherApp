// Base website for the Open Weather site.
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='

// Personal API
const api = 'API_KEY'

// API Extensions - Metric for Celsius.
const apiKey = `&appid=${api}&units=metric`

// User input for ZIP Code.
const zipInput = document.getElementById('zip');
// User input for their Feelings.
const feelingsInput = document.getElementById('feelings');

// The Generate Button
const generate_button = document.getElementById('generate');

// Output data (Date + Temperature + Feelings)
const zip_Element = document.getElementById('zipcode');
const weatherDesc_Element = document.getElementById('weather_description');
const location_Element = document.getElementById('country');
const date_Element = document.getElementById('date');
const temperature_Element = document.getElementById('temp');
const feeling_Element = document.getElementById('content');


const error_Element = document.getElementById('error');


const catchError = (error) => console.error('[ERROR]: ', error);

// Retrieve the Weather Data from the API Call.
const get_info = async (url) => {
    const response = await fetch(url);
    try {
        const data = await response.json();
        console.log(`status: ${data.cod}`);

        if (data.cod != 200) {
            console.log("[ERROR]");
        }

        return data;
    } catch (error) {
        console.log(error);
    }
}

// Generate function
const generate = () => {
    const zip = zipInput.value;
    const feelings = feelingsInput.value;
    const url = baseUrl + zip + apiKey;

    // Change the date format to YYYY-MM-DD 
    let d = new Date();
    let newDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    // let newDate = d.getFullYear() + '/' + d.getMonth() + 1 + '/' + d.getDate();

    get_info(url)
        .then((data) => {
            if (data.cod != 200) {
                return alert("ERROR: " + data.message.toUpperCase())
            }

            // Get the temperature to the nearest 10th Decimal
            var tempValue = Math.round(parseFloat(data.main.temp) * 10) / 10;
            var locationValue = data.name;
            var descValue = data.weather[0].description;

            // Capitalize
            const finalDesc = descValue.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

            post_info('/data', { zip: zip, weather_description: finalDesc, country: locationValue, date: newDate, temp: tempValue, content: feelings })
            updateUI();
        });
}


// Post Data
const post_info = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    try {
        // Transform into JSON
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log('error', error);
    }
}


// Function to GET Project Data and update UI
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        // Transform into JSON
        const allData = await request.json()
        console.log(allData)

        // Output to DOM Elements
        temperature_Element.innerHTML = "</b>Temperature:</b> " + Math.round(allData.temp) + ' ℃';
        feeling_Element.innerHTML = "Feeling: " + allData.content;
        date_Element.innerHTML = "Date: " + allData.date.trim();
        zip_Element.innerHTML = "Location ZIP: " + allData.zip;
        location_Element.innerHTML = "Location Name: " + allData.country;
        weatherDesc_Element.innerHTML = "Weather: " + allData.weather_description;

    }
    catch (error) {
        catchError(error);
    }
}

// Event Listener for the Generate Button
generate_button.addEventListener('click', generate);
