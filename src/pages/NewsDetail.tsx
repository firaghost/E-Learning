import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { News } from '../types/News';
import { getNewsById, incrementNewsViews, likeNews, unlikeNews } from '../services/newsService';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);


  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        const articleData = await getNewsById(id);
        if (articleData) {
          setArticle(articleData);
          setLikesCount(articleData.likes);
          // Increment view count
          await incrementNewsViews(id);
        } else {
          navigate('/news');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        navigate('/news');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user || !article) return;

    try {
      if (liked) {
        await unlikeNews(article.id);
        setLikesCount(prev => prev - 1);
        setLiked(false);
      } else {
        await likeNews(article.id);
        setLikesCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ethiopia-green"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <Link to="/news" className="text-ethiopia-green hover:underline">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/news"
            className="inline-flex items-center text-ethiopia-green dark:text-ethiopia-yellow hover:underline"
          >
⬅️
            Back to News
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-ethiopia-green/10 text-ethiopia-green dark:bg-ethiopia-yellow/10 dark:text-ethiopia-yellow">
              {article.category === 'Partnership' ? '🤝' : 
               article.category === 'Product Update' ? '📱' : 
               article.category === 'Education' ? '🧠' :
               article.category === 'Success Story' ? '⭐' :
               article.category === 'Community' ? '👥' : '💡'}
              {article.category}
            </span>
            {article.is_featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-ethiopia-yellow/10 text-ethiopia-yellow">
⭐
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow rounded-full flex items-center justify-center text-white font-bold">
                {article.author_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{article.author_name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{article.published_at?.toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
👁️
                    {article.views} views
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? 'bg-ethiopia-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  ❤️
                  {likesCount}
                </button>
              )}
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
🔗
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          {article.thumbnail_url && (
            <div className="mb-8">
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            More from {article.category}
          </h2>
          
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Discover more articles in this category
            </p>
            <Link
              to={`/news?category=${encodeURIComponent(article.category)}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-ethiopia-green to-ethiopia-yellow text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Browse {article.category} Articles
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsDetail;
