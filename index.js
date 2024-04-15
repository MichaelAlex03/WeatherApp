import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({extended: true}));

const apiKey = "a2f791935cc39ad4fcc5ab8eb4a53378";
var temperature;


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
        city: city, 
        state: stateCode,
      });
    } catch (error) {
      res.render("index.ejs", { secret: JSON.stringify(error.response.data)});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
