// import { MongoTvDao } from "./MongoTvDao";
// import { MongoMovieDao } from "./MongoMovieDao";
import { DynamoTvDao } from "./DynamoTvDao";
import { DynamoMovieDao } from "./DynamoMovieDao";
import { VideoBusinessAdapter } from "./videoBusinessAdapter";

import { HackMongoDao } from "./HackMongoDao"

declare var module : any;
declare var require : any;
var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");
AWS.config.update({region:process.env.AWS_REGION});

// var tvDao = new MongoTvDao(process.env.TV_DB_URL, "tvEpisodes", "tvSeries");
// var movieDao = new MongoMovieDao(process.env.MOVIE_DB_URL, "movies");
var tvDao = new DynamoTvDao(AWS, "tvEpisodes", "tvSeries");
var movieDao = new DynamoMovieDao(AWS, "movies");
var tvBusinessAdapter = new VideoBusinessAdapter(tvDao, movieDao);

// Get specified movie
router.get('/healthcheck', function(req, res, next) {
    res.json("Healthcheck Passed");
});

// Upload example data to our DB for testing
router.get('/add-videos-via-json', function(req, res, next) {
    let hackMongoDao = new HackMongoDao(process.env.TV_DB_URL, process.env.MOVIE_DB_URL, "tvEpisodes", "tvSeries", "movies");
    hackMongoDao.ClearDb();

    let seriesAndEpisodes = hackMongoDao.AddDemoSeriesAndEpisodeData('../db_models/tvSeries.mongo.json', '../db_models/tvEpisodes.mongo.json')
    let movies = hackMongoDao.AddDemoMovies('../db_models/movies.mongo.json');
    res.json(seriesAndEpisodes + "\n " + movies);
});

// Get specified episode
router.get('/episode/:id', function(req, res, next) {
    console.log("Start Get Episode by Id");
    let episodeId = req.params.id;
    tvBusinessAdapter.GetTvEpisode(episodeId, process.env.VIDEO_LIBRARY_SOURCE, process.env.IMAGE_LIBRARY_SOURCE)
        .then((video) => {
            console.log("Found video: " + video);
            video['videoSource'] = process.env.VIDEO_LIBRARY_SOURCE;
            video['screenshotSource'] = process.env.IMAGE_LIBRARY_SOURCE;
            console.log("Video with added properties: " + video);
            res.json(video);
        })
        .catch((err) => {
            let errorMessage = "Unable to find video (_id=\"" + episodeId + "\"). " +
                err;
            console.log(errorMessage);
            res.status(500).send({ error: errorMessage});
        });
    console.log("End Get Episode by Id");
});

// Get specified movie
router.get('/movie/:id', function(req, res, next) {
    console.log("Start Get Movie by Id");
    let movieId = req.params.id;
    tvBusinessAdapter.GetMovie(movieId, process.env.VIDEO_LIBRARY_SOURCE, process.env.IMAGE_LIBRARY_SOURCE)
        .then((video) => {
            console.log("Found video: " + video);
            video['videoSource'] = process.env.VIDEO_LIBRARY_SOURCE;
            video['screenshotSource'] = process.env.IMAGE_LIBRARY_SOURCE;
            console.log("Video with added properties: " + video);
            res.json(video);
        })
        .catch((err) => {
            let errorMessage = "Unable to find video (_id=\"" + movieId + "\"). " +
                err;
            console.log(errorMessage);
            res.status(500).send({ error: errorMessage});
        });
    console.log("End Get Movie by Id");
});


// Get all series
router.get('/series/', function(req, res, next) {
    console.log("Start Get All Series");
    tvBusinessAdapter.GetAllSeries(process.env.IMAGE_LIBRARY_SOURCE)
        .then((series) => {
            res.json(series);
        })
        .catch((err) => {
            let errorMessage = "Unable to return all series: " + err;
            console.log(errorMessage);
            res.status(500).send({ error: errorMessage});
        });
    console.log("End Get All Series");
});

// Get all movies
router.get('/movies/', function(req, res, next) {
    console.log("Start Get All Movies");
    tvBusinessAdapter.GetAllMovies(process.env.VIDEO_LIBRARY_SOURCE, process.env.IMAGE_LIBRARY_SOURCE)
        .then((series) => {
            res.json(series);
        })
        .catch((err) => {
            let errorMessage = "Unable to return all series: " + err;
            console.log(errorMessage);
            res.status(500).send({ error: errorMessage});
        });
    console.log("End Get All Movies");
});

// Get specified series
router.get('/series/:id', function(req, res, next) {
    console.log("Start Get Series by Id");
    let seriesId = req.params.id;
    tvBusinessAdapter.GetSeries(seriesId, process.env.VIDEO_LIBRARY_SOURCE, process.env.IMAGE_LIBRARY_SOURCE)
        .then((series) => {
            res.json(series);
        })
        .catch((err) => {
            let errorMessage = "Unable to find series (id=\"" + seriesId + "\"): "
                + err;
            console.log(errorMessage);
            res.status(500).send({ error: errorMessage});
        });
    console.log("End Get Series by Id");
});

// Get episodes of specified series
router.get('/episodes/:seriesId', function(req, res, next) {
    console.log("Start All Episodes by Series Id");
    let seriesId = req.params.seriesId;
    tvBusinessAdapter.GetEpisodes(seriesId, process.env.VIDEO_LIBRARY_SOURCE, process.env.IMAGE_LIBRARY_SOURCE)
        .then((series) => {
            res.json(series);
        })
        .catch((err) => {
            let errorMessage = "Unable to get episodes for series (id=\"" + seriesId + "\"): "
                + err;
            console.log(errorMessage);
            res.status(500).send({ error: errorMessage });
        });
    console.log("End All Episodes by Series Id");
});

module.exports = router;