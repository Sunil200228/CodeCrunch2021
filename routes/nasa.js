const { imageOfTheMonth, imagesOfTheGivenMonth, videosOfTheGivenMonth, earthPolychromaticImage } = require('../controller/nasa.controller');

const router = require('express').Router();

router.get("/image-of-month", imageOfTheMonth);

router.get("/images-of-month/:year/:month", imagesOfTheGivenMonth);

router.get("/videos-of-month/:year/:month", videosOfTheGivenMonth);

router.get("/earth-poly-image/:date", earthPolychromaticImage);

module.exports = router;