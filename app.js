const express = require('express');
const { port } = require('./config/env.config');
const weather = require('./routes/weather');
const nasa = require('./routes/nasa');
const app = express();

app.use(express.json());
app.use("/weather", weather);
app.use("/nasa", nasa);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});