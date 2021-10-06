const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	//Server Configurations
	port : process.env.PORT,
	weatherApiKey : process.env.WEATHER_API_KEY,
};