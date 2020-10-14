const request = require("request");

const forecast = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${lat},${long}&units=f`;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback(
        "Unable to find location. Please enter another location.",
        undefined
      );
    } else {
      const {
        weather_descriptions: description,
        temperature,
        feelslike,
        humidity,
      } = body.current;
      callback(
        undefined,
        `${description[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees. The current humidity is ${humidity}%.`
      );
    }
  });
};

module.exports = forecast;
