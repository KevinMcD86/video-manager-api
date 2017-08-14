import { Movie } from '../data_entities/Movie'

export interface IMovieDao {
    AddMovie(movie : Movie);
    GetMovie(movieId: string) : Promise<JSON>;
    GetManyMovies(offset : number, limit : number) : Promise<JSON>;
}