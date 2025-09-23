import { News, NewsComment } from '../types/News';
import newsData from '../data/news.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all news articles
export const getAllNews = async (): Promise<News[]> => {
  await delay(300);
  return newsData.map(article => ({
    ...article,
    created_at: new Date(article.created_at),
    updated_at: article.updated_at ? new Date(article.updated_at) : undefined,
    published_at: article.published_at ? new Date(article.published_at) : undefined
  })) as News[];
};

// Get published news articles
export const getPublishedNews = async (): Promise<News[]> => {
  await delay(300);
  const publishedNews = newsData.filter(article => article.is_published);
  
  return publishedNews.map(article => ({
    ...article,
    created_at: new Date(article.created_at),
    updated_at: article.updated_at ? new Date(article.updated_at) : undefined,
    published_at: article.published_at ? new Date(article.published_at) : undefined
  })) as News[];
};

// Get featured news articles
export const getFeaturedNews = async (): Promise<News[]> => {
  await delay(250);
  const featuredNews = newsData.filter(article => article.is_featured && article.is_published);
  
  return featuredNews.map(article => ({
    ...article,
    created_at: new Date(article.created_at),
    updated_at: article.updated_at ? new Date(article.updated_at) : undefined,
    published_at: article.published_at ? new Date(article.published_at) : undefined
  })) as News[];
};

// Get news article by ID
export const getNewsById = async (id: string): Promise<News | undefined> => {
  await delay(200);
  const article = newsData.find(article => article.id === id);
  if (!article) return undefined;
  
  return {
    ...article,
    created_at: new Date(article.created_at),
    updated_at: article.updated_at ? new Date(article.updated_at) : undefined,
    published_at: article.published_at ? new Date(article.published_at) : undefined
  } as News;
};

// Get news by category
export const getNewsByCategory = async (category: string): Promise<News[]> => {
  await delay(250);
  const categoryNews = newsData.filter(article => 
    article.category.toLowerCase() === category.toLowerCase() && article.is_published
  );
  
  return categoryNews.map(article => ({
    ...article,
    created_at: new Date(article.created_at),
    updated_at: article.updated_at ? new Date(article.updated_at) : undefined,
    published_at: article.published_at ? new Date(article.published_at) : undefined
  })) as News[];
};

// Search news articles
export const searchNews = async (query: string): Promise<News[]> => {
  await delay(300);
  const searchTerm = query.toLowerCase();
  const filteredNews = newsData.filter(article => 
    article.is_published && (
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  );
  
  return filteredNews.map(article => ({
    ...article,
    created_at: new Date(article.created_at),
    updated_at: article.updated_at ? new Date(article.updated_at) : undefined,
    published_at: article.published_at ? new Date(article.published_at) : undefined
  })) as News[];
};

// Create a new news article
export const createNews = async (newsData: Omit<News, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes'>): Promise<News> => {
  await delay(500);
  
  const newArticle: News = {
    id: `news_${Date.now()}`,
    ...newsData,
    views: 0,
    likes: 0,
    created_at: new Date(),
    published_at: newsData.is_published ? new Date() : undefined
  };
  
  // In a real app, we would save the article to a database here
  return newArticle;
};

// Update a news article
export const updateNews = async (id: string, updateData: Partial<News>): Promise<News | null> => {
  await delay(500);
  
  const articleIndex = newsData.findIndex((article: any) => article.id === id);
  if (articleIndex === -1) {
    return null;
  }
  
  const existingArticle = newsData[articleIndex] as any;
  const updatedArticle = {
    ...existingArticle,
    ...updateData,
    updated_at: new Date(),
    published_at: updateData.is_published && !existingArticle.published_at ? new Date() : existingArticle.published_at
  };
  
  // In a real app, we would update the article in the database here
  return updatedArticle as News;
};

// Delete a news article
export const deleteNews = async (id: string): Promise<boolean> => {
  await delay(300);
  
  const articleIndex = newsData.findIndex(article => article.id === id);
  if (articleIndex === -1) {
    return false;
  }
  
  // In a real app, we would delete the article from the database here
  return true;
};

// Increment news views
export const incrementNewsViews = async (id: string): Promise<boolean> => {
  await delay(100);
  
  // In a real app, we would increment the view count in the database
  return true;
};

// Like a news article
export const likeNews = async (id: string, userId: string): Promise<boolean> => {
  await delay(200);
  
  // In a real app, we would save the like and increment the likes count
  return true;
};

// Unlike a news article
export const unlikeNews = async (id: string, userId: string): Promise<boolean> => {
  await delay(200);
  
  // In a real app, we would remove the like and decrement the likes count
  return true;
};

// Get recent news (for homepage)
export const getRecentNews = async (limit: number = 3): Promise<News[]> => {
  await delay(250);
  
  const recentNews = newsData
    .filter(article => article.is_published)
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
    .slice(0, limit);
  
  return recentNews.map(article => ({
    ...article,
    created_at: new Date(article.created_at),
    updated_at: article.updated_at ? new Date(article.updated_at) : undefined,
    published_at: article.published_at ? new Date(article.published_at) : undefined
  })) as News[];
};
