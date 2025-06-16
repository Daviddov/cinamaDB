import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../services/tmdbApi';

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [genres, setGenres] = useState([]);

  // טעינת ז'אנרים בטעינה ראשונה
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await tmdbService.getGenres();
        setGenres(genresData);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, []);

  // טעינת סרטים פופולריים בטעינה ראשונה
  useEffect(() => {
    loadPopularMovies();
  }, []);

  // טעינת סרטים פופולריים
  const loadPopularMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await tmdbService.getPopularMovies(page);
      
      if (page === 1) {
        setMovies(data.movies);
      } else {
        setMovies(prev => [...prev, ...data.movies]);
      }
      
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setCurrentPage(page);
      setSearchTerm('');
    } catch (err) {
      setError('שגיאה בטעינת סרטים פופולריים');
      console.error('Error loading popular movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // חיפוש סרטים
  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      loadPopularMovies();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await tmdbService.searchMovies(query, page);
      
      if (page === 1) {
        setMovies(data.movies);
      } else {
        setMovies(prev => [...prev, ...data.movies]);
      }
      
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setCurrentPage(page);
      setSearchTerm(query);
    } catch (err) {
      setError('שגיאה בחיפוש סרטים');
      console.error('Error searching movies:', err);
    } finally {
      setLoading(false);
    }
  }, [loadPopularMovies]);

  // טעינת סרטים לפי ז'אנר
  const loadMoviesByGenre = useCallback(async (genreId, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await tmdbService.getMoviesByGenre(genreId, page);
      
      if (page === 1) {
        setMovies(data.movies);
      } else {
        setMovies(prev => [...prev, ...data.movies]);
      }
      
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setCurrentPage(page);
      setSearchTerm('');
    } catch (err) {
      setError('שגיאה בטעינת סרטים לפי ז\'אנר');
      console.error('Error loading movies by genre:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // טעינת סרטים טרנדיים
  const loadTrendingMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await tmdbService.getTrendingMovies();
      setMovies(data);
      setTotalPages(1);
      setTotalResults(data.length);
      setCurrentPage(1);
      setSearchTerm('');
    } catch (err) {
      setError('שגיאה בטעינת סרטים טרנדיים');
      console.error('Error loading trending movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // טעינת עוד סרטים (pagination)
  const loadMoreMovies = useCallback(async () => {
    if (currentPage >= totalPages) return;

    const nextPage = currentPage + 1;

    if (searchTerm) {
      searchMovies(searchTerm, nextPage);
    } else {
      loadPopularMovies(nextPage);
    }
  }, [currentPage, totalPages, searchTerm, searchMovies, loadPopularMovies]);

  // איפוס החיפוש
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    loadPopularMovies();
  }, [loadPopularMovies]);

  return {
    movies,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    totalResults,
    genres,
    searchMovies,
    loadPopularMovies,
    loadMoviesByGenre,
    loadTrendingMovies,
    loadMoreMovies,
    clearSearch,
    setSearchTerm,
  };
};