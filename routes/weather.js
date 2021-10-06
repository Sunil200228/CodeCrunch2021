const { weatherByCity, weatherByLatitudeLongitudeOrPincode } = require('../controller/weather.controller');

const router = require('express').Router();

router.get("/city/:city_name", weatherByCity);

router.get("/search", weatherByLatitudeLongitudeOrPincode);

module.exports = router;