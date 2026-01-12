import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, ChevronRight, ExternalLink, FileText,
  CreditCard, Building, Phone, User, Calendar,
  Gift, Award, ArrowRight, Star, Share2
} from 'lucide-react'
import { useChecklistStore } from '../utils/store'

const PostApproval = () => {
  const { checklist, toggleItem, getProgress } = useChecklistStore()
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedItems, setCompletedItems] = useState(0)

  const progress = getProgress()

  useEffect(() => {
    if (progress === 100) {
      setShowCelebration(true)
    }
  }, [progress])

  useEffect(() => {
    setCompletedItems(checklist.filter(item => item.completed).length)
  }, [checklist])

  const handleToggle = (id) => {
    toggleItem(id)
  }

  const celebrationMessages = [
    '🎉 Congratulations! You\'ve completed all your post-approval tasks!',
    '🌟 Amazing work on your journey to permanent residency!',
    '🇺🇸 Welcome to the next chapter of your American dream!',
    '✨ You\'ve successfully navigated the immigration process!'
  ]

  return (
    <div className="post-approval">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Post-Approval Support
        </motion.h1>
        <p>Your guide to settling in as a new permanent resident. Complete these tasks to establish your life in the U.S.</p>
      </div>

      {/* Progress Overview */}
      <div className="glass" style={{ 
        padding: 'var(--spacing-xl)', 
        marginBottom: 'var(--spacing-xl)',
        background: progress === 100 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
          : 'var(--glass-bg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
          <div style={{ 
            width: '120px', 
            height: '120px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
              <div style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700',
                background: progress === 100 ? 'var(--color-success)' : 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {progress}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h2>{progress === 100 ? '🎉 All Tasks Completed!' : 'Your Settlement Checklist'}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
              {progress === 100 
                ? 'You\'ve successfully completed all post-approval tasks. Here\'s what you\'ve accomplished!'
                : `You've completed ${completedItems} of ${checklist.length} tasks. Keep going!`
              }
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                  {completedItems}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Completed</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  {checklist.length - completedItems}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Remaining</div>
              </div>
            </div>
          </div>

          {progress === 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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
      </div>

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
                  <Star key={star} size={24} fill="#F59E0B" stroke="#F59E0B" />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
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

      {/* Checklist */}
      <div className="checklist-container" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {checklist.map((item, index) => (
          <motion.div
            key={item.id}
            className={`checklist-item ${item.completed ? 'completed' : ''}`}
            onClick={() => handleToggle(item.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <motion.div 
              className="checklist-checkbox"
              animate={{ 
                backgroundColor: item.completed ? 'var(--color-success)' : 'transparent',
                borderColor: item.completed ? 'var(--color-success)' : 'var(--glass-border)'
              }}
            >
              {item.completed && <CheckCircle size={14} color="white" />}
            </motion.div>
            <div className="checklist-content">
              <h4 style={{ 
                textDecoration: item.completed ? 'line-through' : 'none',
                opacity: item.completed ? 0.6 : 1
              }}>
                {item.title}
              </h4>
              <p>{item.description}</p>
            </div>
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
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Additional Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
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
            title: 'Driver\'s License',
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
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <Award size={20} style={{ color: 'var(--color-secondary)' }} />
          Your Path to U.S. Citizenship
        </h3>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          position: 'relative',
          marginBottom: 'var(--spacing-xl)'
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
                {step.status === 'progress' && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }} />}
              </motion.div>
              <div style={{ fontWeight: '500', marginBottom: '2px' }}>{step.stage}</div>
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
          gap: 'var(--spacing-md)'
        }}>
          <Calendar size={20} style={{ color: 'var(--color-secondary)' }} />
          <div>
            <div style={{ fontWeight: '600' }}>Naturalization Timeline</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              You may be eligible for citizenship on <strong>January 15, 2029</strong> (5 years of continuous residence)
            </div>
          </div>
          <button className="glass-button" style={{ marginLeft: 'auto' }}>
            Plan Ahead
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Community & Resources */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
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
              <div 
                key={index}
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
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            {[
              { icon: FileText, label: 'Download Card', color: '#3B82F6' },
              { icon: Calendar, label: 'Set Reminders', color: '#8B5CF6' },
              { icon: Phone, label: 'Contact USCIS', color: '#EC4899' },
              { icon: User, label: 'Update Address', color: '#14B8A6' }
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

      {/* CTA */}
      <div style={{ 
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-xl)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xl)'
      }}>
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
        <div style={{ flex: 1 }}>
          <h3>Need Personal Assistance?</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Connect with an immigration specialist for personalized guidance on your post-approval journey.
          </p>
        </div>
        <button className="glass-button primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
          Schedule Consultation
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default PostApproval
