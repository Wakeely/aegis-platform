import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FormInput, FileText, Save, Download, Send, 
  Check, ChevronRight, ChevronLeft, Sparkles, 
  User, MapPin, Calendar, FileCheck, AlertCircle,
  Briefcase, FileSignature, Eye, RotateCcw, Loader2
} from 'lucide-react'
import { 
  useFormStore, 
  useUserStore,
  useGlobalStore 
} from '../utils/enhancedStore'

const FormGeneration = () => {
  const { user } = useUserStore()
  const { 
    currentForm, 
    formData, 
    setFormData, 
    setCurrentForm, 
    getFormCompletion,
    validateField,
    validateAll,
    saveDraft,
    submitForm,
    drafts,
    submittedForms
  } = useFormStore()
  const { addNotification } = useGlobalStore()
  
  const [activeSection, setActiveSection] = useState('personal')
  const [autoFilling, setAutoFilling] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  const forms = [
    { id: 'I-485', name: 'Application to Register Permanent Residence', category: 'Adjustment of Status', requiredDocs: ['Passport', 'Birth Certificate', 'Marriage Certificate'] },
    { id: 'I-130', name: 'Petition for Alien Relative', category: 'Family-Based', requiredDocs: ['Petitioner ID', 'Beneficiary Birth Certificate'] },
    { id: 'I-131', name: 'Application for Travel Document', category: 'Travel', requiredDocs: ['Passport', 'I-94'] },
    { id: 'I-765', name: 'Application for Employment Authorization', category: 'Work', requiredDocs: ['I-94', 'SSN'] },
    { id: 'N-400', name: 'Application for Naturalization', category: 'Citizenship', requiredDocs: ['Green Card', 'Tax Returns'] }
  ]

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'family', label: 'Family', icon: FileText },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'eligibility', label: 'Eligibility', icon: FileCheck }
  ]

  const handleAutoFill = useCallback(() => {
    setAutoFilling(true)
    
    // Simulate AI extracting data from user profile
    setTimeout(() => {
      setFormData('fullName', user.name)
      setFormData('dateOfBirth', user.dateOfBirth)
      setFormData('countryOfBirth', user.countryOfBirth)
      setFormData('alienNumber', user.alienNumber)
      setFormData('ssn', user.ssn)
      setFormData('street', user.address?.split(',')[0] || '123 Main Street')
      setFormData('city', user.address?.split(',')[1]?.trim() || 'San Francisco')
      setFormData('state', 'CA')
      setFormData('zipCode', '94102')
      setFormData('maritalStatus', user.maritalStatus)
      setFormData('spouseName', user.spouseName)
      setFormData('marriageDate', user.marriageDate)
      setFormData('employer', user.employer)
      setFormData('position', user.position)
      setFormData('employmentStart', user.employmentStart)
      
      setAutoFilling(false)
      setLastSaved(new Date())
      
      addNotification({
        type: 'success',
        title: 'Auto-fill Complete',
        message: 'Form fields have been populated from your profile.'
      })
    }, 1500)
  }, [user, setFormData, addNotification])

  const handleInputChange = useCallback((field, value) => {
    setFormData(field, value)
    
    // Real-time validation
    const { valid, error } = validateField(field, value)
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }, [setFormData, validateField])

  const handleSaveDraft = useCallback(() => {
    const draftId = saveDraft()
    setLastSaved(new Date())
    addNotification({
      type: 'success',
      title: 'Draft Saved',
      message: 'Your progress has been saved.'
    })
  }, [saveDraft, addNotification])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    
    // Validate all fields
    setIsValidating(true)
    const { isValid, errors } = validateAll()
    setFieldErrors(errors)
    
    if (!isValid) {
      setIsSubmitting(false)
      setIsValidating(false)
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors before submitting.'
      })
      return
    }
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = submitForm()
    setIsSubmitting(false)
    setIsValidating(false)
    
    if (result.success) {
      addNotification({
        type: 'success',
        title: 'Form Submitted',
        message: `Confirmation: ${result.submission.confirmationNumber}`
      })
    }
  }, [validateAll, submitForm, addNotification])

  const completion = getFormCompletion()

  const currentFormInfo = forms.find(f => f.id === currentForm)

  return (
    <div className="form-generation">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Automated Form Generation
        </motion.h1>
        <p>Let AEGIS help you prepare and complete immigration forms with AI-powered validation and auto-fill.</p>
      </div>

      {/* Form Selector */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <FormInput size={20} style={{ color: 'var(--color-secondary)' }} />
          <h4 style={{ margin: 0 }}>Select Form Type</h4>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          {forms.map(form => (
            <motion.button
              key={form.id}
              className={`glass-button ${currentForm === form.id ? 'primary' : ''}`}
              onClick={() => setCurrentForm(form.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
            >
              <FileText size={16} />
              {form.id}
            </motion.button>
          ))}
        </div>
        <div style={{ 
          marginTop: 'var(--spacing-md)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: 'var(--bg-glass)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          <strong>{currentForm}:</strong> {currentFormInfo?.name} • Category: {currentFormInfo?.category}
        </div>
      </div>

      {/* Progress and Actions Bar */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Form Completion</span>
              <span style={{ fontWeight: '600' }}>{completion}%</span>
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
                  background: completion >= 100 
                    ? 'var(--color-success)' 
                    : 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)'
                }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
            {lastSaved && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <motion.button 
              className="glass-button"
              onClick={handleAutoFill}
              disabled={autoFilling}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={18} />
              {autoFilling ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                'Auto-fill'
              )}
            </motion.button>
            <motion.button 
              className="glass-button"
              onClick={handleSaveDraft}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={18} />
              Save Draft
            </motion.button>
            <motion.button 
              className="glass-button primary"
              onClick={() => setShowPreview(!showPreview)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye size={18} />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>
        {/* Form Builder */}
        <motion.div
          className="glass form-builder"
          style={{ padding: 'var(--spacing-xl)' }}
          animate={{ width: showPreview ? '100%' : '100%' }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <FileText size={20} style={{ color: 'var(--color-secondary)' }} />
              {currentForm} Details
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
              {Object.keys(fieldErrors).length > 0 && (
                <span style={{ 
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertCircle size={12} />
                  {Object.keys(fieldErrors).length} errors
                </span>
              )}
            </div>
          </div>

          {/* Section Navigation */}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
            {sections.map(section => (
              <motion.button
                key={section.id}
                className={`glass-button ${activeSection === section.id ? 'primary' : ''}`}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
              >
                <section.icon size={16} />
                {section.label}
              </motion.button>
            ))}
          </div>

          {/* Form Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'personal' && (
                <div className="form-section">
                  <div className="form-group">
                    <label>
                      Full Legal Name (as it appears on passport)
                      <span style={{ color: 'var(--color-danger)' }}> *</span>
                    </label>
                    <input 
                      type="text" 
                      className={`glass-input ${fieldErrors.fullName ? 'error' : ''}`}
                      placeholder="Enter your full legal name"
                      value={formData.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                    {fieldErrors.fullName && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{fieldErrors.fullName}</span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>
                        Date of Birth
                        <span style={{ color: 'var(--color-danger)' }}> *</span>
                      </label>
                      <input 
                        type="date" 
                        className="glass-input"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Country of Birth
                        <span style={{ color: 'var(--color-danger)' }}> *</span>
                      </label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="Country of birth"
                        value={formData.countryOfBirth || ''}
                        onChange={(e) => handleInputChange('countryOfBirth', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>Alien Registration Number (A-Number)</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="XXX-XXX-XXX"
                        value={formData.alienNumber || ''}
                        onChange={(e) => handleInputChange('alienNumber', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Social Security Number</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="XXX-XX-XXXX"
                        value={formData.ssn || ''}
                        onChange={(e) => handleInputChange('ssn', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                      {['Male', 'Female', 'Other', 'Prefer not to say'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="gender" 
                            value={option}
                            checked={formData.gender === option}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            style={{ accentColor: 'var(--color-secondary)' }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Marital Status</label>
                    <select 
                      className="glass-input"
                      value={formData.maritalStatus || ''}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    >
                      <option value="">Select marital status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                      <option value="separated">Separated</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'address' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>Current Address</h4>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input 
                      type="text" 
                      className="glass-input"
                      placeholder="Street address"
                      value={formData.street || ''}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>City</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="City"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="State"
                        value={formData.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="ZIP"
                        value={formData.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <h4 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>Mailing Address</h4>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={formData.sameAddress || false}
                        onChange={(e) => handleInputChange('sameAddress', e.target.checked)}
                        style={{ accentColor: 'var(--color-secondary)' }}
                      />
                      Same as current address
                    </label>
                  </div>
                </div>
              )}

              {activeSection === 'family' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>Spouse Information</h4>
                  <div className="form-group">
                    <label>Spouse's Full Legal Name</label>
                    <input 
                      type="text" 
                      className="glass-input"
                      placeholder="Spouse's full name"
                      value={formData.spouseName || ''}
                      onChange={(e) => handleInputChange('spouseName', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>Date of Marriage</label>
                      <input 
                        type="date" 
                        className="glass-input"
                        value={formData.marriageDate || ''}
                        onChange={(e) => handleInputChange('marriageDate', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Place of Marriage (City, Country)</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="City, Country"
                        value={formData.marriagePlace || ''}
                        onChange={(e) => handleInputChange('marriagePlace', e.target.value)}
                      />
                    </div>
                  </div>

                  <h4 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>Children Information</h4>
                  <div className="form-group">
                    <label>Number of Children</label>
                    <select className="glass-input" value={formData.numChildren || ''} onChange={(e) => handleInputChange('numChildren', e.target.value)}>
                      <option value="">Select number</option>
                      {[0, 1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'employment' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>Current Employment</h4>
                  <div className="form-group">
                    <label>Current Employer Name</label>
                    <input 
                      type="text" 
                      className="glass-input"
                      placeholder="Employer name"
                      value={formData.employer || ''}
                      onChange={(e) => handleInputChange('employer', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>Position/Title</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="Your job title"
                        value={formData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input 
                        type="date" 
                        className="glass-input"
                        value={formData.employmentStart || ''}
                        onChange={(e) => handleInputChange('employmentStart', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Employer Address</label>
                    <input 
                      type="text" 
                      className="glass-input"
                      placeholder="Employer full address"
                      value={formData.employerAddress || ''}
                      onChange={(e) => handleInputChange('employerAddress', e.target.value)}
                    />
                  </div>

                  <h4 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>Previous Employment (Past 5 Years)</h4>
                  <div className="form-group">
                    <label>Have you had other employers in the past 5 years?</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="prevEmployer" 
                            value={option}
                            checked={formData.prevEmployer === option}
                            onChange={(e) => handleInputChange('prevEmployer', e.target.value)}
                            style={{ accentColor: 'var(--color-secondary)' }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'eligibility' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>Eligibility Questions</h4>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                    Answer the following questions about your eligibility. Careful review is required as false answers can result in denial.
                  </p>

                  {[
                    { id: 'criminal', question: 'Have you ever been arrested, cited, or detained by any law enforcement officer?' },
                    { id: 'worked', question: 'Have you ever worked in the U.S. without authorization?' },
                    { id: 'deported', question: 'Have you ever been removed, excluded, or deported from the United States?' },
                    { id: 'visaFraud', question: 'Have you ever committed visa fraud or willfully misrepresented a material fact?' },
                    { id: 'publicCharge', question: 'Are you likely to become a public charge?' },
                    { id: 'communicable', question: 'Do you have a communicable disease of public health significance?' }
                  ].map((item, index) => (
                    <div 
                      key={item.id}
                      style={{ 
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                        <span style={{ fontWeight: '600', marginRight: '8px' }}>{index + 1}.</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ marginBottom: 'var(--spacing-sm)' }}>{item.question}</p>
                          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            {['Yes', 'No'].map(option => (
                              <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                                <input 
                                  type="radio" 
                                  name={item.id} 
                                  value={option}
                                  checked={formData[item.id] === option}
                                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                                  style={{ accentColor: 'var(--color-secondary)' }}
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ 
                    marginTop: 'var(--spacing-xl)',
                    padding: 'var(--spacing-md)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    alignItems: 'flex-start'
                  }}>
                    <AlertCircle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--color-danger)', marginBottom: '4px' }}>Important</div>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>
                        If you answer "Yes" to any question, you must provide a detailed explanation on a separate sheet.
                        AEGIS can help you prepare this explanation - consult with an immigration attorney for legal advice.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Form Actions */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-md)', 
            marginTop: 'var(--spacing-xl)',
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid var(--glass-border)'
          }}>
            <button className="glass-button" style={{ flex: 1 }}>
              <Download size={18} />
              Download PDF
            </button>
            <motion.button 
              className="glass-button primary" 
              style={{ flex: 1 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Form
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Live Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass" style={{ padding: 'var(--spacing-lg)', position: 'sticky', top: '100px' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Eye size={20} />
                  Live Form Preview
                </h3>
                
                <div className="form-preview" style={{ 
                  background: 'white', 
                  color: '#000', 
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  maxHeight: '600px',
                  overflow: 'auto'
                }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#000', margin: 0 }}>U.S. Citizenship</h2>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>and Immigration Services</div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#000', margin: 0 }}>{currentForm}</h2>
                    <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>
                      {currentFormInfo?.name}
                    </p>
                  </div>

                  <div style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div className="form-field" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '600' }}>Name (Family, Given, Middle)</label>
                        <input 
                          type="text" 
                          value={formData.fullName || ''} 
                          readOnly 
                          placeholder="As it appears on passport"
                          style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div className="form-field" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '600' }}>Date of Birth</label>
                        <input 
                          type="text" 
                          value={formData.dateOfBirth || ''} 
                          readOnly 
                          placeholder="MM/DD/YYYY"
                          style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div className="form-field" style={{ flex: 2 }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '600' }}>Country of Birth</label>
                        <input 
                          type="text" 
                          value={formData.countryOfBirth || ''} 
                          readOnly 
                          style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div className="form-field" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '600' }}>A-Number</label>
                        <input 
                          type="text" 
                          value={formData.alienNumber || ''} 
                          readOnly 
                          placeholder="XXX-XXX-XXX"
                          style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div className="form-field" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '600' }}>SSN</label>
                        <input 
                          type="text" 
                          value={formData.ssn || ''} 
                          readOnly 
                          placeholder="XXX-XX-XXXX"
                          style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Current Address</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <input 
                        type="text" 
                        value={formData.street || ''} 
                        readOnly 
                        placeholder="Street Address"
                        style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          value={formData.city || ''} 
                          readOnly 
                          placeholder="City" 
                          style={{ flex: 2, padding: '4px', border: '1px solid #ccc' }}
                        />
                        <input 
                          type="text" 
                          value={formData.state || ''} 
                          readOnly 
                          placeholder="State" 
                          style={{ flex: 1, padding: '4px', border: '1px solid #ccc' }}
                        />
                        <input 
                          type="text" 
                          value={formData.zipCode || ''} 
                          readOnly 
                          placeholder="ZIP" 
                          style={{ flex: 1, padding: '4px', border: '1px solid #ccc' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', padding: '8px', background: '#f5f5f5' }}>
                    <p style={{ fontSize: '0.7rem', color: '#666', margin: 0 }}>
                      Form preview only. Not an official government form.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Drafts */}
      {drafts.length > 0 && (
        <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Drafts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {drafts.slice(0, 3).map((draft) => (
              <div 
                key={draft.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <FileText size={18} style={{ color: 'var(--text-muted)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{draft.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Last modified: {new Date(draft.lastModified).toLocaleDateString()}
                  </div>
                </div>
                <button className="glass-button" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}>
                  <RotateCcw size={14} />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FormGeneration
