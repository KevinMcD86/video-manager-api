import { ITvDao } from "./ITvDao";
import { IMovieDao } from "./IMovieDao";

export class VideoBusinessAdapter {
    TvDao : ITvDao;
    MovieDao : IMovieDao;

    constructor(tvDao : ITvDao, movieDao : IMovieDao) {
        this.TvDao = tvDao;
        this.MovieDao = movieDao;
    }

    async GetTvEpisode( videoId: string, videoSource : string, screenshotSource : string ) : Promise<JSON> {
        return await this.TvDao.GetEpisode(videoId)
            .then((episode) => {
                episode["videoSource"] = videoSource;
                episode["screenshotSource"] = screenshotSource;
                return episode;
            });;
    }

    async GetMovie( movieId: string, videoSource : string, screenshotSource : string ) : Promise<JSON> {
        return await this.MovieDao.GetMovie(movieId)
            .then((movie) => {
                movie["videoSource"] = videoSource;
                movie["screenshotSource"] = screenshotSource;
                return movie;
            });;
    }

    async GetAllSeries(screenshotSource : string) : Promise<JSON> {
        // TODO: Actually handle offset and limit
        return await this.TvDao.GetManyTvSeries(0,100)
            .then((allSeries) => {
                for(let i = 0; i < allSeries.length; i++) {
                    let aSeries = allSeries[i];
                    console.log(JSON.stringify(aSeries));
                    aSeries["screenshotSource"] = screenshotSource;
                };

                console.log(allSeries);
                return allSeries;
            });
    }

    async GetAllMovies( videoSource : string, screenshotSource : string ) : Promise<JSON> {
        // TODO: Actually handle offset and limit
        return await this.MovieDao.GetManyMovies(0,100)
            .then((movies) => {
                for(let i = 0; i < movies.length; i++) {
                    let movie = movies[i];
                    console.log(JSON.stringify(movie));
                    movie["videoSource"] = videoSource;
                    movie["screenshotSource"] = screenshotSource;
                };

                console.log(movies);
                return movies;
            });
    }

    async GetSeries( seriesId: string, videoSource : string, screenshotSource : string ) : Promise<JSON> {
        return await this.TvDao.GetOneTvSeries(seriesId)
            .then((series) => {
                console.log(JSON.stringify(series));
                series["screenshotSource"] = screenshotSource;

                return series;
            });
    }

    async GetEpisodes( seriesId: string, videoSource : string, screenshotSource : string ) : Promise<JSON> {
        // TODO: Actually handle offset and limit
        return await this.TvDao.GetEpisodes(seriesId, 0, 100)
            .then((episodes) => {
                for(let i = 0; i < episodes.length; i++) {
                    let episode = episodes[i];
                    console.log(JSON.stringify(episode));
                    episode["videoSource"] = videoSource;
                    episode["screenshotSource"] = screenshotSource;
                };

                console.log(episodes);
                return episodes;
            });;
    }
}