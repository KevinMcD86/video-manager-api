import { TvSeries } from '../data_entities/TvSeries'
import { TvEpisode } from '../data_entities/TvEpisode'

export interface ITvDao {
    AddOneTvSeries(tvSeries : TvSeries);
    AddManyTvSeries(tvSeriesArray : TvSeries[]);
    AddTvEpisode(tvSeriesId : string, tvEpisode : TvEpisode);
    AddTvEpisodes(tvSeriesId : string, tvEpisodes : TvEpisode[]);
    GetEpisode(episodeId : string) : Promise<JSON>;
    GetEpisodes(seriesId : string, offset : number, limit : number) : Promise<JSON>;
    GetManyTvSeries(offset : number, limit : number) : Promise<JSON>;
    GetOneTvSeries(seriesId : string) : Promise<JSON>;
}