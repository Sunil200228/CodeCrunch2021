const express = require('express');
const { port } = require('./config/env.config');
const weather = require('./routes/weather');
const nasa = require('./routes/nasa');
const crypto = require('./routes/crypto');
const twitter = require('./routes/twitter');
const app = express();

app.use(express.json());
app.use("/weather", weather);
app.use("/nasa", nasa);
app.use("/crypto", crypto);
app.use("/twitter", twitter);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to CodeX"
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});