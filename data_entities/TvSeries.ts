import { TvEpisode } from './TvEpisode'

export class TvSeries {
    _id: string;
    title: string;
    description: string;
    episodes: TvEpisode[]
    urlBase = "../../../assets/";
}