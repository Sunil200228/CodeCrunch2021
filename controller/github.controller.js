const { default: axios } = require("axios");
const Joi = require("joi");

exports.profileByUsername = async (req, res) => {
	const validateGithubUsername = Joi.string().regex(/^[a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(+=/._-]*$/).required();

	try {
		const username = await validateGithubUsername.validateAsync(req.params.username);
		const response = await axios.get(`https://api.github.com/users/${username}`);
		const followersData = await axios.get(`https://api.github.com/users/${username}/followers`);
		const followers = followersData.data.map(follower => follower.login);

		const followingData = await axios.get(`https://api.github.com/users/${username}/following`);
		const following = followingData.data.map(following => following.login);

		if(response.status === 200) {
			res.status(200).json({
				name : response.data.name,
				avatar_url : response.data.avatar_url,
				public_repos : response.data.public_repos,
				followers : followers,
				following : following,
				url : response.data.url,
				bio : response.data.bio,
			});
		} else {
			res.status(404).json({
				status: 404,
				message: "resource not found"
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "resource not found"
		});
	}
};

exports.repoByStarRange = async (req, res) => {
	const validateStarsRange = Joi.string().regex(/^[0-9,]*$/).required();

	try {
		const starRange = (await validateStarsRange.validateAsync(req.params.stars)).split(",");
		const start = starRange[0];
		const end = starRange[1];
		const response = await axios.get(`https://api.github.com/search/repositories?q=stars:${start}..${end}`);

		const repos = response.data.items.map(repo => {
			return {
				name: repo.name,
				creation_date: repo.created_at,
				stars: repo.stargazers_count,
				size: repo.size,
				forks: repo.forks,
				owner_name: repo.owner.login,
			}
		});
		if(response.status === 200) {
			res.status(200).send(repos);
		} else {
			res.status(404).json({
				status: 404,
				message: "resource not found"
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "resource not found"
		});
	}
};

exports.issuesFilteredByLabels = async (req, res) => {
	const validateUsername = Joi.string().regex(/^[a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(+=/._-]*$/).required();
	const validateLabels = Joi.string().regex(/^[a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(+=/._-]*$/).required();
	const validateReponame = Joi.string().regex(/^[a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(+=/._-]*$/).required();

	try {
		const author = await validateUsername.validateAsync(req.params.author);
		const repo = await validateReponame.validateAsync(req.params.repo);
		const label = await validateLabels.validateAsync(req.params.labels);

		const response = await axios.get(`https://api.github.com/search/issues?q=author:${author}+repo:${repo}+label:${label}`);
		const issues = response.data.items.map(issue => {
			return {
				id : issue.id,
				title : issue.title,
				comments_count : issue.comments,
				assignee : issue.assignee.login,
			}
		});
		if(response.status === 200) {
			res.status(200).send(issues);
		} else {
			res.status(404).json({
				status: 404,
				message: "resource not found"
			});
		}

	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "resource not found"
		});
	}
};

exports.repoCommitsWithinDateRange = async (req, res) => {
	const validateDateRange = Joi.string().regex(/^[0-9-,]*$/).required();
	const validateReponame = Joi.string().regex(/^[a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(+=/._-]*$/).required();

	try {
		const dateRange = (await validateDateRange.validateAsync(req.params.dates)).split(",");
		const start = dateRange[0];
		const end = dateRange[1];
		const repo = await validateReponame.validateAsync(req.params.repo);

		const response = await axios.get(`https://api.github.com/search/commits?q=repo:${repo}+committer-date:${start}..${end}`);

		const commits = response.data.items.map(commit => {
			return {
				node_id: commit.node_id,
				message: commit.commit.message,
				commiter_name: commit.commit.committer.name,
				date: commit.commit.committer.date,
				comment_count: commit.commit.comment_count,
			}
		});
		if(response.status === 200) {
			res.status(200).send(commits);
		} else {
			res.status(404).json({
				status: 404,
				message: "resource not found"
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).json({
			status: 404,
			message: "resource not found"
		});
	}
};