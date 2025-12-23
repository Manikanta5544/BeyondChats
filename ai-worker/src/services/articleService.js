import axios from 'axios';
import { REQUEST_TIMEOUT } from '../config.js';

function getApiClient() {
  if (!process.env.LARAVEL_API_URL) {
    throw new Error('LARAVEL_API_URL is not set');
  }

  return axios.create({
    baseURL: process.env.LARAVEL_API_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export async function getArticle(id) {
  const api = getApiClient();
  const { data } = await api.get(`/articles/${id}`);
  return data.data || data;
}

export async function getLatestArticle() {
  const api = getApiClient();
  const { data } = await api.get('/articles/latest');

  const article = data.data || data;
  if (!article?.id) {
    const e = new Error('No articles available');
    e.status = 404;
    throw e;
  }

  return article;
}

export async function updateArticle(id, payload) {
  const api = getApiClient();
  await api.put(`/articles/${id}`, payload);
}
