// src/services/tmdbApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

// יצירת instance של axios
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// פונקציות API
export const tmdbService = {
  // קבלת סרטים פופולריים
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: { page }
      });
      return {
        movies: response.data.results.map(movie => ({
          ...movie,
          poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
          backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        })),
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // חיפוש סרטים
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query, page }
      });
      return {
        movies: response.data.results.map(movie => ({
          ...movie,
          poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
          backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        })),
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // קבלת פרטי סרט
  getMovieDetails: async (movieId) => {
    try {
      const [movieResponse, creditsResponse] = await Promise.all([
        tmdbApi.get(`/movie/${movieId}`),
        tmdbApi.get(`/movie/${movieId}/credits`)
      ]);

      const movie = movieResponse.data;
      const credits = creditsResponse.data;

      return {
        ...movie,
        poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        cast: credits.cast.slice(0, 10).map(actor => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
          profile_path: actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : null,
        })),
        director: credits.crew.find(person => person.job === 'Director')?.name || 'Unknown',
        crew: credits.crew.slice(0, 5).map(person => ({
          id: person.id,
          name: person.name,
          job: person.job,
        })),
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // קבלת סרטונים וטריילרים של סרט - זה החסר!
  getMovieVideos: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      
      // סינון רק סרטונים מ-YouTube ושפה אנגלית/ללא שפה
      const filteredVideos = response.data.results.filter(video => 
        video.site === 'YouTube' && 
        (video.iso_639_1 === 'en' || !video.iso_639_1)
      );

      // מיון לפי סדר עדיפות: Trailer, Teaser, Clip, אחרים
      const typeOrder = {
        'Trailer': 1,
        'Teaser': 2,
        'Clip': 3,
        'Behind the Scenes': 4,
        'Bloopers': 5,
        'Featurette': 6
      };

      const sortedVideos = filteredVideos.sort((a, b) => {
        const orderA = typeOrder[a.type] || 99;
        const orderB = typeOrder[b.type] || 99;
        return orderA - orderB;
      });

      return sortedVideos.map(video => ({
        id: video.id,
        key: video.key,
        name: video.name,
        type: video.type,
        site: video.site,
        size: video.size,
        published_at: video.published_at,
        official: video.official,
        // URL של תמונה מוקטנת מ-YouTube
        thumbnailUrl: `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`,
        // URL לצפייה ישירה ב-YouTube
        watchUrl: `https://www.youtube.com/watch?v=${video.key}`,
        // URL להטמעה
        embedUrl: `https://www.youtube.com/embed/${video.key}`
      }));
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      throw error;
    }
  },

  // קבלת ז'אנרים
  getGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // קבלת סרטים טרנדיים
  getTrendingMovies: async (timeWindow = 'week') => {
    try {
      const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
      return response.data.results.map(movie => ({
        ...movie,
        poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
      }));
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // קבלת סרטים לפי ז'אנר
  getMoviesByGenre: async (genreId, page = 1) => {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: { 
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc'
        }
      });
      return {
        movies: response.data.results.map(movie => ({
          ...movie,
          poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
          backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        })),
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // קבלת המלצות לסרט
  getMovieRecommendations: async (movieId, page = 1) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
        params: { page }
      });
      return {
        movies: response.data.results.map(movie => ({
          ...movie,
          poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
          backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        })),
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      throw error;
    }
  },

  // קבלת סרטים דומים
  getSimilarMovies: async (movieId, page = 1) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
        params: { page }
      });
      return {
        movies: response.data.results.map(movie => ({
          ...movie,
          poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
          backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        })),
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw error;
    }
  }
};

export default tmdbService;