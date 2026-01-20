export const BASE_URL = 'https://api.themoviedb.org/3'
export const API_KEY = process.env.REACT_APP_TMDB_API_KEY

if (!API_KEY) {
    console.warn('REACT_APP_TMDB_API_KEY is not defined in your .env file. API requests will fail.')
}
