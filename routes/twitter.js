const { tweetsByUsername, tweetsByHashtag, tweetsByLocation } = require('../controller/twitter.controller');

const router = require('express').Router();

router.get("/user/:user_name", tweetsByUsername);

router.get("/hashtag/:hashtag", tweetsByHashtag);

router.get("/location", tweetsByLocation);

module.exports = router;