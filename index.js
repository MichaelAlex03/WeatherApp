import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render("index.ejs");
  });

app.get("/search", async(req, res) => {
  try {
      const result = await axios.get(API_URL + "/random");
      res.render("index.ejs", { secret: JSON.stringify(result.data.secret), user: JSON.stringify(result.data.username)});
    } catch (error) {
      res.render("index.ejs", { secret: JSON.stringify(error.response.data)});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});