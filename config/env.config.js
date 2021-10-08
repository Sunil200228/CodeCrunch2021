const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	//Server Configurations
	port : process.env.PORT,
	weatherApiKey : process.env.WEATHER_API_KEY,
	nasaApiKey : process.env.NASA_API_KEY,
	twitterApiKey : process.env.TWITTER_API_KEY,
	twitterApiKeySecret : process.env.TWITTER_API_KEY_SECRET,
	twitterBearerToken : process.env.TWITTER_BEARER_TOKEN,
	twitterAccessToken : process.env.TWITTER_ACCESS_TOKEN,
	twitterAccessTokenSecret : process.env.TWITTER_ACCESS_TOKEN_SECRET,
};