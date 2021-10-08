const { profileByUsername, repoByStarRange, issuesFilteredByLabels, repoCommitsWithinDateRange } = require('../controller/github.controller');

const router = require('express').Router();

router.get("/user/:username", profileByUsername);

router.get("/repo/:stars", repoByStarRange);

router.get("/issues/:author/:repo/:labels", issuesFilteredByLabels);

router.get("/commits/:dates/:repo", repoCommitsWithinDateRange);	

module.exports = router;