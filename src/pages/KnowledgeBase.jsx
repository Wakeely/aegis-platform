import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Search, ChevronDown, ChevronUp, FileText,
  Clock, ExternalLink, Star, Filter, ThumbsUp, ThumbsDown,
  HelpCircle, MessageCircle, Brain, TrendingUp, Eye, Sparkles
} from 'lucide-react'
import { useKnowledgeStore, useGlobalStore, useUserStore } from '../utils/enhancedStore'

const KnowledgeBase = () => {
  const {
    articles,
    categories,
    searchQuery,
    selectedCategory,
    readingHistory,
    searchArticles,
    setSearchQuery,
    setSelectedCategory,
    markAsRead,
    rateArticle,
    incrementViews,
    getPopularArticles,
    getRecentArticles
  } = useKnowledgeStore()

  const { addNotification, openModal } = useGlobalStore()
  const { user } = useUserStore()

  const [expandedArticle, setExpandedArticle] = useState(null)
  const [feedbackGiven, setFeedbackGiven] = useState(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let results = searchQuery ? searchArticles(searchQuery) : articles

    if (selectedCategory !== 'all') {
      results = results.filter(a => a.category === selectedCategory)
    }

    return results
  }, [articles, searchQuery, selectedCategory, searchArticles])

  // Get recommendations based on user status
  const recommendations = useMemo(() => {
    const userCategory = user.currentStatus?.includes('H-1B') ? 'visas' :
                         user.currentStatus?.includes('green') ? 'green-card' :
                         user.currentStatus?.includes('citizen') ? 'citizenship' : 'all'

    return articles
      .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
      .sort((a, b) => b.views - a.views)
      .slice(0, 3)
  }, [articles, selectedCategory, user.currentStatus])

  // Handle article click
  const handleArticleClick = useCallback((article) => {
    incrementViews(article.id)
    markAsRead(article.id)
    setExpandedArticle(expandedArticle === article.id ? null : article.id)
  }, [expandedArticle, incrementViews, markAsRead])

  // Handle feedback
  const handleFeedback = useCallback((articleId, helpful) => {
    rateArticle(articleId, helpful)
    setFeedbackGiven({ articleId, helpful })
    addNotification({
      type: 'success',
      title: 'Feedback Received',
      message: 'Thank you for helping us improve our content!'
    })
  }, [rateArticle, addNotification])

  // Quick search chips
  const quickChips = useMemo(() => [
    { label: 'Green card process', query: 'green card', icon: '📋' },
    { label: 'H-1B extension', query: 'H-1B', icon: '💼' },
    { label: 'Citizenship test', query: 'citizenship', icon: '🇺🇸' },
    { label: 'Marriage docs', query: 'marriage', icon: '💍' },
    { label: 'Travel outside US', query: 'travel', icon: '✈️' },
    { label: 'Processing times', query: 'timeline', icon: '⏰' }
  ], [])

  // Get stats
  const stats = useMemo(() => {
    const totalViews = articles.reduce((acc, a) => acc + a.views, 0)
    const totalHelpful = articles.reduce((acc, a) => acc + a.helpful, 0)
    const articlesRead = readingHistory.length

    return { totalViews, totalHelpful, articlesRead }
  }, [articles, readingHistory])

  return (
    <div className="knowledge-base">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={24} color="white" />
          </div>
          Knowledge Base
        </motion.h1>
        <p>Access comprehensive immigration guides, resources, and expert answers to your questions.</p>

        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-lg)',
          marginTop: 'var(--spacing-lg)',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: FileText, label: 'Articles', value: articles.length, color: 'var(--color-secondary)' },
            { icon: Eye, label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'var(--color-accent)' },
            { icon: TrendingUp, label: 'Helpful Votes', value: stats.totalHelpful.toLocaleString(), color: 'var(--color-success)' },
            { icon: Brain, label: 'Read by You', value: stats.articlesRead, color: 'var(--color-warning)' }
          ].map((stat, index) => (
            <div key={index} className="glass-card" style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flex: 1,
              minWidth: '140px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: `${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-lg)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <h4 style={{ margin: 0 }}>AI-Powered Recommendations</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Based on your {user.currentStatus || 'immigration'} status, we think these articles will help
            </p>
          </div>
        </div>
        <button
          className="glass-button primary"
          onClick={() => setShowAISuggestions(!showAISuggestions)}
        >
          <Brain size={18} />
          {showAISuggestions ? 'Hide' : 'View'} Recommendations
        </button>
      </motion.div>

      {/* AI Suggestions Modal */}
      <AnimatePresence>
        {showAISuggestions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAISuggestions(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--spacing-xl)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-dark-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-2xl)',
                maxWidth: '700px',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={28} color="white" />
                </div>
                <div>
                  <h2>Personalized Recommendations</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Curated based on your profile: {user.currentStatus || 'General Immigration'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {recommendations.map((article, index) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ x: 4 }}
                    style={{
                      padding: 'var(--spacing-lg)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)'
                    }}
                    onClick={() => {
                      setShowAISuggestions(false)
                      handleArticleClick(article)
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--gradient-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0 }}>{article.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {article.excerpt.substring(0, 80)}...
                      </p>
                    </div>
                    <span className="chip" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'var(--color-secondary)' }}>
                      {article.readTime} min read
                    </span>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-xl)' }}>
                <button className="glass-button" onClick={() => setShowAISuggestions(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="kb-search">
        <Search size={24} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="glass-input"
          placeholder="Search for immigration topics, forms, or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '56px' }}
        />
        {searchQuery && (
          <button
            className="glass-button"
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 'var(--spacing-md)',
              padding: 'var(--spacing-xs) var(--spacing-sm)'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Chips */}
      <div className="quick-chips">
        {quickChips.map((chip, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`chip ${searchQuery === chip.query ? 'primary' : ''}`}
            onClick={() => setSearchQuery(chip.query)}
          >
            <span style={{ marginRight: '4px' }}>{chip.icon}</span>
            {chip.label}
          </motion.button>
        ))}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
        {categories.map(cat => {
          const count = cat.slug === 'all'
            ? articles.length
            : articles.filter(a => a.category === cat.slug).length

          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`glass-button ${selectedCategory === cat.id ? 'primary' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
            >
              <cat.icon size={16} />
              {cat.label}
              <span style={{
                marginLeft: 'var(--spacing-xs)',
                padding: '2px 6px',
                background: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem'
              }}>
                {count}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="glass" style={{
          padding: 'var(--spacing-2xl)',
          textAlign: 'center',
          gridColumn: '1 / -1'
        }}>
          <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
          <h3>No articles found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Try adjusting your search or filter criteria
          </p>
          <button className="glass-button primary" onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
          }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
          {filteredArticles.map((article, index) => {
            const isRead = readingHistory.includes(article.id)
            const helpfulness = article.helpful - article.notHelpful

            return (
              <motion.div
                key={article.id}
                className={`glass kb-article ${expandedArticle === article.id ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleArticleClick(article)}
                style={{
                  cursor: 'pointer',
                  border: isRead ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--glass-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-secondary)',
                    textTransform: 'capitalize'
                  }}>
                    {article.category.replace('-', ' ')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    {isRead && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-success)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Eye size={12} />
                        Read
                      </span>
                    )}
                    {expandedArticle === article.id ? (
                      <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                </div>

                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{article.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem' }}>
                  {article.excerpt}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {article.readTime} min
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={14} />
                      {article.views.toLocaleString()} views
                    </span>
                  </div>
                  <span style={{
                    color: helpfulness > 100 ? 'var(--color-success)' : helpfulness > 0 ? 'var(--color-warning)' : 'var(--color-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ThumbsUp size={14} />
                    +{article.helpful}
                  </span>
                </div>

                <AnimatePresence>
                  {expandedArticle === article.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: 'var(--spacing-lg)',
                        paddingTop: 'var(--spacing-lg)',
                        borderTop: '1px solid var(--glass-border)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.8,
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {article.content}
                      </div>

                      {/* Tags */}
                      <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                          {article.tags?.map(tag => (
                            <span
                              key={tag}
                              className="chip"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSearchQuery(tag)
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Feedback */}
                      <div style={{
                        marginTop: 'var(--spacing-lg)',
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 'var(--spacing-md)'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Was this article helpful?
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`glass-button ${feedbackGiven?.articleId === article.id && feedbackGiven.helpful ? 'primary' : ''}`}
                            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFeedback(article.id, true)
                            }}
                          >
                            <ThumbsUp size={14} />
                            {article.helpful}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`glass-button ${feedbackGiven?.articleId === article.id && !feedbackGiven.helpful ? 'primary' : ''}`}
                            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFeedback(article.id, false)
                            }}
                          >
                            <ThumbsDown size={14} />
                            {article.notHelpful}
                          </motion.button>
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div style={{
                        marginTop: 'var(--spacing-md)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)'
                      }}>
                        <Clock size={12} />
                        Last updated: {new Date(article.lastUpdated).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* FAQ Section */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <HelpCircle size={20} style={{ color: 'var(--color-secondary)' }} />
          Frequently Asked Questions
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
          {[
            { q: 'How long does it take to get a green card?', a: 'Processing times vary by category, but typically range from 6 months to 2+ years depending on the specific path and current workload.' },
            { q: 'Can I travel while my I-485 is pending?', a: 'Generally yes, but you may need an Advance Parole document. Consult with an attorney before any international travel.' },
            { q: 'What happens if my I-485 is denied?', a: 'You will receive a written explanation. You may appeal the decision or file a motion to reopen/reconsider within 30 days.' },
            { q: 'Do I need a lawyer to file for immigration?', a: 'No, you can file on your own (pro se). However, complex cases benefit from legal representation.' }
          ].map((faq, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -2 }}
              style={{
                padding: 'var(--spacing-md)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
              onClick={() => addNotification({
                type: 'info',
                title: faq.q,
                message: faq.a
              })}
            >
              <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>{faq.q}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                {faq.a.substring(0, 80)}...
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Chat CTA */}
      <motion.div
        whileHover={{ y: -4 }}
        style={{
          marginTop: 'var(--spacing-xl)',
          padding: 'var(--spacing-xl)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xl)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <MessageCircle size={40} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Can't find what you're looking for?</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Chat with AEGIS AI for personalized answers to your specific immigration questions.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-button primary"
          style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}
          onClick={() => addNotification({
            type: 'info',
            title: 'Chat Feature',
            message: 'Navigate to the Dashboard to start a chat with AEGIS AI.'
          })}
        >
          <MessageCircle size={18} />
          Start Chat
        </motion.button>
      </motion.div>
    </div>
  )
}

export default KnowledgeBase
