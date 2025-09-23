import { News } from '../types/News';
import { ApiAdapter, DemoDataStore } from './apiAdapter';
import { isDemo } from '../config/environment';
import newsData from '../data/news.json';

// Convert JSON data to News objects with proper Date objects
const demoNews: News[] = newsData.map(article => ({
  ...article,
  published_at: article.published_at ? new Date(article.published_at) : new Date(),
  created_at: article.created_at ? new Date(article.created_at) : new Date(),
  updated_at: undefined,
}));

// Initialize demo data
if (isDemo()) {
  const storedNews = DemoDataStore.get('news', demoNews);
  if (storedNews.length === 0) {
    DemoDataStore.set('news', demoNews);
  }
}

export const getAllNews = async (): Promise<News[]> => {
  if (isDemo()) {
    return DemoDataStore.get('news', demoNews);
  }

  return ApiAdapter.authenticatedRequest<News[]>('/news');
};

export const getPublishedNews = async (): Promise<News[]> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    return news.filter((article: News) => article.is_published);
  }

  return ApiAdapter.get<News[]>('/news?published=true');
};

export const getFeaturedNews = async (): Promise<News[]> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    return news.filter((article: News) => article.is_featured && article.is_published);
  }

  return ApiAdapter.get<News[]>('/news?featured=true');
};

export const getNewsById = async (id: string): Promise<News | null> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    return news.find((article: News) => article.id === id) || null;
  }

  try {
    return await ApiAdapter.get<News>(`/news/${id}`);
  } catch (error) {
    return null;
  }
};

export const createNews = async (newsData: Omit<News, 'id' | 'created_at' | 'updated_at'>): Promise<News> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    const newArticle: News = {
      ...newsData,
      id: `demo_news_${Date.now()}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    news.push(newArticle);
    DemoDataStore.set('news', news);
    return newArticle;
  }

  return ApiAdapter.authenticatedRequest<News>('/news', {
    method: 'POST',
    body: JSON.stringify(newsData)
  });
};

export const updateNews = async (id: string, updates: Partial<News>): Promise<News | null> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    const articleIndex = news.findIndex((article: News) => article.id === id);
    
    if (articleIndex === -1) {
      return null;
    }
    
    news[articleIndex] = {
      ...news[articleIndex],
      ...updates,
      updated_at: new Date(),
    };
    
    DemoDataStore.set('news', news);
    return news[articleIndex];
  }

  try {
    return await ApiAdapter.authenticatedRequest<News>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    return null;
  }
};

export const deleteNews = async (id: string): Promise<boolean> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    const articleIndex = news.findIndex((article: News) => article.id === id);
    
    if (articleIndex === -1) {
      return false;
    }
    
    news.splice(articleIndex, 1);
    DemoDataStore.set('news', news);
    return true;
  }

  try {
    await ApiAdapter.authenticatedRequest(`/news/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getNewsByCategory = async (category: string): Promise<News[]> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    return news.filter((article: News) => 
      article.category.toLowerCase() === category.toLowerCase() && article.is_published
    );
  }

  return ApiAdapter.get<News[]>(`/news?category=${encodeURIComponent(category)}`);
};

export const searchNews = async (query: string): Promise<News[]> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    const lowercaseQuery = query.toLowerCase();
    return news.filter((article: News) => 
      article.is_published && (
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  return ApiAdapter.get<News[]>(`/news/search?q=${encodeURIComponent(query)}`);
};

export const getRecentNews = async (limit: number = 5): Promise<News[]> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    return news
      .filter((article: News) => article.is_published)
      .sort((a, b) => (b.published_at?.getTime() || 0) - (a.published_at?.getTime() || 0))
      .slice(0, limit);
  }

  return ApiAdapter.get<News[]>(`/news/recent?limit=${limit}`);
};

export const incrementNewsViews = async (id: string): Promise<void> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    const articleIndex = news.findIndex((article: News) => article.id === id);
    
    if (articleIndex !== -1) {
      news[articleIndex].views = (news[articleIndex].views || 0) + 1;
      DemoDataStore.set('news', news);
    }
    return;
  }

  try {
    await ApiAdapter.post(`/news/${id}/view`, {});
  } catch (error) {
    // Ignore view increment errors
  }
};

export const likeNews = async (id: string): Promise<void> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    const articleIndex = news.findIndex((article: News) => article.id === id);
    
    if (articleIndex !== -1) {
      news[articleIndex].likes = (news[articleIndex].likes || 0) + 1;
      DemoDataStore.set('news', news);
    }
    return;
  }

  try {
    await ApiAdapter.authenticatedRequest(`/news/${id}/like`, { method: 'POST' });
  } catch (error) {
    // Ignore like errors
  }
};

export const unlikeNews = async (id: string): Promise<void> => {
  if (isDemo()) {
    const news = DemoDataStore.get('news', demoNews);
    const articleIndex = news.findIndex((article: News) => article.id === id);
    
    if (articleIndex !== -1 && news[articleIndex].likes > 0) {
      news[articleIndex].likes = (news[articleIndex].likes || 0) - 1;
      DemoDataStore.set('news', news);
    }
    return;
  }

  try {
    await ApiAdapter.authenticatedRequest(`/news/${id}/unlike`, { method: 'POST' });
  } catch (error) {
    // Ignore unlike errors
  }
};
