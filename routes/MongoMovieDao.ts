import { IMovieDao } from './IMovieDao'
import { Movie } from '../data_entities/Movie'
import { Globals } from "../globals";

let globals = new Globals();
declare var require : any;

export class MongoMovieDao implements IMovieDao {
    MongoClient : any;
    ObjectIdConverter : any;
    DbUrl : string;
    MovieCollectionName : string;

    constructor(dbUrl : string, movieCollectionName : string) {
        this.DbUrl = dbUrl;
        this.MongoClient = require('mongodb').MongoClient;
        this.ObjectIdConverter = require('mongodb').ObjectID;
        this.MovieCollectionName = movieCollectionName;
    }

    AddMovie(movie : Movie) {
        // TODO: Implement
        throw new Error("Not yet implemented");
    }

    GetMovie(movieId: string) : Promise<JSON> {
        let convertedItemId = this.ObjectIdConverter(movieId);
        let collection = this.MovieCollectionName;

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

    GetManyMovies(offset : number, limit : number) : Promise<JSON> {
        let collection = this.MovieCollectionName;

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

}