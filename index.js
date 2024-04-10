import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({extended: true}));

const apiKey = "a2f791935cc39ad4fcc5ab8eb4a53378";
var temperature;
var currentTime = new Date();
var currentHours = currentTime.getHours();
var currentMin = currentTime.getMinutes();

app.get('/', (req, res) => {
    res.render("index.ejs");
  });

  app.get("/search", async(req, res) => {
    const city = req.query.city;
    const stateCode = req.query.statecode;
    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${stateCode},&appid=${apiKey}`);
        console.log(result);
        temperature = (result.data.main.temp * (9/5)) - 459.67;
        temperature = temperature.toFixed(0);
        res.render("index.ejs", { temp: temperature, weatherId: result.data.weather[0].id, time: time});
      } catch (error) {
        res.render("index.ejs", { secret: JSON.stringify(error.response.data)});
      }
  });
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
