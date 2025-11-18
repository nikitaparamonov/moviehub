export const API_KEY = '6d67d6c966fd32deae49c37b18df8ad1';
export const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Fetch popular movies
export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data: TMDBResponse = await response.json();
  return data.results;
};
