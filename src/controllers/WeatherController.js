'use strict';

const weather = require('weather-js');
const send400 = function send400 (res, next, msg) {
  res.statusCode = 400;
  return next(msg);
};

module.exports.getWeather = function getWeather (req, res, next) {
  let location = req.swagger.params.location.value;
  let unit = req.swagger.params.unit.value || 'F'; // Default to 'F' if unit is not provided

  // Check that location is provided
  if (typeof location === 'undefined') {
    return send400(res, next, 'location is a required query parameter');
  }

  // Code necessary to check that if unit is provided, it is one of the valid options
  if (['C', 'F'].indexOf(unit) === -1) {
    return send400(res, next, 'unit must be either C or F');
  }

  // Code necessary to consume the Weather API and respond
  weather.find({search: location, degreeType: unit}, function(err, result) {
    if (err) {
      return next(err.message);
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result, null, 2));
  });
};