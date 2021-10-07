const { default: axios } = require("axios");
const Joi = require("joi");
const { nasaApiKey } = require("../config/env.config");

exports.imageOfTheMonth = async (req, res) => {
	try {
		const month = new Date().getMonth() + 1;
		const year = new Date().getFullYear();

		const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${year}-${month}-01`);
		if(response.data.length === 0) {
			res.status(404).json({
				status: 404,
				message: "image/video not found"
			});
		} else {
			res.status(200).json({
				date : response.data.date,
				media_type : response.data.media_type,
				title : response.data.title,
				url : response.data.url,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "image/video not found"
		});
	}
};

exports.imagesOfTheGivenMonth = async (req, res) => {
	const validateMonth = Joi.string().pattern(/^(january|february|march|april|may|june|july|august|september|october|november|december)$/i).required();
	const validateYear = Joi.string().pattern(/^\d{4}$/).required();

	try {
		const month = await validateMonth.validateAsync(req.params.month);
		const year = await validateYear.validateAsync(req.params.year);

		const monthNumber = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].indexOf(month.toLowerCase());
		const startDate = new Date(year, monthNumber, 1).toISOString().slice(0, 10);
		let endDate = new Date(year, (monthNumber+1) , 0).toISOString().slice(0, 10);

		if(endDate > new Date().toISOString().slice(0, 10)) {
			endDate = new Date().toISOString().slice(0, 10);
		}

		const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&start_date=${startDate}&end_date=${endDate}`);
		
		const images = response.data.filter(image => image.media_type === "image").map(image => image.url);
		if(images.length === 0) {
			res.status(404).json({
				status: 404,
				message: "image/video not found"
			});
		} else {
			res.status(200).send(images);
		}

	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "image/video not found"
		});
	}
};

exports.videosOfTheGivenMonth = async (req, res) => {
	const validateMonth = Joi.string().pattern(/^(january|february|march|april|may|june|july|august|september|october|november|december)$/i).required();
	const validateYear = Joi.string().pattern(/^\d{4}$/).required();

	try {
		const month = await validateMonth.validateAsync(req.params.month);
		const year = await validateYear.validateAsync(req.params.year);

		const monthNumber = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].indexOf(month.toLowerCase());
		const startDate = new Date(year, monthNumber, 1).toISOString().slice(0, 10);
		let endDate = new Date(year, (monthNumber+1) , 0).toISOString().slice(0, 10);

		if(endDate > new Date().toISOString().slice(0, 10)) {
			endDate = new Date().toISOString().slice(0, 10);
		}

		const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&start_date=${startDate}&end_date=${endDate}`);

		const videos = response.data.filter(video => video.media_type === "video").map(video => video.url);
		if(videos.length === 0) {
			res.status(404).json({
				status: 404,
				message: "image/video not found"
			});
		} else {
			res.status(200).send(videos);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "image/video not found"
		});
	}
};

exports.earthPolychromaticImage = async (req, res) => {
	const validateDate = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required();

	try {
		const date = await validateDate.validateAsync(req.params.date);
		const response = await axios.get(`https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${nasaApiKey}`);
		
		if(response.data.length === 0) {
			res.status(404).json({
				status: 404,
				message: "image/video not found"
			});
		}else {
			const imageData = await response.data.filter((image) => {
				if(image.centroid_coordinates.lat > 10 && image.centroid_coordinates.lat < 40 && image.centroid_coordinates.lon > 120 && image.centroid_coordinates.lon < 160) {
					return image;
				}
			}).map((image) => {
				return {
					identifier : image.identifier,
					caption : image.caption,
					image : image.image,
					date : image.date,
					latitude : image.centroid_coordinates.lat,
					longitude : image.centroid_coordinates.lon,
				}
			});
	
			res.status(200).json(imageData);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "image/video not found"
		});
	}
};