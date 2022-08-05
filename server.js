const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/app.html");
})

app.post("/", (req, res) => {
    const cityName = req.body.cityName;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=281d9ee32700c6777b6ec51710de3e8b&units=metric`;

    https.get(weatherUrl, (response) => {
        console.log(response.statusCode);       
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const weatherInfo = {
                temperature: weatherData.main.temp,
                weather: weatherData.weather[0].main,
                icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            }

            res.write(`<p>Wather in ${cityName}:</p>`)
            res.write(`<p>${weatherInfo.weather}, ${weatherInfo.temperature} degrees</p>`);
            res.write(`<img src=${weatherInfo.icon} />`)
            res.send();
        })
    });
})

app.listen(3000, () => console.log("Server started!"))