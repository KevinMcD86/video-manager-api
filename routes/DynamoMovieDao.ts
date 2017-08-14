import { IMovieDao } from './IMovieDao'
import { Movie } from '../data_entities/Movie'
import { Globals } from "../globals";

export class DynamoMovieDao implements IMovieDao {
    DynamoDb : any;
    DocClient : any;
    MovieCollectionName : string;

    constructor(aws : any, movieCollectionName : string) {
        this.DynamoDb = new aws.DynamoDB();
        this.DocClient = new aws.DynamoDB.DocumentClient();
        this.MovieCollectionName = movieCollectionName;
    }

    AddMovie(movie : Movie) {
        // TODO: Implement
        throw new Error("Not yet implemented");
    }

    GetMovie(movieId: string) : Promise<JSON> {
        var params = {
            Key: {
                "_id": movieId
            },
            TableName: this.MovieCollectionName
        }

        return new Promise((resolve, reject) => {
            this.DocClient.get(params, function(err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("GetItem succeeded:", data);
                    resolve(data.Item);
                }
            });
        });
    }

    GetManyMovies(offset : number, limit : number) : Promise<JSON> {
        var params = {
            TableName: this.MovieCollectionName,
            Limit : 10
        }

        return new Promise((resolve, reject) => {
            this.DocClient.scan(params, function(err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("GetItem succeeded:", data);
                    resolve(data.Items);
                }
            });
        });
    }

}