const express = require('express');
const { port } = require('./config/env.config');
const app = express();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});