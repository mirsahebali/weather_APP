const functions = require("firebase-functions");
const admin = require("firebase-admin")
const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
admin.initializeApp(functions.config().firebase)
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const lat = req.body.lat;
  const lon = req.body.long;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=18c75c39b888018ed2272015a9a416be`;

  https.get(url, (response) => {
    console.log(response.statusCode);
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const country = weatherData.name;
      res.write("Country:" + country);
      res.write("\n Weather: " + description);
      res.write("\n Temperature: " + temp);
      res.send();
    });
  });
});
const PORT = 4000;
app.listen(PORT, () => console.log("Server started on localhost:3000"));

exports.app = functions.https.onRequest(app);
