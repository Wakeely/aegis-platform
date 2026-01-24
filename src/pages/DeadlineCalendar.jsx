import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, AlertTriangle, CheckCircle, Bell,
  ChevronLeft, ChevronRight, Plus, X, FileText,
  MapPin, FileCheck, AlertCircle, DollarSign, Target,
  Flag, Filter, Settings, Mail, Smartphone
} from 'lucide-react'
import {
  useDeadlineStore,
  useGlobalStore
} from '../utils/enhancedStore'

const DeadlineCalendar = () => {
  const {
    deadlines,
    viewMode,
    selectedDate,
    filterType,
    notifications,
    setViewMode,
    setSelectedDate,
    setFilterType,
    toggleDeadline,
    deleteDeadline,
    addDeadline,
    updateDeadline,
    getStats,
    getUpcomingDeadlines,
    getUrgentDeadlines,
    getMonthEvents
  } = useDeadlineStore()
  const { addNotification } = useGlobalStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDeadline, setSelectedDeadline] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)

  // Form state for new deadline
  const [newDeadline, setNewDeadline] = useState({
    title: '',
    date: '',
    type: 'milestone',
    priority: 'medium',
    description: '',
    reminderDays: [7, 3, 1]
  })

  const stats = getStats()
  const upcomingDeadlines = getUpcomingDeadlines(30)
  const urgentDeadlines = getUrgentDeadlines()

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days = []

    // Previous month days
    const prevMonth = new Date(year, month, 0)
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }

    return days
  }, [currentMonth])

  const getDeadlineForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return deadlines.filter(d => d.date === dateStr && (filterType === 'all' || d.type === filterType))
  }

  const getTypeColor = (type) => {
    const colors = {
      interview: '#3B82F6',
      rfe: '#EF4444',
      biometrics: '#8B5CF6',
      expiration: '#F59E0B',
      tax: '#10B981',
      milestone: '#06B6D4'
    }
    return colors[type] || '#6B7280'
  }

  const getTypeIcon = (type) => {
    const icons = {
      interview: MapPin,
      rfe: AlertTriangle,
      biometrics: FileCheck,
      expiration: Clock,
      tax: DollarSign,
      milestone: Target
    }
    return icons[type] || Calendar
  }

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'var(--color-danger)',
      high: 'var(--color-warning)',
      medium: 'var(--color-secondary)',
      low: 'var(--text-muted)'
    }
    return colors[priority] || 'var(--text-muted)'
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  const handleToggleDeadline = (id) => {
    toggleDeadline(id)
    addNotification({
      type: 'success',
      title: 'Deadline Updated',
      message: 'Deadline status has been updated.'
    })
  }

  const handleAddDeadline = () => {
    if (newDeadline.title && newDeadline.date) {
      addDeadline(newDeadline)
      setShowAddModal(false)
      setNewDeadline({
        title: '',
        date: '',
        type: 'milestone',
        priority: 'medium',
        description: '',
        reminderDays: [7, 3, 1]
      })
      addNotification({
        type: 'success',
        title: 'Deadline Added',
        message: 'New deadline has been created.'
      })
    }
  }

  const handleDeleteDeadline = (id) => {
    deleteDeadline(id)
    setSelectedDeadline(null)
    addNotification({
      type: 'info',
      title: 'Deadline Deleted',
      message: 'Deadline has been removed.'
    })
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPast = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="deadline-calendar">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Deadline & Calendar Management
        </motion.h1>
        <p>Track all important deadlines, appointments, and milestones in one place with smart reminders.</p>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-grid four-col" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {[
          { label: 'Total Deadlines', value: stats.total, icon: Calendar, color: 'var(--color-secondary)' },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'var(--color-warning)' },
          { label: 'Urgent', value: stats.urgent, icon: AlertTriangle, color: 'var(--color-danger)' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'var(--color-success)' }
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

      {/* Urgent Alerts */}
      {urgentDeadlines.length > 0 && (
        <motion.div
          className="glass"
          style={{
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)'
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-danger)' }} />
            <h3 style={{ margin: 0, color: 'var(--color-danger)' }}>Urgent Deadlines This Week</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {urgentDeadlines.map((deadline) => {
              const daysUntil = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24))
              return (
                <div
                  key={deadline.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <span style={{
                      padding: '2px 8px',
                      background: 'var(--color-danger)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {daysUntil} days
                    </span>
                    <span>{deadline.title}</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {new Date(deadline.date).toLocaleDateString()}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
        {/* Calendar Section */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          {/* Calendar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <button
                className="glass-button"
                onClick={() => navigateMonth(-1)}
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
              >
                <ChevronLeft size={20} />
              </button>
              <h2 style={{ margin: 0, minWidth: '200px', textAlign: 'center' }}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                className="glass-button"
                onClick={() => navigateMonth(1)}
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button
                className={`glass-button ${filterType === 'all' ? 'primary' : ''}`}
                onClick={() => setFilterType('all')}
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
              >
                All
              </button>
              {['interview', 'rfe', 'biometrics', 'expiration', 'tax'].map((type) => (
                <button
                  key={type}
                  className={`glass-button ${filterType === type ? 'primary' : ''}`}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    textTransform: 'capitalize'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            <motion.button
              className="glass-button primary"
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: 'var(--spacing-sm) var(--spacing-lg)' }}
            >
              <Plus size={18} />
              Add Deadline
            </motion.button>
          </div>

          {/* Calendar Grid */}
          {/* Weekday Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-sm)',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 'var(--spacing-xs)'
          }}>
            {calendarDays.map((day, index) => {
              const dayDeadlines = getDeadlineForDate(day.date)
              const isCurrentDay = day.isCurrentMonth

              return (
                <motion.div
                  key={index}
                  style={{
                    minHeight: '100px',
                    padding: 'var(--spacing-sm)',
                    background: isToday(day.date)
                      ? 'rgba(59, 130, 246, 0.15)'
                      : isCurrentDay
                        ? 'var(--bg-glass)'
                        : 'rgba(255, 255, 255, 0.02)',
                    border: isToday(day.date)
                      ? '1px solid var(--color-secondary)'
                      : '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    opacity: isCurrentDay ? 1 : 0.5,
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (isCurrentDay) {
                      setNewDeadline(prev => ({
                        ...prev,
                        date: day.date.toISOString().split('T')[0]
                      }))
                      setShowAddModal(true)
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    <span style={{
                      fontWeight: isToday(day.date) ? '700' : '400',
                      color: isToday(day.date)
                        ? 'var(--color-secondary)'
                        : isPast(day.date)
                          ? 'var(--text-muted)'
                          : 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}>
                      {day.date.getDate()}
                    </span>
                    {isPast(day.date) && !dayDeadlines.every(d => d.completed) && isCurrentDay && (
                      <AlertTriangle size={12} style={{ color: 'var(--color-danger)' }} />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {dayDeadlines.slice(0, 3).map((deadline) => {
                      const TypeIcon = getTypeIcon(deadline.type)
                      return (
                        <motion.div
                          key={deadline.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px',
                            background: `${getTypeColor(deadline.type)}20`,
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.7rem',
                            overflow: 'hidden'
                          }}
                          whileHover={{ scale: 1.05 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDeadline(deadline)
                          }}
                        >
                          <TypeIcon size={10} style={{ color: getTypeColor(deadline.type), flexShrink: 0 }} />
                          <span style={{
                            color: getTypeColor(deadline.type),
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {deadline.title}
                          </span>
                          {deadline.priority === 'urgent' && (
                            <Flag size={10} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                          )}
                        </motion.div>
                      )
                    })}
                    {dayDeadlines.length > 3 && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        textAlign: 'center'
                      }}>
                        +{dayDeadlines.length - 3} more
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Sidebar - Upcoming Deadlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Upcoming List */}
          <div className="glass" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ margin: '0 0 var(--spacing-lg) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Clock size={20} style={{ color: 'var(--color-warning)' }} />
              Upcoming Deadlines
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {upcomingDeadlines.slice(0, 5).map((deadline) => {
                const TypeIcon = getTypeIcon(deadline.type)
                const daysUntil = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24))

                return (
                  <motion.div
                    key={deadline.id}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `3px solid ${getPriorityColor(deadline.priority)}`,
                      opacity: deadline.completed ? 0.6 : 1
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xs)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <TypeIcon size={16} style={{ color: getTypeColor(deadline.type) }} />
                        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{deadline.title}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={deadline.completed}
                        onChange={() => handleToggleDeadline(deadline.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(deadline.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        background: daysUntil <= 3 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        borderRadius: 'var(--radius-sm)',
                        color: daysUntil <= 3 ? 'var(--color-danger)' : 'var(--color-warning)',
                        fontWeight: '500'
                      }}>
                        {daysUntil} days
                      </span>
                    </div>
                    {deadline.caseNumber && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
                        Case: {deadline.caseNumber}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ margin: '0 0 var(--spacing-lg) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Bell size={20} style={{ color: 'var(--color-secondary)' }} />
              Reminder Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.875rem' }}>Email Reminders</span>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => {}}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    inset: 0,
                    background: notifications.email ? 'var(--color-success)' : 'var(--bg-dark)',
                    borderRadius: 'var(--radius-full)',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: notifications.email ? '23px' : '3px',
                      bottom: '3px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: '0.3s'
                    }} />
                  </span>
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Smartphone size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.875rem' }}>Push Notifications</span>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => {}}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    inset: 0,
                    background: notifications.push ? 'var(--color-success)' : 'var(--bg-dark)',
                    borderRadius: 'var(--radius-full)',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: notifications.push ? '23px' : '3px',
                      bottom: '3px',
                      background: 'white',
                      borderRadius: '50%',
                      transition: '0.3s'
                    }} />
                  </span>
                </label>
              </div>
            </div>
            <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                Remind me before deadlines:
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                {[1, 3, 7, 14, 30].map((days) => (
                  <span
                    key={days}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {days} day{days > 1 ? 's' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Deadline Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--spacing-xl)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="glass"
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: 'var(--spacing-xl)'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ margin: 0 }}>Add New Deadline</h2>
                <button
                  className="glass-button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', fontWeight: '500' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g., I-485 Interview"
                    value={newDeadline.title}
                    onChange={(e) => setNewDeadline(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', fontWeight: '500' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      className="glass-input"
                      value={newDeadline.date}
                      onChange={(e) => setNewDeadline(prev => ({ ...prev, date: e.target.value }))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', fontWeight: '500' }}>
                      Priority
                    </label>
                    <select
                      className="glass-input"
                      value={newDeadline.priority}
                      onChange={(e) => setNewDeadline(prev => ({ ...prev, priority: e.target.value }))}
                      style={{ width: '100%' }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', fontWeight: '500' }}>
                    Type
                  </label>
                  <select
                    className="glass-input"
                    value={newDeadline.type}
                    onChange={(e) => setNewDeadline(prev => ({ ...prev, type: e.target.value }))}
                    style={{ width: '100%' }}
                  >
                    <option value="milestone">Milestone</option>
                    <option value="interview">Interview</option>
                    <option value="rfe">RFE Response</option>
                    <option value="biometrics">Biometrics</option>
                    <option value="expiration">Expiration</option>
                    <option value="tax">Tax Filing</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    className="glass-input"
                    placeholder="Add details about this deadline..."
                    value={newDeadline.description}
                    onChange={(e) => setNewDeadline(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                <button
                  className="glass-button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  className="glass-button primary"
                  onClick={handleAddDeadline}
                  style={{ flex: 1 }}
                >
                  <Plus size={18} />
                  Add Deadline
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deadline Detail Modal */}
      <AnimatePresence>
        {selectedDeadline && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--spacing-xl)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDeadline(null)}
          >
            <motion.div
              className="glass"
              style={{
                width: '100%',
                maxWidth: '450px',
                padding: 'var(--spacing-xl)'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                paddingBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--glass-border)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: `${getTypeColor(selectedDeadline.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.createElement(getTypeIcon(selectedDeadline.type), {
                    size: 24,
                    style: { color: getTypeColor(selectedDeadline.type) }
                  })}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0 }}>{selectedDeadline.title}</h2>
                  <span style={{
                    fontSize: '0.875rem',
                    color: getPriorityColor(selectedDeadline.priority),
                    textTransform: 'capitalize'
                  }}>
                    {selectedDeadline.priority} Priority
                  </span>
                </div>
                <button
                  className="glass-button"
                  onClick={() => setSelectedDeadline(null)}
                  style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                  <span>{new Date(selectedDeadline.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
                {selectedDeadline.caseNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <FileText size={18} style={{ color: 'var(--text-muted)' }} />
                    <span>Case: {selectedDeadline.caseNumber}</span>
                  </div>
                )}
                {selectedDeadline.description && (
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {selectedDeadline.description}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                <button
                  className="glass-button"
                  onClick={() => handleDeleteDeadline(selectedDeadline.id)}
                  style={{ flex: 1, color: 'var(--color-danger)' }}
                >
                  <X size={18} />
                  Delete
                </button>
                <button
                  className="glass-button primary"
                  onClick={() => setSelectedDeadline(null)}
                  style={{ flex: 1 }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DeadlineCalendar
