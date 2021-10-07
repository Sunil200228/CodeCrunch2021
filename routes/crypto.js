const { allCoins, allTokens, coinTickerPrice, coinFounderTeamMembers } = require('../controller/crypto.controller');

const router = require('express').Router();

router.get("/coins", allCoins);

router.get("/tokens", allTokens);

router.get("/quote/:name", coinTickerPrice);

router.get("/team/:name", coinFounderTeamMembers);

module.exports = router;