const path = require("path");
const express = require("express");
const hbs = require("hbs");
require("dotenv").config();
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Seth McCullough",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Seth McCullough",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    helpText: "This is some help text",
    name: "Seth McCullough",
  });
});

app.get("/weather", (req, res) => {
  const addressInput = req.query.address;
  if (!addressInput) {
    return res.send({
      error: "You must include an address!",
    });
  }

  // Enter raw address to be geocoded into lat/long
  geocode(addressInput, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    } else {
      // If no errors, fetch forecast based on geocoded lat long from destructed callback above
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        } else {
          // Send the location and forecast data from the forecast callback
          res.send({
            forecast: forecastData,
            location,
            address: req.query.address,
          });
        }
      });
    }
  });
});

// 404 routes needs to come last because it searches all other above routes first

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMsg: "This help article was not found!",
    name: "Seth McCullough",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    errorMsg: "This page was not found!",
    name: "Seth McCullough",
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
