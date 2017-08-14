import { ITvDao } from './ITvDao'
import { TvSeries } from '../data_entities/TvSeries'
import { TvEpisode } from '../data_entities/TvEpisode'
import { Globals } from "../globals";

export class DynamoTvDao implements ITvDao {
    DynamoDb : any;
    DocClient : any;
    TvEpisodeCollectionName : string;
    TvSeriesCollectionName : string;

    constructor(aws : any, tvEpisodeCollectionName, tvSeriesCollectionName) {
        this.DynamoDb = new aws.DynamoDB();
        this.DocClient = new aws.DynamoDB.DocumentClient();
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
        var params = {
            Key: {
                "_id": episodeId
            },
            TableName: this.TvEpisodeCollectionName
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

    GetEpisodes(seriesId : string, offset : number, limit : number) : Promise<JSON> {        
        var params = {
            Limit: 10,
            TableName: this.TvEpisodeCollectionName,
            ScanFilter : {
                "series_id" : { "ComparisonOperator" : "EQ" , "AttributeValueList" : [seriesId] }
            }
        };

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

    GetOneTvSeries(seriesId : string) : Promise<JSON> {
        var params = {
            Key: {
                "_id": seriesId
            },
            TableName: this.TvSeriesCollectionName
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

    GetManyTvSeries(offset : number, limit : number) : Promise<JSON> {
        var params = {
            TableName: this.TvSeriesCollectionName,
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