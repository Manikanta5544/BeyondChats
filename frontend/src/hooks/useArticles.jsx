import { useEffect, useState } from 'react';
import { fetchArticles, fetchArticle } from '../api/articles';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadArticles() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArticles();
      setArticles(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadArticle(id) {
    try {
      setSelected(null);          
      setLoading(true);
      setError(null);
      const data = await fetchArticle(id);
      setSelected(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  return {
    articles,
    selected,
    loading,
    error,
    loadArticle
  };
}
