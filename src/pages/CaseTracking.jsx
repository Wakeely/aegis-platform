import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Clock, CheckCircle, AlertCircle, ChevronRight,
  FileText, Calendar, Target, RefreshCw, ExternalLink,
  BarChart3, TrendingUp, AlertTriangle, Loader2, MessageSquare
} from 'lucide-react'
import { 
  useCaseStore,
  useGlobalStore 
} from '../utils/enhancedStore'

const CaseTracking = () => {
  const { 
    cases, 
    updateCaseStatus,
    addNote,
    getCaseById,
    getUpcomingDeadlines 
  } = useCaseStore()
  const { addNotification } = useGlobalStore()
  
  const [selectedCase, setSelectedCase] = useState(cases[0])
  const [activeTab, setActiveTab] = useState('timeline')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [processingTimes, setProcessingTimes] = useState([])

  // Simulate fetching real-time processing times
  useEffect(() => {
    setProcessingTimes([
      { form: 'I-485', category: 'Adjustment of Status', time: '8-14 months', trend: '↓ 2 months', updated: '2024-12-01' },
      { form: 'I-130', category: 'Family Petition', time: '6-12 months', trend: '→ Stable', updated: '2024-12-01' },
      { form: 'I-765', category: 'Work Authorization', time: '2-5 months', trend: '↓ 1 month', updated: '2024-12-01' },
      { form: 'N-400', category: 'Naturalization', time: '6-12 months', trend: '↑ 1 month', updated: '2024-12-01' }
    ])
  }, [])

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'approved': return 'var(--color-success)'
      case 'interview': return 'var(--color-secondary)'
      case 'pending': return 'var(--color-warning)'
      case 'rfe': return 'var(--color-danger)'
      default: return 'var(--text-muted)'
    }
  }, [])

  const getStatusLabel = useCallback((status) => {
    switch (status) {
      case 'approved': return 'Approved'
      case 'interview': return 'Interview Scheduled'
      case 'pending': return 'Pending Review'
      case 'rfe': return 'Request for Evidence'
      default: return status
    }
  }, [])

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'interview': return Calendar
      case 'pending': return Clock
      case 'rfe': return AlertTriangle
      default: return FileText
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsRefreshing(false)
    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: 'Your case information has been refreshed.'
    })
  }, [addNotification])

  const handleAddNote = useCallback(() => {
    if (newNote.trim() && selectedCase) {
      addNote(selectedCase.id, newNote)
      setNewNote('')
      setShowAddNote(false)
      addNotification({
        type: 'success',
        title: 'Note Added',
        message: 'Your note has been saved.'
      })
    }
  }, [newNote, selectedCase, addNote, addNotification])

  const getTimelineIcon = useCallback((type) => {
    switch (type) {
      case 'submitted': return FileText
      case 'received': return CheckCircle
      case 'notice': return Calendar
      case 'milestone': return Target
      case 'interview': return Calendar
      case 'rfe': return AlertTriangle
      case 'approved': return CheckCircle
      default: return RefreshCw
    }
  }, [])

  const activeCases = cases.filter(c => c.status !== 'approved')
  const upcomingDeadlines = getUpcomingDeadlines()

  return (
    <div className="case-tracking">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Case Tracking Dashboard
        </motion.h1>
        <p>Monitor your immigration cases in real-time with AI-powered insights and predictive analytics.</p>
      </div>

      {/* Live Status Banner */}
      <motion.div 
        className="glass"
        style={{ 
          padding: 'var(--spacing-md) var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--color-success)',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ fontWeight: '500' }}>Live Updates Active</span>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Last synced: {new Date().toLocaleTimeString()}
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="dashboard-grid four-col" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {[
          { label: 'Active Cases', value: activeCases.length, icon: FileText, color: 'var(--color-secondary)' },
          { label: 'Completed', value: cases.filter(c => c.status === 'approved').length, icon: CheckCircle, color: 'var(--color-success)' },
          { label: 'Days to Decision', value: selectedCase?.estimatedCompletion 
            ? Math.max(0, Math.ceil((new Date(selectedCase.estimatedCompletion) - new Date()) / (1000 * 60 * 60 * 24)))
            : 'N/A', 
            icon: Clock, color: 'var(--color-warning)' 
          },
          { label: 'Next Milestone', value: selectedCase?.milestones.find(m => !m.completed)?.name || 'N/A', icon: Target, color: 'var(--color-accent)' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="stat-icon" style={{ background: `${stat.color}20` }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Case List and Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-xl)' }}>
        {/* Case List */}
        <div className="glass" style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <FileText size={20} />
              Your Cases
            </h3>
            <motion.button
              className="glass-button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            </motion.button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {cases.map((caseItem, index) => {
              const StatusIcon = getStatusIcon(caseItem.status)
              return (
                <motion.div
                  key={caseItem.id}
                  style={{ 
                    padding: 'var(--spacing-md)',
                    background: selectedCase?.id === caseItem.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-glass)',
                    border: `1px solid ${selectedCase?.id === caseItem.id ? 'var(--color-secondary)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedCase(caseItem)}
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{caseItem.type}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{caseItem.caseNumber}</div>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      background: `${getStatusColor(caseItem.status)}20`,
                      borderRadius: 'var(--radius-sm)',
                      color: getStatusColor(caseItem.status),
                      textTransform: 'capitalize',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <StatusIcon size={12} />
                      {getStatusLabel(caseItem.status)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    Submitted: {new Date(caseItem.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {/* Progress bar for case */}
                  <div style={{ 
                    marginTop: 'var(--spacing-sm)',
                    height: '4px',
                    background: 'var(--bg-dark)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%',
                      width: `${(caseItem.milestones.filter(m => m.completed).length / caseItem.milestones.length) * 100}%`,
                      background: 'var(--gradient-primary)',
                      borderRadius: 'var(--radius-full)'
                    }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Case Detail */}
        <AnimatePresence mode="wait">
          {selectedCase && (
            <motion.div
              key={selectedCase.id}
              className="glass"
              style={{ padding: 'var(--spacing-xl)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Case Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-xl)',
                paddingBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--glass-border)'
              }}>
                <div>
                  <h2>{selectedCase.type}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{selectedCase.caseNumber}</span>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: '4px 12px',
                      background: `${getStatusColor(selectedCase.status)}20`,
                      borderRadius: 'var(--radius-full)',
                      color: getStatusColor(selectedCase.status),
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {getStatusLabel(selectedCase.status)}
                    </span>
                    {selectedCase.priority === 'high' && (
                      <span style={{ 
                        padding: '4px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--color-danger)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
                <button className="glass-button">
                  <ExternalLink size={16} />
                  Check on USCIS
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                {['timeline', 'documents', 'notes', 'activity'].map(tab => (
                  <button
                    key={tab}
                    className={`glass-button ${activeTab === tab ? 'primary' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    style={{ padding: 'var(--spacing-sm) var(--spacing-lg)' }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Timeline View */}
              {activeTab === 'timeline' && (
                <div>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-xl)'
                  }}>
                    <div style={{ 
                      padding: 'var(--spacing-md)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Submitted</div>
                      <div style={{ fontWeight: '600', marginTop: 'var(--spacing-xs)' }}>
                        {new Date(selectedCase.submittedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ 
                      padding: 'var(--spacing-md)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Last Updated</div>
                      <div style={{ fontWeight: '600', marginTop: 'var(--spacing-xs)' }}>
                        {new Date(selectedCase.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ 
                      padding: 'var(--spacing-md)',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Est. Completion</div>
                      <div style={{ fontWeight: '600', marginTop: 'var(--spacing-xs)', color: 'var(--color-secondary)' }}>
                        {new Date(selectedCase.estimatedCompletion).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Milestone Progress */}
                  <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Overall Progress</span>
                      <span style={{ fontWeight: '600' }}>
                        {Math.round((selectedCase.milestones.filter(m => m.completed).length / selectedCase.milestones.length) * 100)}%
                      </span>
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
                        animate={{ 
                          width: `${(selectedCase.milestones.filter(m => m.completed).length / selectedCase.milestones.length) * 100}%` 
                        }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="case-timeline" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {selectedCase.milestones.map((milestone, index) => {
                      const isCompleted = milestone.completed
                      const isActive = milestone.active
                      const isPending = !isCompleted && !isActive
                      
                      return (
                        <motion.div
                          key={milestone.id}
                          style={{ 
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--spacing-md)',
                            padding: 'var(--spacing-md)',
                            background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)',
                            border: isActive ? '1px solid var(--color-secondary)' : '1px solid var(--glass-border)',
                            borderLeft: `4px solid ${isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-secondary)' : 'var(--text-muted)'}`
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div style={{ 
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-secondary)' : 'var(--bg-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {isCompleted ? (
                              <CheckCircle size={18} color="white" />
                            ) : isActive ? (
                              <Clock size={18} color="white" />
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{index + 1}</span>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: '600', 
                              marginBottom: '4px',
                              color: isPending ? 'var(--text-muted)' : 'var(--text-primary)'
                            }}>
                              {milestone.name}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {milestone.date 
                                ? new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Pending'
                              }
                            </div>
                          </div>
                          {isActive && (
                            <span style={{ 
                              padding: '2px 8px',
                              background: 'rgba(59, 130, 246, 0.1)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              color: 'var(--color-secondary)',
                              fontWeight: '500'
                            }}>
                              Current Stage
                            </span>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Documents View */}
              {activeTab === 'documents' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h4 style={{ margin: 0 }}>Case Documents</h4>
                    <button className="glass-button" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}>
                      Upload Document
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {[
                      { name: 'I-485 Application', status: 'Submitted', date: selectedCase.submittedDate, icon: FileText },
                      { name: 'Filing Fee Receipt', status: 'Received', date: selectedCase.submittedDate, icon: CheckCircle },
                      { name: 'Biometrics Notice', status: 'Received', date: '2024-04-05', icon: Calendar },
                      { name: 'Interview Notice', status: 'Sent', date: '2024-12-01', icon: Calendar },
                      { name: 'RFE (if any)', status: 'Not Received', date: null, icon: AlertTriangle }
                    ].map((doc, index) => {
                      const isReceived = doc.status !== 'Not Received'
                      const IconComponent = doc.icon
                      return (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div style={{ 
                            width: '40px', 
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: isReceived ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <IconComponent size={20} style={{ color: isReceived ? 'var(--color-success)' : 'var(--color-danger)' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {isReceived 
                                ? `Received: ${new Date(doc.date).toLocaleDateString()}`
                                : 'Awaiting receipt'
                              }
                            </div>
                          </div>
                          {isReceived && (
                            <button className="glass-button" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}>
                              View
                            </button>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Notes View */}
              {activeTab === 'notes' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h4 style={{ margin: 0 }}>AI Case Notes</h4>
                    <motion.button 
                      className="glass-button primary"
                      onClick={() => setShowAddNote(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                    >
                      <MessageSquare size={14} />
                      Add Note
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {showAddNote && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ 
                          marginBottom: 'var(--spacing-lg)',
                          padding: 'var(--spacing-md)',
                          background: 'var(--bg-glass)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <textarea
                          className="glass-input"
                          placeholder="Add a note to this case..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={3}
                          style={{ width: '100%', marginBottom: 'var(--spacing-sm)' }}
                        />
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                          <button 
                            className="glass-button"
                            onClick={() => setShowAddNote(false)}
                          >
                            Cancel
                          </button>
                          <button 
                            className="glass-button primary"
                            onClick={handleAddNote}
                          >
                            Save Note
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {selectedCase.notes.length > 0 ? (
                      selectedCase.notes.map((note, index) => (
                        <div 
                          key={note.id}
                          style={{ 
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '3px solid var(--color-secondary)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                            <h5 style={{ margin: 0 }}>Note</h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{note.content}</p>
                        </div>
                      ))
                    ) : (
                      <div style={{ 
                        padding: 'var(--spacing-xl)',
                        textAlign: 'center',
                        color: 'var(--text-muted)'
                      }}>
                        <MessageSquare size={48} style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
                        <p>No notes yet. Add a note to track your case observations.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity View */}
              {activeTab === 'activity' && (
                <div>
                  <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>Case Timeline</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {selectedCase.timeline.map((event, index) => {
                      const IconComponent = getTimelineIcon(event.type)
                      return (
                        <motion.div 
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ 
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 'var(--spacing-md)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div style={{ 
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <IconComponent size={20} style={{ color: 'var(--color-secondary)' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>{event.description}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div style={{ 
                marginTop: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-lg)',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                gap: 'var(--spacing-md)'
              }}>
                <motion.button 
                  className="glass-button primary" 
                  style={{ flex: 1 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      Refresh Status
                    </>
                  )}
                </motion.button>
                <button className="glass-button">
                  <AlertCircle size={18} />
                  Report Issue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Processing Times */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ margin: 0 }}>Current Processing Times (USCIS)</h3>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Last updated: {processingTimes[0]?.updated}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-md)' }}>
          {processingTimes.map((item, index) => (
            <motion.div 
              key={item.form}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ 
                padding: 'var(--spacing-lg)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.form}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                {item.category}
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {item.time}
              </div>
              <div style={{ 
                fontSize: '0.75rem',
                color: item.trend.includes('↓') ? 'var(--color-success)' : item.trend.includes('↑') ? 'var(--color-danger)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {item.trend.includes('↓') && <TrendingUp size={12} style={{ transform: 'rotate(180deg)' }} />}
                {item.trend.includes('↑') && <TrendingUp size={12} />}
                {item.trend}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CaseTracking
