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
var time = currentTime.getHours() + ":" + currentTime.getMinutes();

function convertToNonMilitaryTime(req, res, next) {
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var period = (hours >= 12) ? 'PM' : 'AM';
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }
  time = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + period;
  next(); 
}


app.use(convertToNonMilitaryTime);


app.get('/', (req, res) => {
    res.render("index.ejs");
  });

app.get("/search", async(req, res) => {
  var city = req.query.city;
  var stateCode = req.query.statecode;
  city = city[0].toUpperCase() + city.slice(1)
  stateCode = stateCode.toUpperCase();
  try {
      const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${stateCode},&appid=${apiKey}`);
      console.log(result.data);
      temperature = (result.data.main.temp * (9/5)) - 459.67;
      temperature = temperature.toFixed(0);
      res.render("index.ejs", { temp: temperature, 
        weatherId: result.data.weather[0].id, 
        time: time, 
        city: city, 
        state: stateCode,
        humidity: result.data.main.humidity
      });
    } catch (error) {
      res.render("index.ejs", { secret: JSON.stringify(error.response.data)});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
