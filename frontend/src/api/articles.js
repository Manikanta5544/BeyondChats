const API_URL = import.meta.env.VITE_API_URL;

export async function fetchArticles() {
  const res = await fetch(`${API_URL}/articles`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function fetchArticle(id) {
  const res = await fetch(`${API_URL}/articles/${id}`);
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}
