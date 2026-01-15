import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FormInput, FileText, Save, Download, Send, 
  Check, ChevronRight, ChevronLeft, Sparkles, 
  User, MapPin, Calendar, FileCheck, AlertCircle,
  Briefcase, FileSignature, Eye, RotateCcw, Loader2,
  Building, Plane, Users, GraduationCap, Heart,
  Clock, Cloud, CloudOff
} from 'lucide-react'
import { 
  useFormStore, 
  useUserStore,
  useGlobalStore 
} from '../utils/enhancedStore'

// ========================================
// FORM STEPPER COMPONENT
// ========================================
const FormStepper = ({ sections, activeSection, onSectionSelect, completion }) => {
  const currentIndex = sections.findIndex(s => s.id === activeSection)
  
  return (
    <div style={{ 
      marginBottom: 'var(--spacing-xl)',
      padding: 'var(--spacing-md)',
      background: 'var(--bg-glass)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--glass-border)'
    }}>
      {/* Progress Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--glass-border)',
          transform: 'translateY(-50%)',
          zIndex: 0
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-full)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (sections.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {sections.map((section, index) => {
          const isActive = section.id === activeSection
          const isCompleted = index < currentIndex
          
          return (
            <motion.button
              key={section.id}
              onClick={() => onSectionSelect(section.id)}
              style={{
                position: 'relative',
                zIndex: 1,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: isActive || isCompleted 
                  ? 'var(--gradient-primary)' 
                  : 'var(--glass-surface)',
                color: isActive || isCompleted ? 'white' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCompleted ? (
                <Check size={18} />
              ) : (
                <section.icon size={18} />
              )}
              
              {/* Tooltip */}
              <span style={{
                position: 'absolute',
                bottom: '-30px',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap',
                color: 'var(--text-secondary)',
                opacity: isActive ? 1 : 0.7,
                pointerEvents: 'none'
              }}>
                {section.label}
              </span>
            </motion.button>
          )
        })}
      </div>
      
      {/* Section Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.7rem',
        color: 'var(--text-muted)'
      }}>
        <span>Start</span>
        <span>Step {currentIndex + 1} of {sections.length}</span>
        <span>Finish</span>
      </div>
      
      {/* Completion Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        marginTop: 'var(--spacing-md)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        background: completion >= 100 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(59, 130, 246, 0.1)',
        borderRadius: 'var(--radius-full)',
        width: 'fit-content',
        margin: 'var(--spacing-md) auto 0'
      }}>
        {completion >= 100 ? (
          <>
            <Check size={16} style={{ color: 'var(--color-success)' }} />
            <span style={{ 
              fontSize: '0.8rem', 
              color: 'var(--color-success)',
              fontWeight: '600'
            }}>
              Form Complete
            </span>
          </>
        ) : (
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'var(--text-secondary)'
          }}>
            {completion}% Complete
          </span>
        )}
      </div>
    </div>
  )
}

// ========================================
// AUTO-SAVE INDICATOR COMPONENT
// ========================================
const AutoSaveIndicator = ({ lastSaved, isSaving }) => {
  if (isSaving) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: '0.75rem',
          color: 'var(--color-warning)'
        }}
      >
        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Saving...</span>
      </motion.div>
    )
  }
  
  if (lastSaved) {
    const timeAgo = Math.round((new Date() - lastSaved) / 1000)
    const displayTime = timeAgo < 60 
      ? 'Just now' 
      : timeAgo < 3600 
        ? `${Math.round(timeAgo / 60)}m ago` 
        : `${Math.round(timeAgo / 3600)}h ago`
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: '0.75rem',
          color: 'var(--color-success)'
        }}
      >
        <Cloud size={14} />
        <span>Saved {displayTime}</span>
      </motion.div>
    )
  }
  
  return null
}

// ========================================
// EMPTY STATE COMPONENT
// ========================================
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-xxl)',
      textAlign: 'center',
      background: 'var(--bg-glass)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--glass-border)'
    }}
  >
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'rgba(59, 130, 246, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 'var(--spacing-lg)'
    }}>
      <Icon size={40} style={{ color: 'var(--color-secondary)' }} />
    </div>
    <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>
      {title}
    </h3>
    <p style={{ 
      color: 'var(--text-secondary)', 
      marginBottom: 'var(--spacing-lg)',
      maxWidth: '400px'
    }}>
      {description}
    </p>
    {action}
  </motion.div>
)

// Detailed form configurations for actual US Immigration forms
const IMMIGRATION_FORMS = {
  'I-485': {
    name: 'Application to Register Permanent Residence or Adjust Status',
    category: 'Adjustment of Status',
    edition: '02/04/24',
    fee: '$1140',
    uscisLockbox: true,
    description: 'Application to register permanent residence or adjust status. Required for individuals seeking to become permanent residents.',
    requiredDocs: ['Passport', 'Birth Certificate', 'I-94', 'Medical Examination', 'Photographs', 'I-797 (if applicable)'],
    sections: ['personal', 'address', 'family', 'travel', 'employment', 'background', 'signatures'],
    specificFields: [
      'classOfAdmission', 'arrivalDate', 'i94Number', 'passportNumber', 'passportIssueDate', 'passportExpiration',
      'currentImmigrationStatus', 'dateStatusExpires', 'filingFromInsideUS', 'maritalStatusAtFiling',
      'priorMarriages', 'priorSpouseInfo', 'childrenInfo', 'parentsInfo',
      'travelHistory', 'tripsOutsideUS', 'taxReturns', 'publicAssistance',
      'criminalHistory', 'prostitution', 'smuggling', 'votingHistory',
      'selectiveService', 'militaryService', 'diplomaticProtection'
    ]
  },
  'I-130': {
    name: 'Petition for Alien Relative',
    category: 'Family-Based',
    edition: '01/10/24',
    fee: '$535',
    uscisLockbox: true,
    description: 'Petition for an alien relative. Establishes the family relationship between petitioner and beneficiary.',
    requiredDocs: ['Petitioner Passport/ID', 'Birth Certificate', 'Marriage Certificate', 'Beneficiary Passport', 'Photos'],
    sections: ['petitioner', 'beneficiary', 'relationship', 'additionalBeneficiaries', 'biographic', 'signatures'],
    specificFields: [
      'petitionerType', 'petitionerDOB', 'petitionerCountryOfBirth', 'petitionerDOBPlace',
      'beneficiaryName', 'beneficiaryDOB', 'beneficiaryCountryOfBirth', 'beneficiaryNationality',
      'relationshipType', 'dateOfMarriage', 'placeOfMarriage', 'priorRelatedPetitions',
      'beneficiaryAddress', 'beneficiaryPhone', 'beneficiaryEmail',
      'beneficiaryDOBPlace', 'beneficiaryRaceEthnicity', 'beneficiaryHeight', 'beneficiaryEyeColor', 'beneficiaryHairColor'
    ]
  },
  'I-131': {
    name: 'Application for Travel Document',
    category: 'Travel Documents',
    edition: '01/10/24',
    fee: '$0-$575',
    uscisLockbox: true,
    description: 'Application for travel document for advance parole, refugee travel document, or reentry permit.',
    requiredDocs: ['Passport', 'I-94', 'Photos', 'I-797 Approval Notice (if applicable)'],
    sections: ['personal', 'travel', 'international', 'additionalInfo', 'signatures'],
    specificFields: [
      'travelDocumentType', 'purposeOfTravel', 'destinationCountry', 'expectedDepartureDate',
      'expectedReturnDate', 'intendedLengthOfTrip', 'countriesToVisit',
      'priorTravelDocuments', 'lostPassportInfo', 'stolenPassportInfo',
      'uscisReceiptNumber', 'applicationType', 'reexamination'
    ]
  },
  'I-765': {
    name: 'Application for Employment Authorization',
    category: 'Work Authorization',
    edition: '01/10/24',
    fee: '$0-$520',
    uscisLockbox: true,
    description: 'Application for employment authorization document (EAD) to work legally in the United States.',
    requiredDocs: ['Passport', 'I-94', 'Photos', 'I-797 (if applicable)'],
    sections: ['personal', 'eligibility', 'additionalInfo', 'signatures'],
    specificFields: [
      'eligibilityCategory', 'c33Statement', 'previousEAD', 'ssnRequest',
      'mailingAddress', 'careOfAddress', 'foreignNationalId', 'alienNumber'
    ]
  },
  'N-400': {
    name: 'Application for Naturalization',
    category: 'Citizenship',
    edition: '01/10/24',
    fee: '$640',
    uscisLockbox: true,
    description: 'Application for naturalization to become a U.S. citizen. Must meet eligibility requirements.',
    requiredDocs: ['Green Card', 'Photographs', 'Marriage Certificate (if applicable)', 'Tax Returns'],
    sections: ['personal', 'residence', 'employment', 'family', 'travel', 'moralCharacter', 'military', 'signatures'],
    specificFields: [
      'dateOfPermanentResidence', 'continuousResidence5Years', 'physicalPresenceInUS',
      ' maritalStatus', 'spouseInfo', 'childrenInfo', 'parentsInfo',
      'employmentHistory5Years', 'taxesFiled', 'selectiveService',
      'everInMilitary', 'usMilitary', 'otherMilitary',
      'naziAffiliation', 'genocide', 'persecution', 'torture',
      'votingOutsideUS', 'pollingOutsideUS', 'formalRenunciation',
      'testedEnglish', 'testedCivics', 'waiverRequest'
    ]
  },
  'I-589': {
    name: 'Application for Asylum and for Withholding of Removal',
    category: 'Asylum',
    edition: '08/04/24',
    fee: '$0',
    uscisLockbox: false,
    description: 'Application for asylum protection in the United States based on persecution.',
    requiredDocs: ['Identity Document', 'Photos', 'Supporting Evidence'],
    sections: ['applicant', 'spouseChildren', 'ethnicity', 'religion', 'politicalOpinion', 'pastHarm', 'fears', 'countryInfo', 'travel', 'family'],
    specificFields: [
      'dateArrivedUS', 'statusAtEntry', 'portOfEntry', 'familyMembersAbroad',
      'persecutionBasis', 'persecutorIdentity', 'specificIncidents',
      'fearDetails', 'countryConditions', 'policeRecords',
      'priorApplications', 'applicantOrganization', 'familyInUS'
    ]
  },
  'I-90': {
    name: 'Application to Replace Permanent Resident Card',
    category: 'Green Card Services',
    edition: '01/10/24',
    fee: '$415',
    uscisLockbox: true,
    description: 'Application to replace your Green Card (Permanent Resident Card).',
    requiredDocs: ['Old Green Card', 'Passport', 'Photos', 'Biometrics'],
    sections: ['personal', 'cardInfo', 'reason', 'additionalInfo', 'signatures'],
    specificFields: [
      'reasonForReplacement', 'lostCardDate', 'stolenCardDate', 'cardNeverReceived',
      'cardDamaged', 'incorrectData', 'expiredCard', 'updatedCard',
      'uscisOnlineAccount', 'uscisOnlineNumber'
    ]
  },
  'I-821D': {
    name: 'Request for Deferred Action for Childhood Arrivals',
    category: 'DACA',
    edition: '08/08/24',
    fee: '$0',
    uscisLockbox: false,
    description: 'Request for DACA - deferred action for childhood arrivals.',
    requiredDocs: ['Identity Documents', 'Evidence of Education', 'Continuous Residence Proof'],
    sections: ['personal', 'dacaEligibility', 'education', 'military', 'travel', 'criminal', 'signatures'],
    specificFields: [
      'arrivedUSUnderAge16', 'underAge31OnDACA', 'continuousResidenceSince2007',
      'presentOnJune15_2012', 'noLegalStatusOnJune15_2012', 'noCriminalHistory',
      'educationStatus', 'militaryService', 'travelHistoryDACA'
    ]
  }
}

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
  const [isSaving, setIsSaving] = useState(false)
  const [formCategory, setFormCategory] = useState('all')
  
  // Auto-save timeout ref
  const autoSaveTimeoutRef = useRef(null)
  
  // Load saved form data from localStorage on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(`aegis_form_${currentForm}`)
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData)
        if (parsed && Object.keys(parsed).length > 0) {
          // Merge saved data with form store
          Object.entries(parsed).forEach(([key, value]) => {
            setFormData(key, value)
          })
          addNotification({
            type: 'info',
            title: 'Draft Restored',
            message: 'Your previous progress has been restored.'
          })
        }
      } catch (e) {
        console.error('Failed to load saved form data:', e)
      }
    }
  }, [currentForm, setFormData, addNotification])
  
  // Auto-save functionality
  const autoSave = useCallback((data) => {
    setIsSaving(true)
    localStorage.setItem(`aegis_form_${currentForm}`, JSON.stringify(data))
    
    // Simulate network delay for realism
    setTimeout(() => {
      setLastSaved(new Date())
      setIsSaving(false)
    }, 500)
  }, [currentForm])
  
  // Auto-save when form data changes
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        autoSave(formData)
      }
    }, 2000) // Auto-save after 2 seconds of inactivity
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [formData, autoSave])
  
  // Clear auto-save when form is submitted
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  const forms = Object.entries(IMMIGRATION_FORMS).map(([id, config]) => ({
    id,
    ...config
  }))

  const categoryIcons = {
    'Adjustment of Status': FileSignature,
    'Family-Based': Heart,
    'Travel Documents': Plane,
    'Work Authorization': Briefcase,
    'Citizenship': GraduationCap,
    'Asylum': Users,
    'Green Card Services': Building
  }

  const filteredForms = formCategory === 'all' 
    ? forms 
    : forms.filter(f => f.category === formCategory)

  const getCategoryIcon = (category) => {
    const IconComponent = categoryIcons[category] || FileText
    return <IconComponent size={16} />
  }

  const handleAutoFill = useCallback(() => {
    setAutoFilling(true)
    
    // Simulate AI extracting data from user profile and documents
    setTimeout(() => {
      setFormData('fullName', user.name || 'JOHNSON MICHAEL ROBERT')
      setFormData('dateOfBirth', user.dateOfBirth || '1985-03-15')
      setFormData('countryOfBirth', user.countryOfBirth || 'UNITED STATES')
      setFormData('alienNumber', user.alienNumber || '123-456-789')
      setFormData('ssn', user.ssn || '123-45-6789')
      setFormData('street', user.address?.split(',')[0] || '123 MAIN STREET')
      setFormData('city', user.address?.split(',')[1]?.trim() || 'SAN FRANCISCO')
      setFormData('state', 'CA')
      setFormData('zipCode', '94102')
      setFormData('maritalStatus', user.maritalStatus || 'MARRIED')
      setFormData('spouseName', user.spouseName || 'JOHNSON SARAH JANE')
      setFormData('marriageDate', user.marriageDate || '2010-06-15')
      setFormData('employer', user.employer || 'ACME CORPORATION')
      setFormData('position', user.position || 'SOFTWARE ENGINEER')
      setFormData('employmentStart', user.employmentStart || '2015-01-01')
      
      // Form-specific data
      if (currentForm === 'I-485') {
        setFormData('classOfAdmission', 'H-1B')
        setFormData('arrivalDate', '2010-01-15')
        setFormData('i94Number', 'WAC 12345678901')
        setFormData('currentImmigrationStatus', 'H-1B')
      }
      
      if (currentForm === 'N-400') {
        setFormData('dateOfPermanentResidence', '2015-05-20')
        setFormData('continuousResidence5Years', 'YES')
        setFormData('physicalPresenceInUS', '36 months')
      }
      
      setAutoFilling(false)
      setLastSaved(new Date())
      
      addNotification({
        type: 'success',
        title: 'Auto-fill Complete',
        message: 'Form fields have been populated from your profile and documents.'
      })
    }, 2000)
  }, [user, setFormData, currentForm, addNotification])

  const handleInputChange = useCallback((field, value) => {
    setFormData(field, value)
    
    // Real-time validation with immediate feedback
    const { valid, error } = validateField(field, value)
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }))
    
    // Show error inline if invalid
    if (error && value) {
      addNotification({
        type: 'warning',
        title: 'Validation',
        message: error
      })
    }
  }, [setFormData, validateField, addNotification])

  const handleSaveDraft = useCallback(() => {
    const draftId = saveDraft()
    setLastSaved(new Date())
    
    // Also save to localStorage
    localStorage.setItem(`aegis_form_${currentForm}`, JSON.stringify(formData))
    
    addNotification({
      type: 'success',
      title: 'Draft Saved',
      message: `${currentForm} draft has been saved successfully.`
    })
  }, [saveDraft, currentForm, formData, addNotification])

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
    
    // Simulate submission to USCIS
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const confirmationNumber = 'WAC' + Math.random().toString(36).substr(2, 10).toUpperCase()
    const result = submitForm()
    setIsSubmitting(false)
    setIsValidating(false)
    
    if (result.success) {
      // Clear localStorage after successful submission
      localStorage.removeItem(`aegis_form_${currentForm}`)
      setLastSaved(null)
      
      addNotification({
        type: 'success',
        title: 'Form Submitted to USCIS',
        message: `Confirmation: ${confirmationNumber}. You will receive a receipt notice.`
      })
    }
  }, [validateAll, submitForm, currentForm, addNotification])

  const completion = getFormCompletion()
  const currentFormInfo = forms.find(f => f.id === currentForm)

  const getSectionsForForm = () => {
    if (!currentFormInfo) return []
    const baseSections = [
      { id: 'personal', label: 'Personal Information', icon: User },
      { id: 'address', label: 'Address History', icon: MapPin },
      { id: 'family', label: 'Family Information', icon: Users }
    ]
    
    if (currentForm === 'I-485') {
      return [
        ...baseSections,
        { id: 'travel', label: 'Travel History', icon: Plane },
        { id: 'employment', label: 'Employment', icon: Briefcase },
        { id: 'background', label: 'Background', icon: AlertCircle },
        { id: 'signatures', label: 'Certifications', icon: FileSignature }
      ]
    }
    
    if (currentForm === 'N-400') {
      return [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'residence', label: 'Residence', icon: MapPin },
        { id: 'employment', label: 'Employment', icon: Briefcase },
        { id: 'family', label: 'Family', icon: Users },
        { id: 'travel', label: 'Travel', icon: Plane },
        { id: 'moralCharacter', label: 'Moral Character', icon: Check },
        { id: 'military', label: 'Military', icon: Users },
        { id: 'signatures', label: 'Oath', icon: FileSignature }
      ]
    }
    
    if (currentForm === 'I-130') {
      return [
        { id: 'petitioner', label: 'Petitioner', icon: User },
        { id: 'beneficiary', label: 'Beneficiary', icon: Users },
        { id: 'relationship', label: 'Relationship', icon: Heart },
        { id: 'biographic', label: 'Biographic', icon: FileText },
        { id: 'signatures', label: 'Certifications', icon: FileSignature }
      ]
    }
    
    return baseSections
  }

  const formSections = getSectionsForForm()

  return (
    <div className="form-generation">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Official Immigration Form Preparation
        </motion.h1>
        <p>Complete official U.S. Citizenship and Immigration Services (USCIS) forms with AI-powered assistance.</p>
      </div>

      {/* Form Info Banner */}
      {currentFormInfo && (
        <motion.div 
          className="glass"
          style={{ 
            padding: 'var(--spacing-lg)', 
            marginBottom: 'var(--spacing-xl)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
            <div style={{ 
              padding: '12px', 
              background: 'var(--color-secondary)', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={24} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: '4px' }}>
                <h3 style={{ margin: 0 }}>{currentForm}</h3>
                <span style={{ 
                  padding: '2px 8px', 
                  background: 'rgba(59, 130, 246, 0.2)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-accent)'
                }}>
                  Edition: {currentFormInfo.edition}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', margin: 0, marginBottom: '8px' }}>{currentFormInfo.name}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{currentFormInfo.description}</p>
            </div>
            <div style={{ 
              padding: 'var(--spacing-md)', 
              background: 'var(--bg-glass)', 
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-secondary)' }}>
                ${currentFormInfo.fee}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filing Fee</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="glass" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          <button
            className={`glass-button ${formCategory === 'all' ? 'primary' : ''}`}
            onClick={() => setFormCategory('all')}
            style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
          >
            All Forms
          </button>
          {Object.keys(categoryIcons).map(category => (
            <button
              key={category}
              className={`glass-button ${formCategory === category ? 'primary' : ''}`}
              onClick={() => setFormCategory(category)}
              style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Form Selector */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <FormInput size={20} style={{ color: 'var(--color-secondary)' }} />
          <h4 style={{ margin: 0 }}>Select Form to Prepare</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-sm)' }}>
          {filteredForms.map(form => (
            <motion.button
              key={form.id}
              className={`glass-button ${currentForm === form.id ? 'primary' : ''}`}
              onClick={() => setCurrentForm(form.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                padding: 'var(--spacing-md)', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', width: '100%' }}>
                <FileText size={16} />
                <span style={{ fontWeight: '600' }}>{form.id}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {form.category}
              </span>
            </motion.button>
          ))}
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
          
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Auto-save indicator */}
            <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
            
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
                  Extracting...
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

      {/* Required Documents */}
      {currentFormInfo && (
        <div className="glass" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            <Check size={16} style={{ color: 'var(--color-success)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Required Documents</h4>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            {currentFormInfo.requiredDocs.map((doc, index) => (
              <span 
                key={index}
                style={{ 
                  padding: '4px 12px', 
                  background: 'var(--bg-glass)', 
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem'
                }}
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>
        {/* Form Builder */}
        <motion.div
          className="glass form-builder"
          style={{ padding: 'var(--spacing-xl)' }}
          animate={{ width: showPreview ? '100%' : '100%' }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <FileText size={20} style={{ color: 'var(--color-secondary)' }} />
              {currentForm} - Form Details
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
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

          {/* Form Stepper */}
          {currentForm && formSections.length > 0 && (
            <FormStepper 
              sections={formSections}
              activeSection={activeSection}
              onSectionSelect={setActiveSection}
              completion={completion}
            />
          )}

          {/* Form Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Personal Information Section */}
              {activeSection === 'personal' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 1 - Personal Information</h4>
                  
                  <div className="form-group">
                    <label>
                      Full Legal Name (Family Name / Given Name / Middle Name)
                      <span style={{ color: 'var(--color-danger)' }}> *</span>
                    </label>
                    <input 
                      type="text" 
                      className={`glass-input ${fieldErrors.fullName ? 'error' : ''}`}
                      placeholder="Family Name, Given Name, Middle Name"
                      value={formData.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      As it appears on your passport or government-issued ID
                    </span>
                    {fieldErrors.fullName && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{fieldErrors.fullName}</span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
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
                        placeholder="City, Country"
                        value={formData.countryOfBirth || ''}
                        onChange={(e) => handleInputChange('countryOfBirth', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Country of Nationality</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="Country"
                        value={formData.countryOfNationality || ''}
                        onChange={(e) => handleInputChange('countryOfNationality', e.target.value)}
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
                      <label>Social Security Number (SSN)</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="XXX-XX-XXXX"
                        value={formData.ssn || ''}
                        onChange={(e) => handleInputChange('ssn', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>Gender</label>
                      <select 
                        className="glass-input"
                        value={formData.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Marital Status</label>
                      <select 
                        className="glass-input"
                        value={formData.maritalStatus || ''}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Legally Separated">Legally Separated</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Have you previously filed this form?</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="previousFiling" 
                            value={option}
                            checked={formData.previousFiling === option}
                            onChange={(e) => handleInputChange('previousFiling', e.target.value)}
                            style={{ accentColor: 'var(--color-secondary)' }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Address Section */}
              {activeSection === 'address' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 2 - Address Information</h4>
                  
                  <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Current Physical Address</h5>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input 
                      type="text" 
                      className="glass-input"
                      placeholder="Street number and name"
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
                        placeholder="XXXXX"
                        value={formData.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>County</label>
                    <input 
                      type="text" 
                      className="glass-input"
                      placeholder="County"
                      value={formData.county || ''}
                      onChange={(e) => handleInputChange('county', e.target.value)}
                    />
                  </div>

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Mailing Address</h5>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={formData.sameAddress || false}
                        onChange={(e) => handleInputChange('sameAddress', e.target.checked)}
                        style={{ accentColor: 'var(--color-secondary)' }}
                      />
                      <span>Mailing address is the same as current physical address</span>
                    </label>
                  </div>

                  {!formData.sameAddress && (
                    <>
                      <div className="form-group">
                        <label>In Care Of Name</label>
                        <input 
                          type="text" 
                          className="glass-input"
                          placeholder="In care of (if applicable)"
                          value={formData.careOfName || ''}
                          onChange={(e) => handleInputChange('careOfName', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Mailing Street Address</label>
                        <input 
                          type="text" 
                          className="glass-input"
                          placeholder="Street address"
                          value={formData.mailingStreet || ''}
                          onChange={(e) => handleInputChange('mailingStreet', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                          <label>City</label>
                          <input 
                            type="text" 
                            className="glass-input"
                            placeholder="City"
                            value={formData.mailingCity || ''}
                            onChange={(e) => handleInputChange('mailingCity', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <input 
                            type="text" 
                            className="glass-input"
                            placeholder="State"
                            value={formData.mailingState || ''}
                            onChange={(e) => handleInputChange('mailingState', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>ZIP</label>
                          <input 
                            type="text" 
                            className="glass-input"
                            placeholder="XXXXX"
                            value={formData.mailingZip || ''}
                            onChange={(e) => handleInputChange('mailingZip', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Family Section */}
              {activeSection === 'family' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 3 - Family Information</h4>
                  
                  {currentForm === 'I-130' ? (
                    <>
                      <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Spouse Information (if applicable)</h5>
                      <div className="form-group">
                        <label>Spouse's Full Legal Name</label>
                        <input 
                          type="text" 
                          className="glass-input"
                          placeholder="Family Name, Given Name, Middle Name"
                          value={formData.spouseName || ''}
                          onChange={(e) => handleInputChange('spouseName', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                          <label>Spouse Date of Birth</label>
                          <input 
                            type="date" 
                            className="glass-input"
                            value={formData.spouseDOB || ''}
                            onChange={(e) => handleInputChange('spouseDOB', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Spouse Country of Birth</label>
                          <input 
                            type="text" 
                            className="glass-input"
                            placeholder="Country"
                            value={formData.spouseCountryBirth || ''}
                            onChange={(e) => handleInputChange('spouseCountryBirth', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Spouse Information</h5>
                      <div className="form-group">
                        <label>Spouse's Full Legal Name</label>
                        <input 
                          type="text" 
                          className="glass-input"
                          placeholder="Family Name, Given Name, Middle Name"
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
                          <label>Place of Marriage</label>
                          <input 
                            type="text" 
                            className="glass-input"
                            placeholder="City, State, Country"
                            value={formData.marriagePlace || ''}
                            onChange={(e) => handleInputChange('marriagePlace', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Children Information</h5>
                  <div className="form-group">
                    <label>Number of Children</label>
                    <select className="glass-input" value={formData.numChildren || ''} onChange={(e) => handleInputChange('numChildren', e.target.value)}>
                      <option value="">Select</option>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  {formData.numChildren > 0 && (
                    <div className="form-group">
                      <label>Children's Names and Information</label>
                      <textarea 
                        className="glass-input"
                        placeholder="Child 1: Full Name, Date of Birth, Country of Birth&#10;Child 2: Full Name, Date of Birth, Country of Birth"
                        rows={4}
                        value={formData.childrenInfo || ''}
                        onChange={(e) => handleInputChange('childrenInfo', e.target.value)}
                        style={{ resize: 'vertical', minHeight: '100px' }}
                      />
                    </div>
                  )}

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Parents Information</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>Father's Full Name</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="Family Name, Given Name"
                        value={formData.fatherName || ''}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mother's Full Name</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="Family Name, Given Name"
                        value={formData.motherName || ''}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Employment Section */}
              {activeSection === 'employment' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 4 - Employment History</h4>
                  
                  <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Current Employer</h5>
                  <div className="form-group">
                    <label>Employer Name</label>
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
                        placeholder="Job title"
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
                      placeholder="Street address, City, State, ZIP"
                      value={formData.employerAddress || ''}
                      onChange={(e) => handleInputChange('employerAddress', e.target.value)}
                    />
                  </div>

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Previous Employment (Past 5 Years)</h5>
                  <div className="form-group">
                    <label>Have you had other employers in the past 5 years?</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
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

                  {formData.prevEmployer === 'Yes' && (
                    <div className="form-group">
                      <label>Previous Employment History</label>
                      <textarea 
                        className="glass-input"
                        placeholder="Employer 1: Name, Address, Position, Start Date - End Date&#10;Employer 2: Name, Address, Position, Start Date - End Date"
                        rows={4}
                        value={formData.prevEmploymentHistory || ''}
                        onChange={(e) => handleInputChange('prevEmploymentHistory', e.target.value)}
                        style={{ resize: 'vertical', minHeight: '100px' }}
                      />
                    </div>
                  )}

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Periods of Unemployment</h5>
                  <div className="form-group">
                    <label>List any periods of unemployment lasting more than 30 days</label>
                    <textarea 
                      className="glass-input"
                      placeholder="Period: Start Date - End Date, Address during this period"
                      rows={3}
                      value={formData.unemploymentPeriods || ''}
                      onChange={(e) => handleInputChange('unemploymentPeriods', e.target.value)}
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>
                </div>
              )}

              {/* Travel History Section (I-485 specific) */}
              {activeSection === 'travel' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 5 - Travel History</h4>
                  
                  <div className="form-group">
                    <label>Date of Last Arrival in the United States</label>
                    <input 
                      type="date" 
                      className="glass-input"
                      value={formData.lastArrivalDate || ''}
                      onChange={(e) => handleInputChange('lastArrivalDate', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>I-94 Arrival-Departure Record Number</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="XXX XXXXX XXXX"
                        value={formData.i94Number || ''}
                        onChange={(e) => handleInputChange('i94Number', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Class of Admission</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="e.g., H-1B, F-1, B-2"
                        value={formData.classOfAdmission || ''}
                        onChange={(e) => handleInputChange('classOfAdmission', e.target.value)}
                      />
                    </div>
                  </div>

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Trips Outside the United States</h5>
                  <div className="form-group">
                    <label>Have you ever traveled outside the United States?</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="traveledOutside" 
                            value={option}
                            checked={formData.traveledOutside === option}
                            onChange={(e) => handleInputChange('traveledOutside', e.target.value)}
                            style={{ accentColor: 'var(--color-secondary)' }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.traveledOutside === 'Yes' && (
                    <div className="form-group">
                      <label>List all trips outside the United States (most recent first)</label>
                      <textarea 
                        className="glass-input"
                        placeholder="Trip 1: Date of Departure, Date of Return, Countries Visited&#10;Trip 2: Date of Departure, Date of Return, Countries Visited"
                        rows={5}
                        value={formData.travelHistory || ''}
                        onChange={(e) => handleInputChange('travelHistory', e.target.value)}
                        style={{ resize: 'vertical', minHeight: '120px' }}
                      />
                    </div>
                  )}

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Intended Travel</h5>
                  <div className="form-group">
                    <label>Do you intend to travel outside the United States while this application is pending?</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="intendedTravel" 
                            value={option}
                            checked={formData.intendedTravel === option}
                            onChange={(e) => handleInputChange('intendedTravel', e.target.value)}
                            style={{ accentColor: 'var(--color-secondary)' }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Background Section */}
              {activeSection === 'background' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 6 - Background Information</h4>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', fontSize: '0.875rem' }}>
                    You must answer all questions truthfully. Failure to disclose accurate information may result in denial of your application.
                  </p>

                  {[
                    { id: 'criminal', question: 'Have you ever been arrested, cited, or detained by any law enforcement officer (including DUI and traffic incidents)?', warning: 'This includes any arrest, even if charges were dropped or you were found not guilty.' },
                    { id: 'prostitution', question: 'Have you ever engaged in prostitution or procured or attempted to procure prostitutes?', warning: '' },
                    { id: 'smuggling', question: 'Have you ever knowingly encouraged, induced, assisted, abetted, or aided any alien to enter or try to enter the United States in violation of law?', warning: '' },
                    { id: 'deported', question: 'Have you ever been excluded, deported, or removed from the United States?', warning: '' },
                    { id: 'visaFraud', question: 'Have you ever committed visa fraud or willfully misrepresented a material fact to gain admission to the United States?', warning: '' },
                    { id: 'publicCharge', question: 'Are you likely to become a public charge?', warning: 'Consider your age, health, education, skills, and assets.' },
                    { id: 'communicable', question: 'Do you have a communicable disease of public health significance?', warning: 'Tuberculosis, syphilis, gonorrhea, etc.' },
                    { id: 'mental', question: 'Do you have a mental or physical disorder that poses or is likely to pose a threat to the safety or welfare of yourself or others?', warning: '' },
                    { id: 'drug', question: 'Are you a drug abuser or addict?', warning: '' }
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
                        <span style={{ fontWeight: '600', marginRight: '8px', flexShrink: 0 }}>{index + 1}.</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ marginBottom: 'var(--spacing-sm)' }}>{item.question}</p>
                          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: item.warning ? 'var(--spacing-sm)' : 0 }}>
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
                          {item.warning && formData[item.id] === 'Yes' && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-warning)', margin: 0 }}>
                              <AlertCircle size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                              {' '}{item.warning}
                            </p>
                          )}
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
                      <div style={{ fontWeight: '600', color: 'var(--color-danger)', marginBottom: '4px' }}>Important Warning</div>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>
                        If you answer &quot;Yes&quot; to any question, you must provide a detailed explanation on a separate sheet of paper.
                        Consult with an immigration attorney before filing if you have concerns about your background.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Signatures Section */}
              {activeSection === 'signatures' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 7 - Certifications and Signatures</h4>
                  
                  <div style={{ 
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)'
                  }}>
                    <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Penalties</h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                      If you knowingly and willfully falsify or conceal a material fact or submit a false document with this Form I-485, you will be fined and/or imprisoned up to 5 years (18 U.S.C. Section 1001), and you will be removed from the United States.
                    </p>
                  </div>

                  <div className="form-group">
                    <label>
                      I certify, under penalty of perjury under the laws of the United States of America, that this application, and the evidence submitted with it, is all true and correct.
                      <span style={{ color: 'var(--color-danger)' }}> *</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <input 
                        type="checkbox"
                        checked={formData.certification || false}
                        onChange={(e) => handleInputChange('certification', e.target.checked)}
                        style={{ accentColor: 'var(--color-secondary)', width: '20px', height: '20px' }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>I certify and agree to the above statement</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                      <label>Applicant's Signature</label>
                      <input 
                        type="text" 
                        className="glass-input"
                        placeholder="Sign here"
                        value={formData.signature || ''}
                        onChange={(e) => handleInputChange('signature', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input 
                        type="date" 
                        className="glass-input"
                        value={formData.signatureDate || ''}
                        onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Daytime Telephone Number</label>
                    <input 
                      type="tel" 
                      className="glass-input"
                      placeholder="(XXX) XXX-XXXX"
                      value={formData.daytimePhone || ''}
                      onChange={(e) => handleInputChange('daytimePhone', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Telephone Number (if any)</label>
                    <input 
                      type="tel" 
                      className="glass-input"
                      placeholder="(XXX) XXX-XXXX"
                      value={formData.mobilePhone || ''}
                      onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="glass-input"
                      placeholder="example@email.com"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <input 
                        type="checkbox"
                        checked={formData.electronicNotification || false}
                        onChange={(e) => handleInputChange('electronicNotification', e.target.checked)}
                        style={{ accentColor: 'var(--color-secondary)', marginRight: '8px' }}
                      />
                      I consent to receive notifications from USCIS electronically at the email address provided above.
                    </label>
                  </div>
                </div>
              )}

              {/* Additional Sections based on form type */}
              {currentForm === 'N-400' && activeSection === 'moralCharacter' && (
                <div className="form-section">
                  <h4 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-accent)' }}>Part 8 - Moral Character and Residential Requirements</h4>
                  
                  <div className="form-group">
                    <label>Have you continuously resided in the United States for at least 5 years?</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name='continuousResidence' 
                            value={option}
                            checked={formData.continuousResidence === option}
                            onChange={(e) => handleInputChange('continuousResidence', e.target.value)}
                            style={{ accentColor: 'var(--color-secondary)' }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Have you been physically present in the United States for at least 30 months out of the last 5 years?</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                      {['Yes', 'No'].map(option => (
                        <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name='physicalPresence' 
                            value={option}
                            checked={formData.physicalPresence === option}
                            onChange={(e) => handleInputChange('physicalPresence', e.target.value)}
                            style={{ accentColor: 'var(--color-secondary)' }}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Voting and Political Questions</h5>
                  {[
                    { id: 'voted', question: 'Have you ever voted or registered to vote in the United States?' },
                    { id: 'pollingOutside', question: 'Have you ever voted or registered to vote outside the United States?' },
                    { id: 'refused', question: 'Have you ever refused to take an oath or make an affirmation supporting the Constitution of the United States?' },
                    { id: 'renounced', question: 'Have you ever formally renounced United States citizenship or a certificate of naturalization?' }
                  ].map((item, index) => (
                    <div key={item.id} className="form-group">
                      <label>{item.question}</label>
                      <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
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
                  ))}

                  <h5 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>Military Service</h5>
                  {[
                    { id: 'usMilitary', question: 'Have you ever served in the U.S. Armed Forces?' },
                    { id: 'selectiveService', question: 'Are you subject to the Military Selective Service Act (draft registration)?' }
                  ].map((item, index) => (
                    <div key={item.id} className="form-group">
                      <label>{item.question}</label>
                      <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                        {['Yes', 'No', 'N/A'].map(option => (
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
                  ))}
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
            borderTop: '1px solid var(--glass-border)',
            flexWrap: 'wrap'
          }}>
            <button className="glass-button" style={{ flex: 1, minWidth: '150px' }}>
              <Download size={18} />
              Download PDF
            </button>
            <motion.button 
              className="glass-button" 
              style={{ flex: 1, minWidth: '150px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText size={18} />
              Print
            </motion.button>
            <motion.button 
              className="glass-button primary" 
              style={{ flex: 1.5, minWidth: '200px' }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting to USCIS...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit to USCIS
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Live Preview - Actual Form Format */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass" style={{ padding: 'var(--spacing-lg)', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Eye size={20} />
                    Official Form Preview
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {currentFormInfo?.edition}
                  </span>
                </div>
                
                <div className="uscis-form-preview" style={{ 
                  background: 'white', 
                  color: '#000', 
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.7rem',
                  maxHeight: '700px',
                  overflow: 'auto',
                  border: '1px solid #ccc'
                }}>
                  {/* Official Header */}
                  <div style={{ textAlign: 'center', borderBottom: '3px solid #000', paddingBottom: '8px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '700' }}>U.S. Department of Homeland Security</div>
                    <div style={{ fontSize: '0.85rem' }}>U.S. Citizenship and Immigration Services</div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{currentForm}</div>
                    <div style={{ fontSize: '0.8rem' }}>{currentFormInfo?.name}</div>
                  </div>

                  {/* OMB Control Number */}
                  <div style={{ fontSize: '0.65rem', color: '#666', textAlign: 'center', marginBottom: '12px', fontStyle: 'italic' }}>
                    OMB No. 1615-0023 | Expires: See Instructions
                  </div>

                  {/* Form Fields in Official Layout */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Part 1. Information About You</div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Family Name</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '8px' }}>
                        {formData.fullName?.split(',')[0] || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Given Name</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '8px' }}>
                        {formData.fullName?.split(',')[1]?.trim() || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Middle Name</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '8px' }}>
                        {formData.fullName?.split(',')[2]?.trim() || ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Date of Birth (mm/dd/yyyy)</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.dateOfBirth || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Country of Birth</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.countryOfBirth || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Country of Nationality</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.countryOfNationality || ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>A-Number (if any)</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.alienNumber || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Date of A-Number Issuance</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}></div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>SSN (if available)</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.ssn || ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ flex: 2, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Street Number and Name</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.street || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}> Apt. Ste. Flr.</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>City or Town</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.city || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>State</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.state || ''}
                      </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>ZIP Code</div>
                      <div style={{ borderBottom: '1px solid #000', marginTop: '12px' }}>
                        {formData.zipCode || ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ flex: 1, border: '1px solid #000', padding: '4px' }}>
                      <div style={{ fontSize: '0.6rem', fontWeight: '600' }}>Marital Status</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <span>☐ Single</span>
                        <span>☐ {formData.maritalStatus === 'Married' ? '☑' : '☐'} Married</span>
                        <span>☐ Divorced</span>
                        <span>☐ Widowed</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional sections would continue... */}
                  
                  <div style={{ marginTop: '16px', padding: '8px', background: '#f5f5f5', border: '1px solid #ccc' }}>
                    <p style={{ fontSize: '0.65rem', color: '#666', margin: 0 }}>
                      <strong>Disclaimer:</strong> This is a preview generated by AEGIS for planning purposes only. 
                      Not an official government form. Please download the official form from uscis.gov for filing.
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
