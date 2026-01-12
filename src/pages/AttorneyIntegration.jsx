import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Star, MapPin, Phone, Mail, Calendar,
  Search, Filter, ChevronRight, Shield, Award,
  Clock, DollarSign, MessageSquare, CheckCircle,
  Video, Globe, TrendingUp, Send, X
} from 'lucide-react'
import { useAttorneyStore, useGlobalStore, useUserStore } from '../utils/enhancedStore'

const AttorneyIntegration = () => {
  const {
    attorneys,
    appointments,
    searchQuery,
    selectedSpecialty,
    sortBy,
    searchAttorneys,
    setSearchQuery,
    setSelectedSpecialty,
    setSortBy,
    bookAppointment,
    sendMessage
  } = useAttorneyStore()

  const { addNotification, openModal } = useGlobalStore()
  const { user } = useUserStore()

  const [viewMode, setViewMode] = useState('grid')
  const [selectedAttorney, setSelectedAttorney] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    type: 'initial',
    description: ''
  })
  const [messageData, setMessageData] = useState({
    subject: '',
    message: ''
  })

  // Filter and sort attorneys
  const filteredAttorneys = useMemo(() => {
    return searchAttorneys()
  }, [searchAttorneys])

  // Get featured attorneys
  const featuredAttorneys = useMemo(() => {
    return attorneys.filter(a => a.featured).slice(0, 3)
  }, [attorneys])

  // Get stats
  const stats = useMemo(() => ({
    total: attorneys.length,
    featured: attorneys.filter(a => a.featured).length,
    avgRating: (attorneys.reduce((acc, a) => acc + a.rating, 0) / attorneys.length).toFixed(1),
    avgRate: Math.round(attorneys.reduce((acc, a) => acc + a.hourlyRate, 0) / attorneys.length)
  }), [attorneys])

  // Handle booking
  const handleBooking = useCallback(() => {
    if (!bookingData.date || !bookingData.time) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please select a date and time for your appointment.'
      })
      return
    }

    const appointmentId = bookAppointment({
      attorneyId: selectedAttorney.id,
      attorneyName: selectedAttorney.name,
      date: bookingData.date,
      time: bookingData.time,
      type: bookingData.type,
      description: bookingData.description,
      userId: user.userSession?.id
    })

    setShowBooking(false)
    setBookingData({ date: '', time: '', type: 'initial', description: '' })

    addNotification({
      type: 'success',
      title: 'Appointment Booked',
      message: `Your consultation with ${selectedAttorney.name} has been scheduled.`
    })
  }, [bookingData, selectedAttorney, bookAppointment, addNotification, user.userSession?.id])

  // Handle message
  const handleMessage = useCallback(() => {
    if (!messageData.message.trim()) {
      addNotification({
        type: 'error',
        title: 'Empty Message',
        message: 'Please enter a message before sending.'
      })
      return
    }

    sendMessage({
      attorneyId: selectedAttorney.id,
      subject: messageData.subject,
      message: messageData.message,
      userId: user.userSession?.id
    })

    setShowMessage(false)
    setMessageData({ subject: '', message: '' })

    addNotification({
      type: 'success',
      title: 'Message Sent',
      message: `Your message has been sent to ${selectedAttorney.name}.`
    })
  }, [messageData, selectedAttorney, sendMessage, addNotification, user.userSession?.id])

  // Render stars
  const renderStars = useCallback((rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < Math.floor(rating) ? '#F59E0B' : 'none'}
        stroke={i < Math.floor(rating) ? '#F59E0B' : '#64748B'}
      />
    ))
  }, [])

  // Specialty options
  const specialties = useMemo(() => [
    { id: 'all', label: 'All Specialties' },
    { id: 'family', label: 'Family Immigration' },
    { id: 'employment', label: 'Employment-Based' },
    { id: 'deportation', label: 'Deportation Defense' },
    { id: 'asylum', label: 'Asylum & Refugees' },
    { id: 'business', label: 'Business Immigration' }
  ], [])

  // Sort options
  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'rate-low', label: 'Lowest Rate' },
    { value: 'rate-high', label: 'Highest Rate' },
    { value: 'experience', label: 'Most Experienced' }
  ]

  // Time slots
  const timeSlots = useMemo(() => [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ], [])

  return (
    <div className="attorney-integration">
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
            <Users size={24} color="white" />
          </div>
          Attorney Network
        </motion.h1>
        <p>Connect with vetted immigration attorneys for personalized legal guidance and support.</p>

        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-lg)',
          marginTop: 'var(--spacing-lg)',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: Users, label: 'Attorneys', value: stats.total, color: 'var(--color-secondary)' },
            { icon: Star, label: 'Avg Rating', value: `${stats.avgRating}★`, color: 'var(--color-warning)' },
            { icon: TrendingUp, label: 'Featured', value: stats.featured, color: 'var(--color-success)' },
            { icon: DollarSign, label: 'Avg Rate', value: `$${stats.avgRate}/hr`, color: 'var(--color-accent)' }
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

      {/* Trust Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          flexWrap: 'wrap'
        }}
      >
        <Shield size={40} style={{ color: 'var(--color-success)' }} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ marginBottom: '4px' }}>Verified & Vetted Attorneys</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            All attorneys in our network are licensed, insured, and have passed our thorough background verification process.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
          {[
            { value: '500+', label: 'Verified' },
            { value: '98%', label: 'Satisfaction' },
            { value: '<24hrs', label: 'Response' }
          ].map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-success)' }}>{item.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
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
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            {specialties.map(specialty => (
              <motion.button
                key={specialty.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`glass-button ${selectedSpecialty === specialty.id ? 'primary' : ''}`}
                onClick={() => setSelectedSpecialty(specialty.id)}
                style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
              >
                {specialty.label}
              </motion.button>
            ))}
          </div>

          <select
            className="glass-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          {filteredAttorneys.length} attorneys found
        </span>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`glass-button ${viewMode === 'grid' ? 'primary' : ''}`}
            onClick={() => setViewMode('grid')}
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            Grid
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`glass-button ${viewMode === 'list' ? 'primary' : ''}`}
            onClick={() => setViewMode('list')}
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            List
          </motion.button>
        </div>
      </div>

      {/* Attorneys Grid */}
      {filteredAttorneys.length === 0 ? (
        <div className="glass" style={{
          padding: 'var(--spacing-2xl)',
          textAlign: 'center',
          gridColumn: '1 / -1'
        }}>
          <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
          <h3>No attorneys found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Try adjusting your search or filter criteria
          </p>
          <button className="glass-button primary" onClick={() => {
            setSearchQuery('')
            setSelectedSpecialty('all')
          }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="attorney-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg)' }}>
          {filteredAttorneys.map((attorney, index) => (
            <motion.div
              key={attorney.id}
              className="glass attorney-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedAttorney(attorney)}
            >
              {attorney.featured && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: 'var(--spacing-md)',
                  padding: '4px 8px',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  Featured
                </div>
              )}

              <div className="attorney-header" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div className="attorney-avatar">
                  {attorney.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="attorney-info">
                  <h4 style={{ margin: 0 }}>{attorney.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>{attorney.title}</p>
                </div>
              </div>

              <div className="attorney-rating" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                {renderStars(attorney.rating)}
                <span style={{ fontWeight: '600' }}>{attorney.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>({attorney.reviews})</span>
              </div>

              <div className="attorney-specialties" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                {attorney.specialties.slice(0, 2).map(specialty => (
                  <span key={specialty} className="chip" style={{ fontSize: '0.75rem' }}>{specialty}</span>
                ))}
                {attorney.specialties.length > 2 && (
                  <span className="chip" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                    +{attorney.specialties.length - 2}
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} />
                  {attorney.location.split(',')[0]}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  {attorney.experience}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--glass-border)'
              }}>
                <div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }}>
                    ${attorney.hourlyRate}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/hour</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAttorney(attorney)
                    setShowBooking(true)
                  }}
                  style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
                >
                  <Calendar size={16} />
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Attorney Detail Modal */}
      <AnimatePresence>
        {selectedAttorney && !showBooking && !showMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAttorney(null)}
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
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <div className="attorney-avatar" style={{ width: '80px', height: '80px', fontSize: '1.5rem', flexShrink: 0 }}>
                  {selectedAttorney.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <h2 style={{ margin: 0 }}>{selectedAttorney.name}</h2>
                    {selectedAttorney.videoConsult && (
                      <span className="chip" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--color-success)', fontSize: '0.7rem' }}>
                        <Video size={12} style={{ marginRight: '4px' }} />
                        Video Call
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{selectedAttorney.title}</p>
                  <div className="attorney-rating" style={{ marginTop: 'var(--spacing-xs)' }}>
                    {renderStars(selectedAttorney.rating)}
                    <span style={{ fontWeight: '600' }}>{selectedAttorney.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({selectedAttorney.reviews} reviews)</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAttorney(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 'var(--spacing-sm)'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                {selectedAttorney.bio}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                {[
                  { icon: Award, label: 'Education', value: selectedAttorney.education, color: 'var(--color-secondary)' },
                  { icon: Shield, label: 'Bar Number', value: selectedAttorney.barNumber, color: 'var(--color-success)' },
                  { icon: CheckCircle, label: 'Cases Won', value: selectedAttorney.casesWon, color: 'var(--color-accent)' },
                  { icon: Clock, label: 'Response Time', value: selectedAttorney.responseTime, color: 'var(--color-warning)' }
                ].map((item, index) => (
                  <div key={index} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                      <item.icon size={14} style={{ color: item.color }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</span>
                    </div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem' }}>Languages</h4>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                  {selectedAttorney.languages.map(lang => (
                    <span key={lang} className="chip">
                      <Globe size={12} style={{ marginRight: '4px' }} />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button primary"
                  style={{ flex: 1, padding: 'var(--spacing-md)' }}
                  onClick={() => setShowBooking(true)}
                >
                  <Calendar size={18} />
                  Schedule Consultation
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button"
                  style={{ flex: 1, padding: 'var(--spacing-md)' }}
                  onClick={() => setShowMessage(true)}
                >
                  <MessageSquare size={18} />
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && selectedAttorney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBooking(false)}
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
                maxWidth: '500px',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ margin: 0 }}>Book Consultation</h2>
                <button
                  onClick={() => setShowBooking(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-xl)'
              }}>
                <div className="attorney-avatar" style={{ width: '48px', height: '48px', fontSize: '1rem' }}>
                  {selectedAttorney.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{selectedAttorney.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    ${selectedAttorney.hourlyRate}/hour • {selectedAttorney.experience}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  className="glass-input"
                  value={bookingData.date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Select Time</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                  {timeSlots.map(time => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`glass-button ${bookingData.time === time ? 'primary' : ''}`}
                      style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                      onClick={() => setBookingData(prev => ({ ...prev, time }))}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Consultation Type</label>
                <select
                  className="glass-input"
                  value={bookingData.type}
                  onChange={(e) => setBookingData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="initial">Initial Consultation (30 min) - ${selectedAttorney.hourlyRate / 2}</option>
                  <option value="detailed">Detailed Consultation (60 min) - ${selectedAttorney.hourlyRate}</option>
                  <option value="review">Case Review (45 min) - ${Math.round(selectedAttorney.hourlyRate * 0.75)}</option>
                </select>
              </div>

              <div className="form-group">
                <label>Brief Description</label>
                <textarea
                  className="glass-input"
                  rows={3}
                  placeholder="Please provide a brief overview of your immigration situation..."
                  value={bookingData.description}
                  onChange={(e) => setBookingData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div style={{
                padding: 'var(--spacing-md)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                  <span>Consultation Fee</span>
                  <span style={{ fontWeight: '600' }}>${selectedAttorney.hourlyRate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                  <span>Platform Fee</span>
                  <span style={{ fontWeight: '600' }}>$25</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 'var(--spacing-sm)',
                  borderTop: '1px solid var(--glass-border)',
                  fontWeight: '600',
                  fontSize: '1.125rem'
                }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--color-secondary)' }}>${selectedAttorney.hourlyRate + 25}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button className="glass-button" onClick={() => setShowBooking(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button primary"
                  style={{ flex: 1 }}
                  onClick={handleBooking}
                >
                  <Calendar size={18} />
                  Confirm Booking
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessage && selectedAttorney && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMessage(false)}
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
                maxWidth: '500px',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ margin: 0 }}>Send Message</h2>
                <button
                  onClick={() => setShowMessage(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem' }}>To: {selectedAttorney.name}</label>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="What is this regarding?"
                  value={messageData.subject}
                  onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  className="glass-input"
                  rows={5}
                  placeholder="Type your message here..."
                  value={messageData.message}
                  onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div style={{
                padding: 'var(--spacing-md)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Clock size={14} />
                  Average response time: {selectedAttorney.responseTime}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button className="glass-button" onClick={() => setShowMessage(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button primary"
                  style={{ flex: 1 }}
                  onClick={handleMessage}
                >
                  <Send size={18} />
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Banner */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Why Use AEGIS Attorney Network?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-lg)' }}>
          {[
            { icon: Shield, title: 'Verified Credentials', desc: 'All attorneys are licensed and vetted', color: 'var(--color-success)' },
            { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden fees, clear rate structure', color: 'var(--color-secondary)' },
            { icon: Clock, title: 'Fast Response', desc: 'Average response time under 24 hours', color: 'var(--color-warning)' },
            { icon: Star, title: 'Quality Assured', desc: '98% client satisfaction rate', color: 'var(--color-accent)' }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-md)',
                background: `${item.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md)'
              }}>
                <item.icon size={28} style={{ color: item.color }} />
              </div>
              <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{item.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AttorneyIntegration
