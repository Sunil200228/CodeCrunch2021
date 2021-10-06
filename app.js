const express = require('express');
const { port } = require('./config/env.config');
const weather = require('./routes/weather');
const app = express();

app.use(express.json());
app.use("/weather", weather);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});