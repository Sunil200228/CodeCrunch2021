const { default: axios } = require("axios");
const Joi = require("joi");

exports.allCoins = async (req, res) => {
	try {
		const response = await axios.get("https://api.coinpaprika.com/v1/coins");

		const coins = response.data.filter((coin) => coin.type === "coin").map((coin) => {
			return {
				id: coin.id,
				name: coin.name,
				symbol: coin.symbol,
				type : coin.type,
			};
		});
		if(coins.length === 0){
			return res.status(404).json({
				status : 404,
				message : "coin/token not found"
			});
		}else{
			res.status(200).send(coins);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status : 404,
			message : "coin/token not found"
		});
	}
};

exports.allTokens = async (req, res) => {
	try {
		const response = await axios.get("https://api.coinpaprika.com/v1/coins");

		const tokens = response.data.filter((coin) => coin.type === "token").map((coin) => {
			return {
				id: coin.id,
				name: coin.name,
				symbol: coin.symbol,
				type : coin.type,
			};
		});
		if(tokens.length === 0){
			return res.status(404).json({
				status : 404,
				message : "coin/token not found"
			});
		}else{
			res.status(200).send(tokens);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status : 404,
			message : "coin/token not found"
		});
	}
};

exports.coinTickerPrice = async (req, res) => {
	const validateName = Joi.string().pattern(/^[a-zA-Z]+$/).required();
	try {
		const name = await validateName.validateAsync(req.params.name);
		const response = await axios.get(`https://api.coinpaprika.com/v1/tickers`);
		const coin = response.data.filter((ticker) => ticker.name === name).map((ticker) => {
			return {
				id: ticker.id,
				name: ticker.name,
				symbol: ticker.symbol,
				rank: ticker.rank,
				circulating_supply: ticker.circulating_supply,
				total_supply: ticker.total_supply,
				max_supply: ticker.max_supply,
				USD_price: ticker.quotes.USD.price,
			};
		});

		if (coin.length === 0) {
			res.status(404).json({
				status : 404,
				message : "coin/token not found"
			});
		} else {
			res.status(200).send(coin[0]);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status : 404,
			message : "coin/token not found"
		});
	}
};

exports.coinFounderTeamMembers = async (req, res) => {
	const validateName = Joi.string().pattern(/^[a-zA-Z]+$/).required();
	try {
		const name = await validateName.validateAsync(req.params.name);
		const allCoins = await axios.get(`https://api.coinpaprika.com/v1/coins`);
		const coinId = allCoins.data.filter((coin) => coin.name === name)[0].id;

		const response = await axios.get(`https://api.coinpaprika.com/v1/coins/${coinId}`);
		
		let founders = [], developers = [];

		for(const teamMember of response.data.team) {
			const details = await axios.get(`https://api.coinpaprika.com/v1/people/${teamMember.id}`);
			if(teamMember.position === "Founder") {
				founders.push({
					name: details.data.name,
					links : (details.data.links.additional === undefined) ? "" : details.data.links.additional[0].url,
				});
			} else if(teamMember.position === "Blockchain Developer") {
				developers.push({
					name: details.data.name,
					position: teamMember.position,
					github: (details.data.links.github === undefined) ? "" : details.data.links.github[0].url,
					linkedin: (details.data.links.linkedin === undefined) ? "" : details.data.links.linkedin[0].url,
					twitter: (details.data.links.twitter === undefined) ? "" : details.data.links.twitter[0].url,
				});
			}
		}
		const coin = {
			id: response.data.id,
			name: response.data.name,
			symbol: response.data.symbol,
			type : response.data.type,
			founders: founders,
			developers: developers,
		}
		if (coin.length === 0) {
			res.status(404).json({
				status : 404,
				message : "coin/token not found"
			});
		} else {
			res.status(200).send(coin);
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status : 404,
			message : "coin/token not found"
		});
	}
};