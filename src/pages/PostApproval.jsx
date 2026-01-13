import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, ChevronRight, ExternalLink, FileText,
  CreditCard, Building, Phone, User, Calendar,
  Gift, Award, ArrowRight, Star, Share2, Search,
  Filter, Clock, MapPin, Briefcase, FileCheck, AlertCircle
} from 'lucide-react'
import { useChecklistStore, useGlobalStore, useUserStore } from '../utils/enhancedStore'

const PostApproval = () => {
  const { 
    checklist, 
    toggleItem, 
    toggleSubtask, 
    getProgress, 
    getCompletedItems, 
    getPendingItems,
    milestones,
    getUpcomingMilestones
  } = useChecklistStore()
  
  const { addNotification } = useGlobalStore()
  const { user } = useUserStore()
  
  const [showCelebration, setShowCelebration] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCompleted, setShowCompleted] = useState(true)
  const [expandedItem, setExpandedItem] = useState(null)

  const progress = getProgress()
  const completedItems = getCompletedItems()
  const pendingItems = getPendingItems()
  const upcomingMilestones = getUpcomingMilestones()

  // Filter and search checklist items
  const filteredItems = useMemo(() => {
    let items = checklist
    
    // Filter by category
    if (filterCategory !== 'all') {
      items = items.filter(item => item.category === filterCategory)
    }
    
    // Filter by completion status
    if (!showCompleted) {
      items = items.filter(item => !item.completed)
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    }
    
    return items
  }, [checklist, filterCategory, showCompleted, searchQuery])

  // Categories for filter
  const categories = [
    { id: 'all', label: 'All Tasks', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'legal', label: 'Legal', icon: '⚖️' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'employment', label: 'Employment', icon: '💼' },
    { id: 'future', label: 'Future', icon: '🌟' }
  ]

  useEffect(() => {
    if (progress === 100 && completedItems.length > 0) {
      setShowCelebration(true)
      addNotification({
        type: 'success',
        title: 'All Tasks Completed!',
        message: 'Congratulations on completing your post-approval checklist!'
      })
    }
  }, [progress, completedItems.length, addNotification])

  const handleToggle = (id) => {
    toggleItem(id)
    
    // Show notification
    const item = checklist.find(i => i.id === id)
    if (item && !item.completed) {
      addNotification({
        type: 'success',
        title: 'Task Completed!',
        message: `Great job! "${item.title}" has been marked as complete.`
      })
    }
  }

  const handleToggleSubtask = (itemId, subtaskId) => {
    toggleSubtask(itemId, subtaskId)
  }

  const celebrationMessages = [
    '🎉 Congratulations! You\'ve completed all your post-approval tasks!',
    '🌟 Amazing work on your journey to permanent residency!',
    '🇺🇸 Welcome to the next chapter of your American dream!',
    '✨ You\'ve successfully navigated the immigration process!'
  ]

  // Get citizenship eligibility date
  const getCitizenshipDate = () => {
    const greenCardDate = new Date('2024-06-20') // Based on milestones
    const eligibilityDate = new Date(greenCardDate)
    eligibilityDate.setFullYear(eligibilityDate.getFullYear() + 5)
    return eligibilityDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="post-approval">
      {/* Page Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1>
          Post-Approval Support
        </motion.h1>
        <p>
          Welcome, {user.name}! Your guide to settling in as a new permanent resident. 
          Complete these tasks to establish your life in the U.S.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div 
        className="glass"
        style={{ 
          padding: 'var(--spacing-xl)', 
          marginBottom: 'var(--spacing-xl)',
          background: progress === 100 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
            : 'var(--glass-bg)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
          {/* Progress Circle */}
          <div style={{ 
            width: '120px', 
            height: '120px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle 
                cx="50" cy="50" r="45"
                fill="none"
                stroke="var(--glass-border)"
                strokeWidth="8"
              />
              <motion.circle 
                cx="50" cy="50" r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
                initial={{ strokeDasharray: '0 283' }}
                animate={{ strokeDasharray: `${progress * 2.83} 283` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ 
              position: 'absolute', 
              textAlign: 'center'
            }}>
              <motion.div 
                style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700',
                  background: progress === 100 ? 'var(--color-success)' : 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {progress}%
              </motion.div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete</div>
            </div>
          </div>

          {/* Progress Info */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {progress === 100 ? '🎉 All Tasks Completed!' : 'Your Settlement Checklist'}
            </motion.h2>
            <motion.p 
              style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {progress === 100 
                ? 'You\'ve successfully completed all post-approval tasks. Here\'s what you\'ve accomplished!'
                : `You've completed ${completedItems.length} of ${checklist.length} tasks. Keep going!`
              }
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                  {completedItems.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Completed</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-secondary)' }}>
                  {pendingItems.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Remaining</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-warning)' }}>
                  {upcomingMilestones.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Upcoming Milestones</div>
              </div>
            </motion.div>
          </div>

          {/* Success Badge */}
          {progress === 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
              style={{ 
                padding: 'var(--spacing-lg)',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}
            >
              <Award size={40} color="white" style={{ marginBottom: 'var(--spacing-sm)' }} />
              <div style={{ color: 'white', fontWeight: '600' }}>Success!</div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && progress === 100 && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              className="glass"
              style={{ 
                maxWidth: '500px', 
                padding: 'var(--spacing-2xl)',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Gift size={64} style={{ color: 'var(--color-success)', marginBottom: 'var(--spacing-lg)' }} />
              </motion.div>
              <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Congratulations!</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                {celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)'
              }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Star key={star} size={24} fill="#F59E0B" stroke="#F59E0B" />
                  </motion.div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="glass-button primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
                  <Share2 size={18} />
                  Share Success
                </button>
                <button className="glass-button" onClick={() => setShowCelebration(false)}>
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input 
              type="text"
              className="glass-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <motion.button
                key={category.id}
                className={`glass-button ${filterCategory === category.id ? 'primary' : ''}`}
                onClick={() => setFilterCategory(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
              >
                <span style={{ marginRight: '4px' }}>{category.icon}</span>
                {category.label}
              </motion.button>
            ))}
          </div>

          {/* Show/Hide Completed */}
          <motion.button
            className="glass-button"
            onClick={() => setShowCompleted(!showCompleted)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              background: showCompleted ? 'rgba(16, 185, 129, 0.2)' : undefined,
              borderColor: showCompleted ? 'var(--color-success)' : undefined
            }}
          >
            <Filter size={16} style={{ marginRight: '4px' }} />
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </motion.button>
        </div>
      </div>

      {/* Checklist */}
      <div className="checklist-container" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`checklist-item ${item.completed ? 'completed' : ''}`}
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              layout
            >
              <motion.div 
                className="checklist-checkbox"
                animate={{ 
                  backgroundColor: item.completed ? 'var(--color-success)' : 'transparent',
                  borderColor: item.completed ? 'var(--color-success)' : 'var(--glass-border)'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggle(item.id)
                }}
                whileTap={{ scale: 0.9 }}
              >
                {item.completed && <CheckCircle size={14} color="white" />}
              </motion.div>
              
              <div className="checklist-content" style={{ flex: 1 }}>
                <h4 style={{ 
                  textDecoration: item.completed ? 'line-through' : 'none',
                  opacity: item.completed ? 0.6 : 1
                }}>
                  {item.title}
                </h4>
                <p>{item.description}</p>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: 'var(--spacing-md)' }}
                    >
                      {/* Category & Priority */}
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                        <span style={{ 
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          background: 'var(--bg-glass)',
                          borderRadius: 'var(--radius-sm)',
                          textTransform: 'capitalize'
                        }}>
                          {item.category}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          background: item.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
                                      item.priority === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          borderRadius: 'var(--radius-sm)',
                          color: item.priority === 'high' ? 'var(--color-danger)' :
                                 item.priority === 'medium' ? 'var(--color-warning)' : 'var(--color-success)',
                          textTransform: 'capitalize'
                        }}>
                          {item.priority} priority
                        </span>
                      </div>

                      {/* Subtasks */}
                      {item.subtasks && item.subtasks.length > 0 && (
                        <div style={{ marginTop: 'var(--spacing-sm)' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                            Subtasks:
                          </div>
                          {item.subtasks.map(subtask => (
                            <motion.div
                              key={subtask.id}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 'var(--spacing-sm)',
                                padding: '4px 0',
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleSubtask(item.id, subtask.id)
                              }}
                            >
                              <motion.div 
                                style={{ 
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '4px',
                                  border: `2px solid ${subtask.completed ? 'var(--color-success)' : 'var(--glass-border)'}`,
                                  background: subtask.completed ? 'var(--color-success)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {subtask.completed && <CheckCircle size={10} color="white" />}
                              </motion.div>
                              <span style={{ 
                                textDecoration: subtask.completed ? 'line-through' : 'none',
                                opacity: subtask.completed ? 0.6 : 1,
                                fontSize: '0.875rem'
                              }}>
                                {subtask.title}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Completed Date */}
                      {item.completedAt && (
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          marginTop: 'var(--spacing-sm)'
                        }}>
                          Completed on {new Date(item.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resource Link */}
              {item.resource && (
                <a 
                  href={item.resource} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-button"
                  style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                  <span style={{ marginLeft: '4px' }}>{item.resourceLabel || 'Link'}</span>
                </a>
              )}

              {/* Expand/Collapse Indicator */}
              <motion.div
                animate={{ rotate: expandedItem === item.id ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.div
            className="glass"
            style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>
              No tasks match your current filters. Try adjusting your search or filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* Additional Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        {[
          {
            icon: User,
            title: 'Social Security',
            desc: 'Apply for or replace your SSN card',
            action: 'Apply Now',
            color: '#3B82F6'
          },
          {
            icon: Building,
            title: "Driver's License",
            desc: 'Update your state ID or driver\'s license',
            action: 'Find DMV',
            color: '#8B5CF6'
          },
          {
            icon: CreditCard,
            title: 'Banking',
            desc: 'Establish credit history in the U.S.',
            action: 'Learn More',
            color: '#14B8A6'
          }
        ].map((resource, index) => (
          <motion.div
            key={index}
            className="glass"
            style={{ padding: 'var(--spacing-xl)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div style={{ 
              width: '48px', 
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: `${resource.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--spacing-md)'
            }}>
              <resource.icon size={24} style={{ color: resource.color }} />
            </div>
            <h3>{resource.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>{resource.desc}</p>
            <button className="glass-button" style={{ width: '100%' }}>
              {resource.action}
              <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Timeline to Citizenship */}
      <motion.div 
        className="glass" 
        style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <Award size={20} style={{ color: 'var(--color-secondary)' }} />
          Your Path to U.S. Citizenship
        </h3>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          position: 'relative',
          marginBottom: 'var(--spacing-xl)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)'
        }}>
          <div style={{ 
            position: 'absolute',
            top: '20px',
            left: '40px',
            right: '40px',
            height: '4px',
            background: 'var(--glass-border)',
            zIndex: 0
          }} />
            
          {[
            { stage: 'Green Card', status: 'completed', date: '2024' },
            { stage: '1 Year', status: 'progress', date: '2025' },
            { stage: '3 Years', status: 'pending', date: '2027' },
            { stage: '5 Years', status: 'pending', date: '2029' },
            { stage: 'Citizenship', status: 'pending', date: '2029+' }
          ].map((step, index) => (
            <div key={index} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div
                style={{ 
                  width: '40px', 
                  height: '40px',
                  borderRadius: '50%',
                  background: step.status === 'completed' 
                    ? 'var(--color-success)'
                    : step.status === 'progress'
                    ? 'var(--gradient-primary)'
                    : 'var(--bg-dark)',
                  border: `3px solid ${step.status === 'pending' ? 'var(--glass-border)' : 'transparent'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-sm)',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.1 }}
              >
                {step.status === 'completed' && <CheckCircle size={20} color="white" />}
                {step.status === 'progress' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }}
                  />
                )}
              </motion.div>
              <div style={{ fontWeight: '500', marginBottom: '2px', fontSize: '0.875rem' }}>{step.stage}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{step.date}</div>
            </div>
          ))}
        </div>

        <div style={{ 
          padding: 'var(--spacing-md)',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap'
        }}>
          <Calendar size={20} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600' }}>Naturalization Timeline</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              You may be eligible for citizenship on <strong>{getCitizenshipDate()}</strong> (5 years of continuous residence)
            </div>
          </div>
          <button className="glass-button" style={{ marginLeft: 'auto' }}>
            Plan Ahead
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Community & Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Helpful Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[
              { name: 'USCIS Green Card Guide', url: '#' },
              { name: 'Social Security Administration', url: '#' },
              { name: 'IRS Tax Obligations', url: '#' },
              { name: 'DMV Directory', url: '#' },
              { name: 'U.S. Passport Services', url: '#' }
            ].map((resource, index) => (
              <motion.div 
                key={index}
                whileHover={{ x: 4 }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <FileText size={16} style={{ color: 'var(--color-secondary)' }} />
                  <span>{resource.name}</span>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            {[
              { icon: FileCheck, label: 'Download Card', color: '#3B82F6' },
              { icon: Calendar, label: 'Set Reminders', color: '#8B5CF6' },
              { icon: Phone, label: 'Contact USCIS', color: '#EC4899' },
              { icon: MapPin, label: 'Update Address', color: '#14B8A6' }
            ].map((action, index) => (
              <motion.button
                key={index}
                className="glass-button"
                style={{ 
                  flexDirection: 'column',
                  padding: 'var(--spacing-lg)',
                  height: 'auto',
                  background: `${action.color}10`,
                  borderColor: `${action.color}30`
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <action.icon size={28} style={{ color: action.color, marginBottom: 'var(--spacing-sm)' }} />
                <span style={{ fontSize: '0.875rem' }}>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Milestones */}
      {upcomingMilestones.length > 0 && (
        <motion.div 
          className="glass" 
          style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Clock size={20} style={{ color: 'var(--color-warning)' }} />
            Upcoming Milestones
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {upcomingMilestones.slice(0, 3).map((milestone, index) => (
              <motion.div
                key={milestone.id}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={20} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{milestone.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {new Date(milestone.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div 
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
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
          <User size={40} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3>Need Personal Assistance?</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Connect with an immigration specialist for personalized guidance on your post-approval journey.
          </p>
        </div>
        <button className="glass-button primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
          Schedule Consultation
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  )
}

export default PostApproval
