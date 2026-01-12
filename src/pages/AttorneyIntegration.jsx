import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Star, MapPin, Phone, Mail, Calendar, 
  Search, Filter, ChevronRight, Shield, Award,
  Clock, DollarSign, MessageSquare, CheckCircle
} from 'lucide-react'

const AttorneyIntegration = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedAttorney, setSelectedAttorney] = useState(null)
  const [showBooking, setShowBooking] = useState(false)

  const specialties = [
    { id: 'all', label: 'All Specialties' },
    { id: 'family', label: 'Family Immigration' },
    { id: 'employment', label: 'Employment-Based' },
    { id: 'deportation', label: 'Deportation Defense' },
    { id: 'asylum', label: 'Asylum & Refugees' },
    { id: 'business', label: 'Business Immigration' }
  ]

  const attorneys = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      title: 'Senior Immigration Attorney',
      rating: 4.9,
      reviews: 156,
      specialties: ['Family Immigration', 'Marriage Green Cards', 'Citizenship'],
      experience: '15 years',
      location: 'San Francisco, CA',
      languages: ['English', 'Spanish', 'Mandarin'],
      hourlyRate: 350,
      availability: 'Available this week',
      bio: 'Specializing in family-based immigration with over 15 years of experience helping families reunite in the United States.',
      education: 'J.D., UC Berkeley School of Law',
      barNumber: 'CA Bar #123456',
      casesWon: '2,500+',
      responseTime: '< 24 hours'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Immigration Law Specialist',
      rating: 4.8,
      reviews: 203,
      specialties: ['Employment-Based', 'H-1B', 'PERM Labor Certification'],
      experience: '12 years',
      location: 'New York, NY',
      languages: ['English', 'Mandarin', 'Cantonese'],
      hourlyRate: 400,
      availability: 'Next available: Jan 20',
      bio: 'Expert in employment-based immigration matters, helping skilled professionals navigate complex visa processes.',
      education: 'J.D., Columbia Law School',
      barNumber: 'NY Bar #789012',
      casesWon: '1,800+',
      responseTime: '< 48 hours'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      title: 'Founding Partner',
      rating: 4.9,
      reviews: 312,
      specialties: ['Deportation Defense', 'Asylum', 'Criminal Immigration'],
      experience: '20 years',
      location: 'Los Angeles, CA',
      languages: ['English', 'Spanish', 'Portuguese'],
      hourlyRate: 450,
      availability: 'Available this week',
      bio: 'Dedicated advocate for immigrant rights with extensive experience in complex removal proceedings and asylum cases.',
      education: 'J.D., UCLA School of Law',
      barNumber: 'CA Bar #456789',
      casesWon: '3,200+',
      responseTime: '< 24 hours'
    },
    {
      id: 4,
      name: 'David Park',
      title: 'Senior Associate Attorney',
      rating: 4.7,
      reviews: 89,
      specialties: ['Business Immigration', 'Investor Visas', 'L-1 Transfers'],
      experience: '8 years',
      location: 'Chicago, IL',
      languages: ['English', 'Korean', 'Japanese'],
      hourlyRate: 300,
      availability: 'Next available: Jan 15',
      bio: 'Business immigration specialist helping multinational companies transfer talent and investors establish U.S. presence.',
      education: 'J.D., Northwestern University',
      barNumber: 'IL Bar #234567',
      casesWon: '950+',
      responseTime: '< 24 hours'
    },
    {
      id: 5,
      name: 'Amanda Foster',
      title: 'Immigration & Nationality Attorney',
      rating: 4.8,
      reviews: 145,
      specialties: ['Citizenship', 'Naturalization', 'VAWA'],
      experience: '10 years',
      location: 'Seattle, WA',
      languages: ['English', 'French', 'German'],
      hourlyRate: 325,
      availability: 'Available this week',
      bio: 'Passionate about helping individuals achieve their American dream through citizenship and family reunification.',
      education: 'J.D., University of Washington',
      barNumber: 'WA Bar #890123',
      casesWon: '1,200+',
      responseTime: '< 12 hours'
    },
    {
      id: 6,
      name: 'Robert Kim',
      title: 'Managing Partner',
      rating: 4.9,
      reviews: 278,
      specialties: ['Family Immigration', 'Fiance Visas', 'Adjustment of Status'],
      experience: '18 years',
      location: 'Houston, TX',
      languages: ['English', 'Korean', 'Vietnamese'],
      hourlyRate: 375,
      availability: 'Next available: Jan 18',
      bio: 'Leading immigration practice in Texas, with focus on family-based and employment-based immigration matters.',
      education: 'J.D., Harvard Law School',
      barNumber: 'TX Bar #567890',
      casesWon: '2,800+',
      responseTime: '< 24 hours'
    }
  ]

  const filteredAttorneys = attorneys.filter(attorney => {
    const matchesSearch = attorney.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attorney.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         attorney.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === 'all' || 
                             attorney.specialties.some(s => s.toLowerCase().replace(' ', '-') === selectedSpecialty)
    return matchesSearch && matchesSpecialty
  })

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < Math.floor(rating) ? '#F59E0B' : 'none'}
        stroke={i < Math.floor(rating) ? '#F59E0B' : '#64748B'}
      />
    ))
  }

  return (
    <div className="attorney-integration">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Secure Attorney Integration
        </motion.h1>
        <p>Connect with vetted immigration attorneys for personalized legal guidance.</p>
      </div>

      {/* Trust Banner */}
      <div style={{ 
        marginBottom: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-lg)'
      }}>
        <Shield size={40} style={{ color: 'var(--color-success)' }} />
        <div>
          <h3 style={{ marginBottom: '4px' }}>Verified & Vetted Attorneys</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            All attorneys in our network are licensed, insured, and have passed our thorough background verification.
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-lg)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>500+</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-secondary)' }}>98%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Satisfaction</div>
          </div>
        </div>
      </div>

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
          
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            {specialties.map(specialty => (
              <button
                key={specialty.id}
                className={`glass-button ${selectedSpecialty === specialty.id ? 'primary' : ''}`}
                onClick={() => setSelectedSpecialty(specialty.id)}
                style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
              >
                {specialty.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          {filteredAttorneys.length} attorneys found
        </span>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button 
            className={`glass-button ${viewMode === 'grid' ? 'primary' : ''}`}
            onClick={() => setViewMode('grid')}
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            Grid
          </button>
          <button 
            className={`glass-button ${viewMode === 'list' ? 'primary' : ''}`}
            onClick={() => setViewMode('list')}
            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
          >
            List
          </button>
        </div>
      </div>

      {/* Attorneys Grid */}
      <div className="attorney-grid">
        {filteredAttorneys.map((attorney, index) => (
          <motion.div
            key={attorney.id}
            className="glass attorney-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="attorney-header">
              <div className="attorney-avatar">
                {attorney.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="attorney-info">
                <h4>{attorney.name}</h4>
                <p>{attorney.title}</p>
              </div>
            </div>

            <div className="attorney-rating">
              {renderStars(attorney.rating)}
              <span>{attorney.rating}</span>
              <span style={{ color: 'var(--text-muted)' }}>({attorney.reviews} reviews)</span>
            </div>

            <div className="attorney-specialties">
              {attorney.specialties.map(specialty => (
                <span key={specialty} className="chip">{specialty}</span>
              ))}
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
                {attorney.location}
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
              <button 
                className="glass-button primary"
                onClick={() => {
                  setSelectedAttorney(attorney)
                  setShowBooking(true)
                }}
                style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
              >
                <Calendar size={16} />
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attorney Detail Modal */}
      {selectedAttorney && !showBooking && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedAttorney(null)}
        >
          <motion.div
            className="glass"
            style={{ 
              maxWidth: '700px', 
              padding: 'var(--spacing-2xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
              <div className="attorney-avatar" style={{ width: '100px', height: '100px', fontSize: '2rem', flexShrink: 0 }}>
                {selectedAttorney.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <h2>{selectedAttorney.name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedAttorney.title}</p>
                <div className="attorney-rating" style={{ marginTop: 'var(--spacing-sm)' }}>
                  {renderStars(selectedAttorney.rating)}
                  <span>{selectedAttorney.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({selectedAttorney.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>About</h4>
              <p style={{ color: 'var(--text-secondary)' }}>{selectedAttorney.bio}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                  <Award size={16} style={{ color: 'var(--color-secondary)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Education</span>
                </div>
                <div style={{ fontWeight: '500' }}>{selectedAttorney.education}</div>
              </div>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                  <Shield size={16} style={{ color: 'var(--color-success)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bar Number</span>
                </div>
                <div style={{ fontWeight: '500' }}>{selectedAttorney.barNumber}</div>
              </div>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cases Won</span>
                </div>
                <div style={{ fontWeight: '500' }}>{selectedAttorney.casesWon}</div>
              </div>
              <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                  <Clock size={16} style={{ color: 'var(--color-warning)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Response Time</span>
                </div>
                <div style={{ fontWeight: '500' }}>{selectedAttorney.responseTime}</div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Languages</h4>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                {selectedAttorney.languages.map(lang => (
                  <span key={lang} className="chip">{lang}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-md)' }}>
              <button className="glass-button primary" style={{ flex: 1, padding: 'var(--spacing-md)' }}>
                <Calendar size={18} />
                Schedule Consultation
              </button>
              <button className="glass-button" style={{ flex: 1, padding: 'var(--spacing-md)' }}>
                <MessageSquare size={18} />
                Send Message
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedAttorney && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowBooking(false)}
        >
          <motion.div
            className="glass"
            style={{ 
              maxWidth: '500px', 
              padding: 'var(--spacing-2xl)'
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Book Consultation</h2>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              <div className="attorney-avatar">
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
              <input type="date" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Select Time</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                  <button key={time} className="glass-button" style={{ padding: 'var(--spacing-xs) var(--spacing-md)' }}>
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Consultation Type</label>
              <select className="glass-input">
                <option>Initial Consultation (30 min)</option>
                <option>Detailed Consultation (60 min)</option>
                <option>Case Review (45 min)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Brief Description of Your Case</label>
              <textarea 
                className="glass-input"
                rows={3}
                placeholder="Please provide a brief overview of your immigration situation..."
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
              <button className="glass-button primary" style={{ flex: 1 }}>
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Stats Banner */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Why Use AEGIS Attorney Network?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-lg)' }}>
          {[
            { icon: Shield, title: 'Verified Credentials', desc: 'All attorneys are licensed and vetted' },
            { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden fees, clear rate structure' },
            { icon: Clock, title: 'Fast Response', desc: 'Average response time under 24 hours' },
            { icon: Star, title: 'Quality Assured', desc: '98% client satisfaction rate' }
          ].map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md)'
              }}>
                <item.icon size={28} color="white" />
              </div>
              <h4>{item.title}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AttorneyIntegration
