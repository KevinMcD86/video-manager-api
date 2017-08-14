import { ITvDao } from './ITvDao'
import { TvSeries } from '../data_entities/TvSeries'
import { TvEpisode } from '../data_entities/TvEpisode'
import { Globals } from "../globals";

let globals = new Globals();
declare var require : any;

export class MongoTvDao implements ITvDao {
    MongoClient : any;
    ObjectIdConverter : any;
    DbUrl : string;
    TvEpisodeCollectionName : string;
    TvSeriesCollectionName : string;

    constructor(dbUrl : string, tvEpisodeCollectionName : string, tvSeriesCollectionName : string) {
        this.DbUrl = dbUrl;
        this.MongoClient = require('mongodb').MongoClient;
        this.ObjectIdConverter = require('mongodb').ObjectID;
        this.TvEpisodeCollectionName = tvEpisodeCollectionName;
        this.TvSeriesCollectionName = tvSeriesCollectionName;
    }

    AddOneTvSeries(tvSeries : TvSeries) {
        // TODO: Implement
        throw new Error("Not yet implemented");
    }

    AddManyTvSeries(tvSeriesArray : TvSeries[]) {
        // TODO: Implement
        throw new Error("Not yet implemented");
    }

    AddTvEpisode(tvSeriesId : string, tvEpisode : TvEpisode) {
        // TODO: Implement
        throw new Error("Not yet implemented");
    }

    AddTvEpisodes(tvSeriesId : string, tvEpisodes : TvEpisode[]) {
        // TODO: Implement
        throw new Error("Not yet implemented");
    }

    GetEpisode(episodeId : string) : Promise<JSON> {
        let convertedItemId = this.ObjectIdConverter(episodeId);
        let collection = this.TvEpisodeCollectionName;

        return new Promise((resolve, reject) => {
            this.MongoClient.connect(this.DbUrl, async function(err, db) {
                if(err) {
                    reject(err);
                }

                db.collection(collection).findOne({_id: convertedItemId}, function(err, item) {
                    if(err) {
                        console.log("error")
                        reject(err);
                    }
                    console.log("Found item: " + item);
                    resolve(item);
                });

                db.close();
            });
        });
    }

    GetEpisodes(seriesId : string, offset : number, limit : number) : Promise<JSON> {
        let convertedItemId = this.ObjectIdConverter(seriesId);
        let collection = this.TvEpisodeCollectionName;

        return new Promise((resolve, reject) => {
            this.MongoClient.connect(this.DbUrl, async function(err, db) {
                if(err) {
                    reject(err);
                }

                db.collection(collection).find({series_id: convertedItemId}).toArray(function(err, item) {
                    if(err) {
                        console.log("error")
                        reject(err);
                    }
                    console.log("Found item: " + JSON.stringify(item));
                    resolve(item);
                })

                db.close();
            });
        });
    }

    GetManyTvSeries(offset : number, limit : number) : Promise<JSON> {
        let collection = this.TvSeriesCollectionName;

        return new Promise((resolve, reject) => {
            this.MongoClient.connect(this.DbUrl, async function(err, db) {
                if(err) {
                    reject(err);
                }

                db.collection(collection).find().toArray(function(err, item) {
                    if(err) {
                        console.log("error")
                        reject(err);
                    }
                    console.log("Found item: " + item);
                    resolve(item);
                });

                db.close();
            });
        });
    }

    GetOneTvSeries(seriesId : string) : Promise<JSON> {
        let convertedItemId = this.ObjectIdConverter(seriesId);
        let collection = this.TvSeriesCollectionName;

        return new Promise((resolve, reject) => {
            this.MongoClient.connect(this.DbUrl, async function(err, db) {
                if(err) {
                    reject(err);
                }

                db.collection(collection).findOne({_id: convertedItemId}, function(err, item) {
                    if(err) {
                        console.log("error")
                        reject(err);
                    }
                    console.log("Found item: " + item);
                    resolve(item);
                })

                db.close();
            });
        });
    }
}