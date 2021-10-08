const { default: axios } = require("axios");
const Joi = require("joi");
const { twitterBearerToken } = require("../config/env.config");

exports.tweetsByUsername = async (req, res) => {
	const validateUserName = Joi.string().regex(/^[a-zA-Z0-9_]*$/).required();

	try {
		const userName = await validateUserName.validateAsync(req.params.user_name);

		const user = await axios.get(`https://api.twitter.com/2/users/by/username/${userName}?user.fields=public_metrics`, {
			headers: {
				Authorization: `Bearer ${twitterBearerToken}`
			}
		});

		const userId = user.data.data.id;

		const tweets = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at,text`, {
			headers: {
				Authorization: `Bearer ${twitterBearerToken}`
			}
		});

		const tweetsData = tweets.data.data.map(tweet => {
			return {
				created_at: tweet.created_at,
				text: tweet.text
			};
		});

		if(tweetsData.length === 0) {
			res.status(404).json({
				status: 404,
				message: "tweets not found"
			});
		} else {
			res.status(200).json({
				user_name: user.data.data.name,
				user_screen_name: user.data.data.username,
				followers_count: user.data.data.public_metrics.followers_count,
				friends_count: user.data.data.public_metrics.following_count,
				tweets: tweetsData
			});
		}

	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "tweets not found"
		});
	}
};

exports.tweetsByHashtag = async (req, res) => {
	const validateHashtag = Joi.string().regex(/^[a-zA-Z0-9_]*$/).required();

	try {
		const hashtag = await validateHashtag.validateAsync(req.params.hashtag);
		const response = await axios.get(`https://api.twitter.com/1.1/search/tweets.json?q=%23${hashtag}&count=10`, {
			headers: {
				Authorization: `Bearer ${twitterBearerToken}`
			}
		});
		const tweets = response.data.statuses.map(tweet => {
			return {
				text : tweet.text,
				user_screen_name : tweet.user.screen_name,
				retweet_count : tweet.retweet_count,
			}
		});
		if(tweets.length === 0) {
			res.status(404).json({
				status: 404,
				message: "tweets not found"
			});
		}
		else {
			res.status(200).send(tweets);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "tweets not found"
		});
	}
};

exports.tweetsByLocation = async (req, res) => {
	const validateLatitude = Joi.number().required();
	const validateLongitude = Joi.number().required();
	const validateRadius = Joi.string().regex(/^[0-9A-Za-z.]*$/).required();

	try {
		const latitude = await validateLatitude.validateAsync(req.query.latitude);
		const longitude = await validateLongitude.validateAsync(req.query.longitude);
		const radius = await validateRadius.validateAsync(req.query.radius);

		const response = await axios.get(`https://api.twitter.com/1.1/search/tweets.json?q&geocode=${latitude},${longitude},${radius}&count=10`, {
			headers: {
				Authorization: `Bearer ${twitterBearerToken}`
			}
		});
		const tweets = response.data.statuses.map(tweet => {
			return {
				text : tweet.text,
				user_screen_name : tweet.user.screen_name,
			}
		});
		if(tweets.length === 0) {
			res.status(404).json({
				status: 404,
				message: "tweets not found"
			});
		} else {
			res.status(200).send(tweets);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "tweets not found"
		});
	}
};