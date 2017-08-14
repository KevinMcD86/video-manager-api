
declare var __dirname : any;
declare var require : any;
var fs = require('fs');
var path = require('path');
var objectID = require('mongodb').ObjectID

var assert = require('assert')

export class HackMongoDao {
    MongoClient : any;
    ObjectIdConverter : any;
    TvDbUrl : string;
    MovieDbUrl : string;
    TvEpisodeCollectionName : string;
    TvSeriesCollectionName : string;
    MovieCollectionName : string;

    private NewIds = [];

    constructor(tvDbUrl : string, movieDbUrl : string, tvEpisodeCollectionName : string, tvSeriesCollectionName : string,
        movieCollectionName : string) {
        this.TvDbUrl = tvDbUrl;
        this.MovieDbUrl = movieDbUrl;
        this.MongoClient = require('mongodb').MongoClient;
        this.ObjectIdConverter = require('mongodb').ObjectID;
        this.TvEpisodeCollectionName = tvEpisodeCollectionName;
        this.TvSeriesCollectionName = tvSeriesCollectionName;
        this.MovieCollectionName = movieCollectionName;
    }

    private ReadFileAndAddToDb(filePath : string, insertIntoDbViaJson : (jsonContents : any) => any) {
        fs.readFile(filePath, {encoding: 'utf-8'}, (err, fileContents) => {
            if(err) {
                console.log(err);
            } else {
                console.log("File Contents:\n" + fileContents);
                
                try {
                    insertIntoDbViaJson( JSON.parse(fileContents));
                } catch (e) {
                    if(e instanceof Error) {
                        console.log("Unable to insert json: " + (<Error>e).message);
                    }
                }
            }
        });
    }

    private InsertJsonIntoCollection(dbUrl : string, collectionName : string, jsonFileContents : string) {
        let itemsAdded;
        
        console.log("Insert: " + dbUrl);
        this.MongoClient.connect(dbUrl, function(err, db) {
                assert.equal(null, err)
                console.log("Connected correctly to mongoDB server")

                db.collection(collectionName).insertMany(jsonFileContents, function(err, items) {
                    if(err) {
                        // res.send(err);
                        throw new Error(err);
                    } else {
                        itemsAdded = items;
                        // console.dir(items);
                        // res.json(items);
                    }
                })

                db.close();
            });

        return itemsAdded;
    }

    private ClearDbCollection(dbUrl : string, collectionName : string) {
        this.MongoClient.connect(dbUrl, function(err, db) {
                assert.equal(null, err)
                console.log("Connected correctly to mongoDB server")

                db.collection(collectionName).remove({}, function(err, items) {
                    if(err) {
                        // res.send(err);
                        throw new Error(err);
                    }
                })
                db.close();
            });
    }

    AddDemoSeriesAndEpisodeData(tvSeriesJsonFilePath : string, tvEpisodesJsonFilePath : string) {
        var seriesFilePath = path.join(__dirname, tvSeriesJsonFilePath);
        var episodesFilePath = path.join(__dirname, tvEpisodesJsonFilePath);

        let hackMongoDao = this;

        
        this.ReadFileAndAddToDb(seriesFilePath, function(jsonContents : any) {
            console.log(jsonContents);
            for(var tvSeries in jsonContents) {
                console.log("before: " + jsonContents[tvSeries]._id);
                let prevId = jsonContents[tvSeries]._id;
                jsonContents[tvSeries]._id = require('mongodb').ObjectID(jsonContents[tvSeries]._id);
                hackMongoDao.NewIds[prevId] = jsonContents[tvSeries]._id;
                console.log("after: " + jsonContents[tvSeries]._id);
            }
            hackMongoDao.InsertJsonIntoCollection(hackMongoDao.TvDbUrl, hackMongoDao.TvSeriesCollectionName, jsonContents);
        });
        this.ReadFileAndAddToDb(episodesFilePath, function(jsonContents : any) {
            for(var tvEpisode in jsonContents) {
                console.log("series_id: " + jsonContents[tvEpisode].series_id);
                console.log("new_id: " + hackMongoDao.NewIds[jsonContents[tvEpisode].series_id]);
                jsonContents[tvEpisode].series_id = hackMongoDao.NewIds[jsonContents[tvEpisode].series_id];
            }
            console.log(JSON.stringify(jsonContents));
            hackMongoDao.InsertJsonIntoCollection(hackMongoDao.TvDbUrl, hackMongoDao.TvEpisodeCollectionName, jsonContents);
        });

        hackMongoDao.NewIds = [];
    }

    AddDemoMovies(moviesFilePath) {
        var moviesFilePath = path.join(__dirname, moviesFilePath);
        let hackMongoDao = this;

        this.ReadFileAndAddToDb(moviesFilePath, function(jsonContents : any) {
            hackMongoDao.InsertJsonIntoCollection(hackMongoDao.MovieDbUrl ,hackMongoDao.MovieCollectionName, jsonContents);
        });
    }

    ClearDb() {
        this.ClearDbCollection(this.TvDbUrl, this.TvEpisodeCollectionName);
        this.ClearDbCollection(this.TvDbUrl, this.TvSeriesCollectionName);
        this.ClearDbCollection(this.MovieDbUrl, this.MovieCollectionName);
    }
}