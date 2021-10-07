const { default: axios } = require("axios");
const Joi = require("joi");
const { weatherApiKey } = require("../config/env.config");

exports.weatherByCity = async (req, res) => {
	const validateCity = Joi.string().pattern(/^[a-zA-Z ]+$/).required();

	try {
		const city = await validateCity.validateAsync(req.params.city_name);
		const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`;

		const response = await axios.get(url);
		
		if(response.data.cod === "404") {
			res.status(404).json({
				status: 404,
				message : "weather data not found"
			});
		} else {
			res.status(200).json({
				country : response.data.sys.country,
				name : response.data.name,
				temp : response.data.main.temp,
			});
		}
	} catch (error) {
		console.log(error);

		res.status(404).json({
			status : 404,
			message : "weather data not found" 
		});
	}
};

exports.weatherByLatitudeLongitudeOrPincode = async (req, res) => {
	const validateLatitude = Joi.number();
	const validateLongitude = Joi.number();
	const validatePincode = Joi.number();

	let url = "";

	try {
		const latitude = await validateLatitude.validateAsync(req.query.latitude);
		const longitude = await validateLongitude.validateAsync(req.query.longitude);
		const pincode = await validatePincode.validateAsync(req.query.pin_code);

		if(longitude !== undefined && latitude !== undefined) {
			url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`;
		} else if(pincode !== undefined) {
			url = `http://api.openweathermap.org/data/2.5/weather?zip=${pincode},IN&units=metric&appid=${weatherApiKey}`;
		} else {
			res.status(404).json({
				status : 404,
				message : "weather data not found"
			});
		}

		const response = await axios.get(url);
		if(response.data.cod === "404") {
			res.status(404).json({
				status : 404,
				message : "weather data not found"
			});
		} else {
			res.status(200).json({
				country : response.data.sys.country,
				name : response.data.name,
				temp : response.data.main.temp,
				min_temp : response.data.main.temp_min,
				max_temp : response.data.main.temp_max,
				latitude : response.data.coord.lat,
				longitude : response.data.coord.lon,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status : 404,
			message : "weather data not found"
		});
	}
};
