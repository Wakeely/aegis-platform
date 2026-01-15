import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Shield, FileText, Clock, CheckCircle, AlertCircle, 
  TrendingUp, Calendar, Users, BookOpen, ChevronRight,
  Bot, Zap, Target, BarChart3, Activity, Briefcase, AlertTriangle
} from 'lucide-react'
import { 
  useCaseStore, 
  useUserStore, 
  useDocumentStore, 
  useChecklistStore,
  useGlobalStore,
  useEligibilityStore
} from '../utils/enhancedStore'

const Dashboard = () => {
  const { user } = useUserStore()
  const { cases, getUpcomingDeadlines } = useCaseStore()
  const { documents } = useDocumentStore()
  const { checklist, getProgress } = useChecklistStore()
  const { addNotification } = useGlobalStore()
  const { results: eligibilityResults } = useEligibilityStore()
  
  // Live activity feed state
  const [activities, setActivities] = useState([])
  const [aiInsights, setAiInsights] = useState([])
  
  // Simulate real-time updates
  useEffect(() => {
    // Initial activities based on case data
    const initialActivities = [
      { 
        id: 1,
        type: 'case_update',
        title: 'Interview Scheduled',
        description: `Your ${cases[0]?.type || 'I-485'} interview has been scheduled for January 10, 2025`,
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: 'calendar',
        priority: 'info'
      },
      { 
        id: 2,
        type: 'document',
        title: 'Document Verified',
        description: 'Your marriage certificate has been verified and uploaded',
        time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        icon: 'check-circle',
        priority: 'success'
      },
      { 
        id: 3,
        type: 'alert',
        title: 'Action Required',
        description: 'Please update your employment letter for I-485',
        time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        icon: 'alert-circle',
        priority: 'warning'
      }
    ]
    setActivities(initialActivities)
    
    // AI Insights based on recent changes
    const insights = [
      {
        id: 1,
        title: 'Eligibility Assessment Updated',
        description: 'Your recent assessment shows strong potential for expedited processing',
        category: 'eligibility',
        actionItems: ['Review recommended documents', 'Schedule consultation'],
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Document Readiness Check',
        description: 'You are 75% complete with required document collection',
        category: 'documents',
        actionItems: ['Upload birth certificate', 'Add police certificates'],
        timestamp: new Date().toISOString()
      }
    ]
    setAiInsights(insights)
  }, [cases])
  
  // Calculate dynamic stats
  const activeCases = cases.filter(c => c.status !== 'approved' && c.status !== 'rejected')
  const pendingDocuments = documents.filter(d => d.status === 'pending' || d.status === 'uploading')
  const completedTasks = checklist.filter(c => c.completed).length
  
  // Get real upcoming deadlines
  const upcomingDeadlines = getUpcomingDeadlines()

  // Live processing timeline
  const stats = [
    { 
      label: 'Active Cases', 
      value: activeCases.length,
      icon: FileText,
      change: `${activeCases.filter(c => c.priority === 'high').length} high priority`,
      positive: true,
      trend: 'up'
    },
    { 
      label: 'Days to Decision', 
      value: cases[0]?.estimatedCompletion 
        ? Math.ceil((new Date(cases[0].estimatedCompletion) - new Date()) / (1000 * 60 * 60 * 24))
        : 'N/A',
      icon: Clock,
      change: 'On track',
      positive: true,
      trend: 'stable'
    },
    { 
      label: 'Documents Ready', 
      value: documents.filter(d => d.status === 'verified').length,
      icon: CheckCircle,
      change: `${pendingDocuments.length} pending upload`,
      positive: pendingDocuments.length === 0,
      trend: pendingDocuments.length === 0 ? 'up' : 'down'
    },
    { 
      label: 'Eligibility Score', 
      value: eligibilityResults[0]?.overallScore 
        ? `${eligibilityResults[0].overallScore}%`
        : '88%',
      icon: TrendingUp,
      change: eligibilityResults[0]?.recommendation || 'Good standing',
      positive: true,
      trend: 'up'
    }
  ]

  const quickActions = [
    { label: 'Check Eligibility', icon: Target, path: '/eligibility', color: '#3B82F6', action: 'assess' },
    { label: 'Upload Documents', icon: FileText, path: '/documents', color: '#8B5CF6', action: 'upload' },
    { label: 'Track Cases', icon: BarChart3, path: '/cases', color: '#EC4899', action: 'track' },
    { label: 'Prepare Interview', icon: Users, path: '/interview', color: '#14B8A6', action: 'practice' }
  ]

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const getActivityIcon = (iconName) => {
    switch (iconName) {
      case 'calendar': return Calendar
      case 'check-circle': return CheckCircle
      case 'alert-circle': return AlertCircle
      case 'file-plus': return FileText
      default: return Activity
    }
  }

  const getActivityColor = (priority) => {
    switch (priority) {
      case 'success': return 'var(--color-success)'
      case 'warning': return 'var(--color-warning)'
      case 'danger': return 'var(--color-danger)'
      default: return 'var(--color-secondary)'
    }
  }

  const navigate = useNavigate()

  const handleQuickAction = (action, path) => {
    addNotification({
      type: 'info',
      title: 'Navigating',
      message: `Opening ${path.replace('/', '')} module...`
    })
    navigate(path)
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome back, {user.name.split(' ')[0]}
        </motion.h1>
        <p>Here's your immigration journey overview. AEGIS is here to guide you every step of the way.</p>
      </div>

      {/* Live Status Banner */}
      <motion.div 
        className="glass"
        style={{ 
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)'
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'var(--color-success)',
          boxShadow: '0 0 20px var(--color-success)',
          animation: 'pulse 2s infinite'
        }} />
        <span style={{ fontWeight: '500' }}>AEGIS AI is actively monitoring your case</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>|</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Last update: {new Date().toLocaleTimeString()}
        </span>
      </motion.div>

      {/* Stats Grid */}
      <div className="dashboard-grid four-col" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
          >
            <div className="stat-icon" style={{ 
              background: `${stat.positive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`,
              color: stat.positive ? 'var(--color-success)' : 'var(--color-warning)'
            }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.positive ? <TrendingUp size={14} /> : <AlertTriangle size={14} />}
              {stat.change}
            </div>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              fontSize: '12px',
              color: stat.trend === 'up' ? 'var(--color-success)' : stat.trend === 'down' ? 'var(--color-danger)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        {/* Quick Actions */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)' }}>
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                className="glass-button"
                style={{ 
                  flexDirection: 'column',
                  padding: 'var(--spacing-lg)',
                  height: 'auto',
                  background: `${action.color}15`,
                  borderColor: `${action.color}30`
                }}
                whileHover={{ scale: 1.02, background: `${action.color}25` }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickAction(action.action, action.path)}
              >
                <action.icon size={32} style={{ color: action.color, marginBottom: 'var(--spacing-sm)' }} />
                <span style={{ fontSize: '0.875rem', textAlign: 'center' }}>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Your Progress</h3>
          
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Overall Completion</span>
              <span style={{ fontWeight: '600' }}>{getProgress()}%</span>
            </div>
            <div style={{ 
              height: '8px', 
              background: 'var(--bg-glass)', 
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <motion.div
                style={{ 
                  height: '100%', 
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[
              { label: 'Documents', value: documents.filter(d => d.status === 'verified').length, total: 12, color: '#3B82F6' },
              { label: 'Forms', value: 3, total: 5, color: '#8B5CF6' },
              { label: 'Checklist', value: completedTasks, total: checklist.length, color: '#14B8A6' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: 'var(--radius-md)',
                  background: `${item.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: item.color }}>
                    {item.value}/{item.total}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{item.label}</div>
                  <div style={{ 
                    height: '4px', 
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-full)',
                    marginTop: '4px'
                  }}>
                    <motion.div style={{ 
                      height: '100%', 
                      width: '0%',
                      background: item.color,
                      borderRadius: 'var(--radius-full)'
                    }}
                      animate={{ width: `${Math.min((item.value / item.total) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
        {/* Live Activity Feed */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h3>Live Activity Feed</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-success)',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>Live</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {activities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.icon)
              return (
                <motion.div
                  key={activity.id}
                  style={{ 
                    display: 'flex', 
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer'
                  }}
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: `${getActivityColor(activity.priority)}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComponent 
                      size={20} 
                      style={{ color: getActivityColor(activity.priority) }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', marginBottom: '2px' }}>{activity.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{activity.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{formatTime(activity.time)}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h3>AI Insights</h3>
            <button className="glass-button" style={{ padding: 'var(--spacing-xs) var(--spacing-md)', fontSize: '0.875rem' }}>
              View All
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                style={{ 
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  borderLeft: '3px solid var(--color-secondary)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                  <Bot size={18} style={{ color: 'var(--color-secondary)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>
                    {insight.category}
                  </span>
                </div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>{insight.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                  {insight.description}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                  {insight.actionItems.map((item, i) => (
                    <span key={i} style={{
                      padding: '2px 8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--color-secondary)'
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Agent Status */}
          <div style={{ 
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <Bot size={24} style={{ color: 'var(--color-secondary)' }} />
              <div>
                <div style={{ fontWeight: '600' }}>AEGIS AI Assistant</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>9 Specialist Agents Available</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
              {['Navigator', 'Scribe', 'Oracle', 'Guardian', 'Mentor'].map(agent => (
                <span key={agent} style={{ 
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  color: 'var(--color-success)'
                }}>
                  {agent} ●
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
