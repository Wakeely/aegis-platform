import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ========================================
// GLOBAL STORE - Notifications, Theme, UI State
// ========================================
export const useGlobalStore = create((set, get) => ({
  // Theme
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  
  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now()
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id, timestamp: new Date() }]
    }))
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id)
    }, 5000)
    return id
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  clearNotifications: () => set({ notifications: [] }),
  
  // Modals
  activeModal: null,
  openModal: (modalName, data = null) => set({ activeModal: { name: modalName, data } }),
  closeModal: () => set({ activeModal: null }),
  
  // Loading States
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Search
  globalSearchQuery: '',
  setGlobalSearch: (query) => set({ globalSearchQuery: query }),
  
  // User Session (Simulated)
  userSession: {
    id: 'user-001',
    name: 'Alexandra Chen',
    email: 'alexandra.chen@email.com',
    avatar: 'AC',
    isAuthenticated: true,
    lastActive: new Date().toISOString()
  },
  updateSession: (data) => set((state) => ({
    userSession: { ...state.userSession, ...data, lastActive: new Date().toISOString() }
  }))
}))

// ========================================
// USER STORE - User Profile & Preferences
// ========================================
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: {
        name: 'Alexandra Chen',
        email: 'alexandra.chen@email.com',
        avatar: 'AC',
        country: 'Taiwan',
        currentStatus: 'H-1B Visa',
        caseNumber: 'MSC-2024-123456',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, San Francisco, CA 94102',
        dateOfBirth: '1990-05-15',
        countryOfBirth: 'Taiwan',
        ssn: '***-**-1234',
        alienNumber: '***-**-5678',
        maritalStatus: 'Married',
        spouseName: 'Michael Chen',
        marriageDate: '2018-06-15',
        employer: 'Tech Innovations Inc.',
        position: 'Senior Software Engineer',
        employmentStart: '2020-03-01'
      },
      
      preferences: {
        notifications: true,
        emailUpdates: true,
        language: 'en',
        timezone: 'America/Los_Angeles'
      },
      
      bookmarks: {
        articles: [],
        attorneys: [],
        cases: []
      },
      
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),
      
      updatePreferences: (data) => set((state) => ({
        preferences: { ...state.preferences, ...data }
      })),
      
      toggleBookmark: (type, id) => set((state) => {
        const bookmarks = state.bookmarks[type]
        const exists = bookmarks.includes(id)
        return {
          bookmarks: {
            ...state.bookmarks,
            [type]: exists 
              ? bookmarks.filter(b => b !== id)
              : [...bookmarks, id]
          }
        }
      }),
      
      isBookmarked: (type, id) => {
        const { bookmarks } = get()
        return bookmarks[type]?.includes(id) || false
      },
      
      reset: () => set({ user: {}, preferences: {}, bookmarks: { articles: [], attorneys: [], cases: [] } })
    }),
    {
      name: 'aegis-user',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ========================================
// ELIGIBILITY STORE - Assessment Logic & State
// ========================================
export const useEligibilityStore = create(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: {},
      results: [],
      history: [],
      savedAssessments: [],
      
      setAnswer: (questionId, answer) => set((state) => ({
        answers: { ...state.answers, [questionId]: answer }
      })),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, get().totalSteps)
      })),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0)
      })),
      
      goToStep: (step) => set({ currentStep: step }),
      
      totalSteps: 6,
      
      calculateResults: () => {
        const { answers } = get()
        const results = eligibilityLogic(answers)
        const historyEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          answers: { ...answers },
          results
        }
        
        set((state) => ({
          results: [results, ...state.results],
          history: [historyEntry, ...state.history].slice(0, 10)
        }))
        
        return results
      },
      
      saveAssessment: (name) => set((state) => ({
        savedAssessments: [
          ...state.savedAssessments,
          {
            id: Date.now(),
            name,
            date: new Date().toISOString(),
            answers: { ...state.answers },
            currentStep: state.currentStep
          }
        ]
      })),
      
      loadAssessment: (id) => {
        const { savedAssessments } = get()
        const assessment = savedAssessments.find(a => a.id === id)
        if (assessment) {
          set({
            answers: assessment.answers,
            currentStep: assessment.currentStep
          })
          return assessment
        }
        return null
      },
      
      reset: () => set({ currentStep: 0, answers: {}, results: [], history: [] })
    }),
    { name: 'aegis-eligibility' }
  )
)

// Eligibility Decision Tree Logic
const eligibilityLogic = (answers) => {
  const { relationship, status, timeInUS, education, workExperience, goals } = answers
  
  // Calculate base score
  let score = 50
  
  if (status === 'citizen') score += 40
  else if (status === 'green_card') score += 35
  else if (status === 'h1b') score += 25
  else if (status === 'l1') score += 20
  
  if (relationship === 'immediate') score += 30
  else if (relationship === 'sibling') score += 10
  else if (relationship === 'none') score += 5
  
  if (education === 'phd' || education === 'professional') score += 15
  else if (education === 'masters') score += 10
  else if (education === 'bachelors') score += 5
  
  if (workExperience === 'extraordinary' || workExperience === 'specialized') score += 15
  else if (workExperience === 'general') score += 5
  
  score = Math.min(Math.max(score, 0), 100)
  
  // Determine pathways
  const pathways = []
  
  if (status === 'citizen') {
    pathways.push({
      id: 'n-400',
      name: 'U.S. Citizenship (N-400)',
      category: 'Naturalization',
      score,
      timeframe: '3-6 months',
      priority: 'high',
      requirements: ['5 years as LPR', 'Physical presence', 'Good moral character', 'English & Civics test'],
      description: 'You are eligible for naturalization as a U.S. citizen.'
    })
  }
  
  if (status === 'green_card' && relationship === 'immediate') {
    pathways.push({
      id: 'n-400-3yr',
      name: 'Expedited Citizenship (3-Year)',
      category: 'Naturalization',
      score: score + 10,
      timeframe: '3-4 months',
      priority: 'high',
      requirements: ['3 years LPR', '3 years marriage', 'Continuous residence'],
      description: 'Marriage to U.S. citizen may qualify you for 3-year naturalization.'
    })
  }
  
  if (['h1b', 'l1', 'other_visa'].includes(status) && relationship === 'immediate') {
    pathways.push({
      id: 'i-130-485',
      name: 'I-130 + I-485 Concurrent Filing',
      category: 'Family-Based Adjustment',
      score: Math.max(score - 5, 60),
      timeframe: '12-18 months',
      priority: 'high',
      requirements: ['I-130 approval', 'I-485 application', 'Medical exam', 'Biometrics'],
      description: 'Your immediate relative can file I-130 and I-485 concurrently.'
    })
  }
  
  if (education === 'advanced' || workExperience === 'specialized') {
    pathways.push({
      id: 'eb2',
      name: 'EB-2 Employment-Based Green Card',
      category: 'Employment Immigration',
      score: Math.max(score - 10, 55),
      timeframe: '18-24 months',
      priority: 'medium',
      requirements: ['PERM labor cert OR NIW', 'I-140 petition', 'I-485 adjustment'],
      description: 'Your advanced degree/specialized experience may qualify for EB-2.'
    })
  }
  
  if (status === 'h1b' || status === 'l1') {
    pathways.push({
      id: 'ead',
      name: 'EAD (Work Authorization)',
      category: 'Employment',
      score: 75,
      timeframe: '2-5 months',
      priority: 'high',
      requirements: ['I-765 application', 'Filing fee', 'Biometrics'],
      description: 'You can apply for employment authorization document.'
    })
  }
  
  // Sort by score
  pathways.sort((a, b) => b.score - a.score)
  
  return {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    overallScore: score,
    recommendation: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Review Needed',
    pathways,
    answers: { ...answers }
  }
}

// ========================================
// DOCUMENTS STORE - File Management
// ========================================
export const useDocumentStore = create(
  persist(
    (set, get) => ({
      documents: [],
      folders: [
        { id: 'identity', name: 'Identity Documents', icon: 'file-text' },
        { id: 'relationship', name: 'Relationship', icon: 'heart' },
        { id: 'employment', name: 'Employment', icon: 'briefcase' },
        { id: 'financial', name: 'Financial', icon: 'dollar-sign' },
        { id: 'medical', name: 'Medical', icon: 'activity' },
        { id: 'travel', name: 'Travel', icon: 'plane' }
      ],
      uploadQueue: [],
      storageUsed: 0,
      storageLimit: 500 * 1024 * 1024, // 500MB
      
      addDocument: (doc) => {
        const id = Date.now() + Math.random()
        const newDoc = {
          ...doc,
          id,
          uploadedAt: new Date().toISOString(),
          status: 'uploading',
          progress: 0
        }
        
        set((state) => ({
          documents: [...state.documents, newDoc],
          uploadQueue: [...state.uploadQueue, { id, name: doc.name, progress: 0 }]
        }))
        
        // Simulate upload progress
        simulateUpload(id, doc)
        
        return id
      },
      
      updateUploadProgress: (id, progress) => set((state) => ({
        documents: state.documents.map(d => d.id === id ? { ...d, progress } : d),
        uploadQueue: state.uploadQueue.map(q => q.id === id ? { ...q, progress } : q)
      })),
      
      completeUpload: (id, extractedData = null) => set((state) => ({
        documents: state.documents.map(d => 
          d.id === id 
            ? { ...d, status: 'processing', progress: 100, extractedData } 
            : d
        ),
        uploadQueue: state.uploadQueue.filter(q => q.id !== id)
      })),
      
      finalizeDocument: (id) => set((state) => ({
        documents: state.documents.map(d =>
          d.id === id
            ? { ...d, status: 'verified', verifiedAt: new Date().toISOString() }
            : d
        )
      })),
      
      removeDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),
      
      moveDocument: (docId, folderId) => set((state) => ({
        documents: state.documents.map(d =>
          d.id === docId ? { ...d, folderId } : d
        )
      })),
      
      renameDocument: (id, newName) => set((state) => ({
        documents: state.documents.map(d =>
          d.id === id ? { ...d, name: newName } : d
        )
      })),
      
      getDocumentsByFolder: (folderId) => {
        const { documents } = get()
        return documents.filter(d => d.folderId === folderId || (!folderId && !d.folderId))
      },
      
      getDocumentsByStatus: (status) => {
        const { documents } = get()
        return documents.filter(d => d.status === status)
      },
      
      getStorageUsage: () => {
        const { documents, storageLimit } = get()
        const used = documents.reduce((acc, doc) => acc + (doc.size || 0), 0)
        return {
          used,
          available: storageLimit - used,
          percentage: (used / storageLimit) * 100
        }
      },
      
      reset: () => set({ documents: [], uploadQueue: [], storageUsed: 0 })
    }),
    { name: 'aegis-documents' }
  )
)

// Simulated upload function
const simulateUpload = (id, doc) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress >= 100) {
      progress = 100
      clearInterval(interval)
      // Complete upload and start processing
      const store = useDocumentStore.getState()
      store.completeUpload(id, {
        pages: Math.floor(Math.random() * 5) + 1,
        textExtracted: `${doc.name} - Immigration Document`,
        confidence: Math.floor(Math.random() * 20) + 80
      })
      
      // Complete processing after delay
      setTimeout(() => {
        store.finalizeDocument(id)
      }, 2000)
    } else {
      useDocumentStore.getState().updateUploadProgress(id, Math.min(progress, 99))
    }
  }, 200)
}

// ========================================
// FORMS STORE - Form Builder & Validation
// ========================================
export const useFormStore = create(
  persist(
    (set, get) => ({
      currentForm: 'I-485',
      forms: ['I-485', 'I-130', 'I-131', 'I-765', 'N-400'],
      formData: {},
      drafts: [],
      submittedForms: [],
      signatures: {},
      
      // Form schemas for validation
      schemas: {
        'I-485': {
          fullName: { required: true, minLength: 2 },
          dateOfBirth: { required: true },
          countryOfBirth: { required: true },
          alienNumber: { required: true, pattern: /^\d{3}-\d{2}-\d{4}$/ },
          ssn: { required: false, pattern: /^\d{3}-\d{2}-\d{4}$/ },
          maritalStatus: { required: true },
          spouseName: { required: false }
        },
        'I-130': {
          petitionerName: { required: true },
          petitionerAddress: { required: true },
          beneficiaryName: { required: true },
          beneficiaryAddress: { required: true },
          relationship: { required: true }
        }
      },
      
      setFormData: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value }
      })),
      
      setCurrentForm: (form) => set({ currentForm: form, formData: {} }),
      
      validateField: (field, value) => {
        const { currentForm } = get()
        const schema = get().schemas[currentForm]
        const fieldSchema = schema?.[field]
        
        if (!fieldSchema) return { valid: true, error: null }
        
        let error = null
        if (fieldSchema.required && !value) {
          error = 'This field is required'
        } else if (fieldSchema.minLength && value?.length < fieldSchema.minLength) {
          error = `Minimum ${fieldSchema.minLength} characters required`
        } else if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
          error = 'Invalid format'
        }
        
        return { valid: !error, error }
      },
      
      validateAll: () => {
        const { currentForm, formData, schemas } = get()
        const schema = schemas[currentForm] || {}
        const errors = {}
        let isValid = true
        
        Object.keys(schema).forEach(field => {
          const { valid, error } = get().validateField(field, formData[field])
          if (!valid) {
            errors[field] = error
            isValid = false
          }
        })
        
        return { isValid, errors }
      },
      
      saveDraft: (name = null) => {
        const { currentForm, formData } = get()
        const draftId = Date.now()
        const draft = {
          id: draftId,
          name: name || `Draft - ${currentForm} - ${new Date().toLocaleDateString()}`,
          form: currentForm,
          data: { ...formData },
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
        
        set((state) => ({
          drafts: [draft, ...state.drafts].slice(0, 20)
        }))
        
        return draftId
      },
      
      loadDraft: (draftId) => {
        const { drafts } = get()
        const draft = drafts.find(d => d.id === draftId)
        if (draft) {
          set({
            currentForm: draft.form,
            formData: draft.data
          })
          return draft
        }
        return null
      },
      
      deleteDraft: (draftId) => set((state) => ({
        drafts: state.drafts.filter(d => d.id !== draftId)
      })),
      
      submitForm: () => {
        const { currentForm, formData, validateAll } = get()
        const { isValid } = validateAll()
        
        if (!isValid) {
          return { success: false, error: 'Please fix validation errors before submitting' }
        }
        
        const submission = {
          id: Date.now(),
          form: currentForm,
          data: { ...formData },
          submittedAt: new Date().toISOString(),
          status: 'submitted',
          confirmationNumber: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }
        
        set((state) => ({
          submittedForms: [submission, ...state.submittedForms],
          formData: {}
        }))
        
        return { success: true, submission }
      },
      
      addSignature: (formId, signatureData) => set((state) => ({
        signatures: { ...state.signatures, [formId]: signatureData }
      })),
      
      getFormCompletion: () => {
        const { currentForm, formData, schemas } = get()
        const schema = schemas[currentForm] || {}
        const requiredFields = Object.keys(schema).filter(f => schema[f].required)
        const completed = requiredFields.filter(f => formData[f] && formData[f].toString().trim() !== '')
        return Math.round((completed.length / requiredFields.length) * 100)
      },
      
      reset: () => set({ currentForm: 'I-485', formData: {}, signatures: {} })
    }),
    { name: 'aegis-forms' }
  )
)

// ========================================
// CASES STORE - Case Management & Tracking
// ========================================
export const useCaseStore = create(
  persist(
    (set, get) => ({
      cases: [
        {
          id: 1,
          type: 'I-485 Adjustment of Status',
          formNumber: 'I-485',
          caseNumber: 'MSC-2024-123456',
          status: 'interview',
          priority: 'high',
          submittedDate: '2024-03-15',
          estimatedCompletion: '2025-02-15',
          lastUpdated: new Date().toISOString(),
          notes: [],
          documents: [],
          milestones: [
            { id: 1, name: 'Application Received', date: '2024-03-18', completed: true, type: 'status' },
            { id: 2, name: 'Biometrics Scheduled', date: '2024-04-05', completed: true, type: 'document' },
            { id: 3, name: 'Biometrics Completed', date: '2024-04-20', completed: true, type: 'milestone' },
            { id: 4, name: 'Interview Scheduled', date: '2025-01-10', completed: false, type: 'milestone', active: true },
            { id: 5, name: 'Interview Completed', date: null, completed: false, type: 'milestone' },
            { id: 6, name: 'Decision Issued', date: null, completed: false, type: 'status' }
          ],
          timeline: [
            { id: 1, date: '2024-03-15', type: 'submitted', description: 'Form I-485 submitted', icon: 'file-plus' },
            { id: 2, date: '2024-03-18', type: 'received', description: 'Application received by USCIS', icon: 'check' },
            { id: 3, date: '2024-04-05', type: 'notice', description: 'Biometrics appointment notice received', icon: 'calendar' },
            { id: 4, date: '2024-04-20', type: 'milestone', description: 'Biometrics appointment completed', icon: 'check-circle' },
            { id: 5, date: '2025-01-10', type: 'interview', description: 'Interview scheduled', icon: 'calendar' }
          ]
        },
        {
          id: 2,
          type: 'I-130 Petition',
          formNumber: 'I-130',
          caseNumber: 'WAC-2024-987654',
          status: 'approved',
          priority: 'medium',
          submittedDate: '2024-01-10',
          estimatedCompletion: '2024-08-15',
          lastUpdated: '2024-06-20',
          approvedDate: '2024-06-20',
          notes: [],
          documents: [],
          milestones: [
            { id: 1, name: 'Petition Received', date: '2024-01-12', completed: true, type: 'status' },
            { id: 2, name: 'Request for Evidence', date: '2024-03-01', completed: true, type: 'document' },
            { id: 3, name: 'RFE Response', date: '2024-03-25', completed: true, type: 'milestone' },
            { id: 4, name: 'Petition Approved', date: '2024-06-20', completed: true, type: 'status' }
          ],
          timeline: [
            { id: 1, date: '2024-01-10', type: 'submitted', description: 'Form I-130 submitted', icon: 'file-plus' },
            { id: 2, date: '2024-01-12', type: 'received', description: 'Petition received by USCIS', icon: 'check' },
            { id: 3, date: '2024-03-01', type: 'rfe', description: 'Request for Evidence issued', icon: 'alert-circle' },
            { id: 4, date: '2024-03-25', type: 'response', description: 'RFE response submitted', icon: 'send' },
            { id: 5, date: '2024-06-20', type: 'approved', description: 'I-130 Petition Approved', icon: 'award' }
          ]
        }
      ],
      
      addCase: (caseData) => {
        const newCase = {
          ...caseData,
          id: Date.now(),
          status: 'pending',
          submittedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          notes: [],
          milestones: [],
          timeline: []
        }
        set((state) => ({
          cases: [...state.cases, newCase]
        }))
        return newCase.id
      },
      
      updateCaseStatus: (caseId, status, note = null) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            const timelineEntry = {
              id: Date.now(),
              date: new Date().toISOString(),
              type: status,
              description: note || `Status updated to ${status}`,
              icon: 'refresh-cw'
            }
            return {
              ...c,
              status,
              lastUpdated: new Date().toISOString(),
              timeline: [timelineEntry, ...c.timeline]
            }
          }
          return c
        })
      })),
      
      addMilestone: (caseId, milestone) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              milestones: [...c.milestones, { ...milestone, id: Date.now() }]
            }
          }
          return c
        })
      })),
      
      addNote: (caseId, content) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              notes: [
                { id: Date.now(), content, createdAt: new Date().toISOString() },
                ...c.notes
              ]
            }
          }
          return c
        })
      })),
      
      addDocument: (caseId, doc) => set((state) => ({
        cases: state.cases.map(c => {
          if (c.id === caseId) {
            return {
              ...c,
              documents: [...c.documents, { ...doc, id: Date.now() }]
            }
          }
          return c
        })
      })),
      
      getCaseById: (id) => {
        const { cases } = get()
        return cases.find(c => c.id === id)
      },
      
      getCasesByStatus: (status) => {
        const { cases } = get()
        return cases.filter(c => c.status === status)
      },
      
      getUpcomingDeadlines: () => {
        const { cases } = get()
        const now = new Date()
        return cases
          .filter(c => c.estimatedCompletion && new Date(c.estimatedCompletion) > now)
          .sort((a, b) => new Date(a.estimatedCompletion) - new Date(b.estimatedCompletion))
          .slice(0, 5)
      },
      
      reset: () => set({ cases: [] })
    }),
    { name: 'aegis-cases' }
  )
)

// ========================================
// INTERVIEW STORE - Practice & Preparation
// ========================================
export const useInterviewStore = create(
  persist(
    (set, get) => ({
      questions: [
        {
          id: 1,
          category: 'Background',
          type: 'personal',
          question: 'Tell me about yourself and your background.',
          tips: 'Focus on your professional journey, education, and what brought you to the United States.',
          expectedDuration: 180,
          keywords: ['education', 'career', 'immigration']
        },
        {
          id: 2,
          category: 'Relationship',
          type: 'family',
          question: 'How did you and your spouse meet? Can you describe your relationship?',
          tips: 'Be genuine and specific. Include details about your dating experience, engagement, and marriage.',
          expectedDuration: 240,
          keywords: ['meeting', 'dating', 'marriage', 'proposal']
        },
        {
          id: 3,
          category: 'Life Together',
          type: 'family',
          question: 'Describe a typical day in your life with your spouse.',
          tips: 'Include daily routines, responsibilities, and how you support each other.',
          expectedDuration: 180,
          keywords: ['routine', 'chores', 'activities', 'family']
        },
        {
          id: 4,
          category: 'Future Plans',
          type: 'future',
          question: 'What are your plans for the future together?',
          tips: 'Discuss career goals, family plans, and how you see your life unfolding.',
          expectedDuration: 180,
          keywords: ['career', 'children', 'goals', 'plans']
        },
        {
          id: 5,
          category: 'Travel History',
          type: 'travel',
          question: 'Describe your international travel history.',
          tips: 'List countries visited, dates, purposes of travel, and any issues encountered.',
          expectedDuration: 180,
          keywords: ['countries', 'passports', 'visits']
        },
        {
          id: 6,
          category: 'Employment',
          type: 'work',
          question: 'Tell me about your current and past employment.',
          tips: 'Include company names, positions, dates of employment, and reasons for leaving.',
          expectedDuration: 240,
          keywords: ['work', 'employer', 'position', 'duties']
        },
        {
          id: 7,
          category: 'Criminal History',
          type: 'legal',
          question: 'Have you ever been arrested, cited, or detained?',
          tips: 'Be honest about any encounters with law enforcement. Minor traffic violations usually do not need to be reported.',
          expectedDuration: 120,
          keywords: ['arrest', 'citation', 'police', 'legal']
        },
        {
          id: 8,
          category: 'Public Benefits',
          type: 'legal',
          question: 'Have you ever received any public benefits or assistance?',
          tips: 'Include government assistance, food stamps, housing benefits, etc.',
          expectedDuration: 120,
          keywords: ['benefits', 'assistance', 'government', 'welfare']
        }
      ],
      
      currentQuestion: 0,
      responses: [],
      recordings: [],
      isRecording: false,
      isPlaying: false,
      recordingTime: 0,
      playbackTime: 0,
      sessionStats: {
        totalQuestions: 0,
        totalTime: 0,
        averageScore: 0,
        sessionsCompleted: 0
      },
      
      // Media stream
      mediaStream: null,
      mediaRecorder: null,
      audioChunks: [],
      
      nextQuestion: () => set((state) => ({
        currentQuestion: Math.min(state.currentQuestion + 1, get().questions.length - 1)
      })),
      
      prevQuestion: () => set((state) => ({
        currentQuestion: Math.max(state.currentQuestion - 1, 0)
      })),
      
      goToQuestion: (index) => set({ currentQuestion: index }),
      
      startRecording: async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          set({ 
            mediaStream: stream,
            isRecording: true, 
            recordingTime: 0,
            audioChunks: [] 
          })
          
          const mediaRecorder = new MediaRecorder(stream)
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              set((state) => ({
                audioChunks: [...state.audioChunks, event.data]
              }))
            }
          }
          
          set({ mediaRecorder })
          mediaRecorder.start()
          
          // Start timer
          const timer = setInterval(() => {
            const state = useInterviewStore.getState()
            if (state.isRecording) {
              set((s) => ({ recordingTime: s.recordingTime + 1 }))
            } else {
              clearInterval(timer)
            }
          }, 1000)
          
        } catch (error) {
          console.error('Error accessing microphone:', error)
          useGlobalStore.getState().addNotification({
            type: 'error',
            title: 'Microphone Access Required',
            message: 'Please allow microphone access to use voice recording features.'
          })
        }
      },
      
      stopRecording: () => {
        const { mediaRecorder, mediaStream, currentQuestion, audioChunks } = get()
        
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop()
        }
        
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop())
        }
        
        // Create audio blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const question = get().questions[currentQuestion]
        const response = {
          id: Date.now(),
          questionId: question.id,
          question: question.question,
          audioBlob,
          audioUrl,
          duration: get().recordingTime,
          timestamp: new Date().toISOString(),
          score: null,
          feedback: null
        }
        
        set((state) => ({
          responses: [...state.responses, response],
          recordings: [...state.recordings, response],
          isRecording: false,
          mediaStream: null,
          mediaRecorder: null,
          recordingTime: 0,
          sessionStats: {
            ...state.sessionStats,
            totalQuestions: state.sessionStats.totalQuestions + 1,
            totalTime: state.sessionStats.totalTime + state.recordingTime
          }
        }))
        
        // Generate AI feedback
        generateFeedback(response.id)
        
        return response.id
      },
      
      deleteResponse: (responseId) => set((state) => ({
        responses: state.responses.filter(r => r.id !== responseId),
        recordings: state.recordings.filter(r => r.id !== responseId)
      })),
      
      setPlaybackTime: (time) => set({ playbackTime: time }),
      
      playRecording: (responseId) => {
        const { responses } = get()
        const response = responses.find(r => r.id === responseId)
        if (response) {
          const audio = new Audio(response.audioUrl)
          audio.play()
          set({ isPlaying: true, currentPlaying: responseId })
          
          audio.ontimeupdate = () => {
            set({ playbackTime: audio.currentTime })
          }
          
          audio.onended = () => {
            set({ isPlaying: false, playbackTime: 0, currentPlaying: null })
          }
        }
      },
      
      stopPlayback: () => {
        set({ isPlaying: false, playbackTime: 0 })
      },
      
      reset: () => {
        const { mediaStream } = get()
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop())
        }
        set({
          currentQuestion: 0,
          responses: [],
          recordings: [],
          isRecording: false,
          isPlaying: false,
          recordingTime: 0,
          playbackTime: 0,
          mediaStream: null,
          mediaRecorder: null
        })
      }
    }),
    { name: 'aegis-interview' }
  )
)

// Simulated AI feedback generation
const generateFeedback = (responseId) => {
  setTimeout(() => {
    const { responses } = useInterviewStore.getState()
    const response = responses.find(r => r.id === responseId)
    if (response) {
      const score = Math.floor(Math.random() * 30) + 70
      const feedback = {
        overallScore: score,
        strengths: [
          'Clear pronunciation and speaking pace',
          'Good use of specific examples',
          'Confident delivery'
        ],
        improvements: [
          'Include more specific dates',
          'Elaborate on key points with more detail',
          'Consider adding emotional context'
        ],
        overall: `Your response demonstrated ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'decent'} preparation. ${score >= 80 ? 'Keep up the great work!' : 'Continue practicing to improve your delivery.'}`
      }
      
      useInterviewStore.setState((state) => ({
        responses: state.responses.map(r =>
          r.id === responseId ? { ...r, score, feedback } : r
        )
      }))
    }
  }, 2000)
}

// ========================================
// CHAT STORE - AI Conversation
// ========================================
export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 1,
          role: 'assistant',
          agent: 'AEGIS Navigator',
          content: "Hello! I'm AEGIS Navigator, your AI guide through the U.S. immigration process. How can I help you today?",
          timestamp: new Date(Date.now() - 3600000)
        }
      ],
      conversations: [],
      currentConversationId: null,
      isTyping: false,
      quickReplies: [
        'Check my case status',
        'How do I file I-485?',
        'What documents do I need?',
        'Schedule a consultation'
      ],
      
      addMessage: (message) => {
        const newMessage = {
          ...message,
          id: Date.now(),
          timestamp: new Date()
        }
        set((state) => ({
          messages: [...state.messages, newMessage]
        }))
        return newMessage.id
      },
      
      sendMessage: async (content) => {
        // Add user message
        const userMsgId = get().addMessage({
          role: 'user',
          content
        })
        
        // Simulate AI typing
        set({ isTyping: true })
        
        // Simulate AI response delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
        
        set({ isTyping: false })
        
        // Generate AI response
        const responses = generateAIResponse(content)
        const aiMsgId = get().addMessage({
          role: 'assistant',
          agent: 'AEGIS Navigator',
          content: responses[Math.floor(Math.random() * responses.length)]
        })
        
        return aiMsgId
      },
      
      clearChat: () => set({
        messages: [
          {
            id: 1,
            role: 'assistant',
            agent: 'AEGIS Navigator',
            content: "Hello! I'm AEGIS Navigator, your AI guide through the U.S. immigration process. How can I help you today?",
            timestamp: new Date()
          }
        ]
      }),
      
      addQuickReply: (reply) => set((state) => ({
        quickReplies: [...state.quickReplies, reply]
      })),
      
      reset: () => set({
        messages: [],
        conversations: [],
        currentConversationId: null,
        isTyping: false
      })
    }),
    { name: 'aegis-chat' }
  )
)

// Simulated AI responses
const generateAIResponse = (message) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('case status') || lowerMessage.includes('check my case')) {
    return [
      'Based on your case records, your I-485 application (MSC-2024-123456) is currently in the interview stage. Your interview is scheduled for January 10, 2025. Would you like me to provide more details?',
      'I can see your I-130 petition has been approved! Your case number is WAC-2024-987654. The I-485 application linked to this petition is proceeding normally.'
    ]
  }
  
  if (lowerMessage.includes('i-485') || lowerMessage.includes('adjustment')) {
    return [
      'Form I-485 is used to apply for lawful permanent residence (green card) while in the United States. The filing fee is $1,225 ($1,140 + $85 biometrics). Required documents typically include your passport, birth certificate, marriage certificate (if applicable), police certificates, and medical examination.',
      'To file I-485, you need to: 1) Complete Form I-485, 2) Gather supporting documents, 3) Pay the filing fee, 4) Submit to the correct lockbox based on your state of residence. Would you like guidance on any specific section?'
    ]
  }
  
  if (lowerMessage.includes('document') || lowerMessage.includes('need')) {
    return [
      'For most immigration applications, you will need: 1) Valid passport, 2) Birth certificate, 3) Marriage certificate (if applicable), 4) Police certificates from all countries lived in, 5) Medical examination by authorized physician, 6) Proof of financial support, 7) Tax returns.',
      'The specific documents required depend on your visa category. I recommend uploading your documents to the Document Management module so I can help verify their completeness and accuracy.'
    ]
  }
  
  if (lowerMessage.includes('consultation') || lowerMessage.includes('attorney')) {
    return [
      'I can connect you with one of our verified immigration attorneys. They specialize in various areas including family-based immigration, employment-based cases, and deportation defense. Would you like me to show you our attorney directory?',
      'Scheduling a consultation with an immigration attorney is recommended for complex cases. Our attorneys offer initial consultations starting at $150. Shall I help you find an attorney in your area?'
    ]
  }
  
  if (lowerMessage.includes('timeline') || lowerMessage.includes('how long')) {
    return [
      'Processing times vary by service center and case type. Currently, I-485 applications are averaging 8-14 months. The I-130 petition process typically takes 6-12 months. Your specific timeline may vary based on case complexity and any requests for evidence.',
      'Average processing times: I-485 (8-14 months), I-130 (6-12 months), I-765 (2-5 months), N-400 naturalization (6-12 months). These are estimates and actual times may differ.'
    ]
  }
  
  return [
    'I understand you\'re asking about immigration matters. To provide the most accurate guidance, could you share more details about your specific situation?',
    'That\'s a great question. Immigration processes can be complex, but I\'m here to help. Let me provide you with comprehensive information.',
    'I can help you navigate this aspect of your immigration journey. Would you like me to break this down into simpler steps?',
    'Thanks for your question. Based on your inquiry, I recommend checking our Knowledge Base for detailed articles, or I can connect you with an attorney for personalized guidance.'
  ]
}

// ========================================
// KNOWLEDGE STORE - Articles & Resources
// ========================================
export const useKnowledgeStore = create(
  persist(
    (set, get) => ({
      articles: [
        {
          id: 1,
          slug: 'complete-guide-i485-adjustment-status',
          title: 'Complete Guide to I-485 Adjustment of Status',
          category: 'green-card',
          excerpt: 'Learn everything about filing Form I-485 to adjust your status to permanent resident.',
          content: `Form I-485, Application to Register Permanent Residence or Adjust Status, is the primary form used to apply for a green card from within the United States.

## Who Can File?

You may be eligible to file Form I-485 if you are:
- Currently in the U.S. on a valid nonimmigrant visa
- The immediate relative of a U.S. citizen or green card holder
- A refugee or asylee adjusting status
- A special immigrant (religious workers, VAWA self-petitioners, etc.)

## Required Documentation

The following documents are typically required:
1. Proof of identity (passport, birth certificate)
2. Police certificates from all places of residence
3. Medical examination (must be by approved physician)
4. Proof of immigration status
5. Birth certificate
6. Marriage certificate (if applicable)
7. Financial evidence (tax returns, bank statements)

## Filing Fees

The filing fee for Form I-485 is $1,225 ($1,140 plus $85 biometric services fee).`,
          lastUpdated: '2024-12-15',
          views: 15420,
          helpful: 892,
          notHelpful: 23,
          readTime: 8,
          tags: ['green card', 'I-485', 'adjustment of status', 'permanent residence']
        },
        {
          id: 2,
          slug: 'naturalization-requirements-5-year-3-year-rule',
          title: 'Naturalization Requirements: 5-Year vs 3-Year Rule',
          category: 'citizenship',
          excerpt: 'Understanding the continuous residence requirements for U.S. citizenship.',
          content: `U.S. citizenship through naturalization is available to green card holders who meet certain requirements. The standard rule requires 5 years of continuous residence, but there are important exceptions.

## Standard 5-Year Rule

To qualify under the standard rule, you must:
- Have held a green card for at least 5 years
- Have continuously resided in the U.S. for at least 5 years
- Be physically present in the U.S. for at least 30 months
- Be able to read, write, and speak basic English
- Pass a civics test
- Have good moral character

## 3-Year Rule for Married Couples

If you are married to a U.S. citizen, you may qualify for naturalization after only 3 years if:
- Your spouse has been a U.S. citizen for the entire 3-year period
- You have been married to the same U.S. citizen for at least 3 years
- You have continuously resided in the U.S. as a green card holder for at least 3 years`,
          lastUpdated: '2024-12-10',
          views: 23150,
          helpful: 1456,
          notHelpful: 34,
          readTime: 6,
          tags: ['citizenship', 'N-400', 'naturalization', 'marriage']
        },
        {
          id: 3,
          slug: 'h1b-visa-complete-guide',
          title: 'H-1B Visa: Everything You Need to Know',
          category: 'visas',
          excerpt: 'Comprehensive overview of the H-1B specialty occupation visa.',
          content: `The H-1B visa is a non-immigrant visa that allows U.S. companies to employ foreign workers in specialty occupations that require theoretical or technical expertise.

## H-1B Requirements

To qualify for an H-1B visa:
- You must have a bachelor's degree or higher (or equivalent experience)
- The position must be a specialty occupation
- The employer must pay the prevailing wage
- There must be a genuine employer-employee relationship

## Annual Cap

There is an annual cap of 65,000 H-1B visas, with 6,800 reserved for citizens of Chile and Singapore. Additionally, 20,000 H-1Bs are reserved for those with a U.S. master's degree or higher.`,
          lastUpdated: '2024-12-08',
          views: 31200,
          helpful: 2103,
          notHelpful: 56,
          readTime: 10,
          tags: ['H-1B', 'work visa', 'specialty occupation', 'employment']
        },
        {
          id: 4,
          slug: 'immigration-filing-fees',
          title: 'Understanding Immigration Filing Fees',
          category: 'forms',
          excerpt: 'A complete breakdown of all immigration filing fees.',
          content: `Immigration filing fees vary significantly depending on the form and your circumstances. Here's what you need to know about current fees.

## Fee Schedule (2024)

- Form I-485: $1,225 ($1,140 filing + $85 biometrics)
- Form I-130: $535 (per petition)
- Form I-131: $630 (for travel document)
- Form I-765: $520 (work authorization)
- Form N-400: $640 (naturalization)

## Fee Waivers

Fee waivers are available for those who demonstrate inability to pay. You may qualify if you receive means-tested benefits or can show financial hardship.`,
          lastUpdated: '2024-12-05',
          views: 18900,
          helpful: 1234,
          notHelpful: 45,
          readTime: 5,
          tags: ['fees', 'filing', 'costs', 'payment']
        },
        {
          id: 5,
          slug: 'marriage-green-card-timeline',
          title: 'Marriage Green Card Timeline: What to Expect',
          category: 'green-card',
          excerpt: 'Step-by-step timeline for marriage-based green card applications.',
          content: `The marriage-based green card process involves several steps and can take varying amounts of time depending on your specific circumstances.

## Typical Timeline

1. **File I-130 Petition** (2-4 months for receipt notice)
2. **I-130 Processing** (6-12 months typically)
3. **File I-485 Application** (if concurrent filing, same time as I-130)
4. **Biometrics Appointment** (1-2 months after filing)
5. **Interview** (6-12 months after filing, may vary by field office)
6. **Decision** (Same day as interview or 2-4 weeks after)

## Factors Affecting Timeline

- Field office workload
- Completeness of application
- Need for Request for Evidence (RFE)
- Background check processing
- Interview scheduling availability`,
          lastUpdated: '2024-12-01',
          views: 25600,
          helpful: 1789,
          notHelpful: 67,
          readTime: 7,
          tags: ['green card', 'marriage', 'timeline', 'I-130', 'I-485']
        },
        {
          id: 6,
          slug: 'civics-test-study-guide',
          title: 'Civics Test Study Guide: 2024 Updated Questions',
          category: 'citizenship',
          excerpt: 'Practice the 100 civics questions for naturalization.',
          content: `The naturalization civics test covers important U.S. history and government concepts. Here are the key topics to study.

## Key Topics

### American Government
- Principles of American democracy
- System of government
- Rights and responsibilities of citizens

### American History
- Colonial period and independence
- 1800s (Civil War and expansion)
- Recent American history and other important historical information

### Integrated Civics
- Geography
- Symbols
- Holidays

## Test Format

The test consists of up to 10 questions from a pool of 100. You must answer at least 6 correctly to pass.`,
          lastUpdated: '2024-11-28',
          views: 42100,
          helpful: 3245,
          notHelpful: 89,
          readTime: 12,
          tags: ['civics', 'test', 'naturalization', 'N-400', 'citizenship']
        }
      ],
      
      categories: [
        { id: 'all', label: 'All Topics', slug: 'all' },
        { id: 'visas', label: 'Visa Types', slug: 'visas' },
        { id: 'green-card', label: 'Green Card', slug: 'green-card' },
        { id: 'citizenship', label: 'Citizenship', slug: 'citizenship' },
        { id: 'forms', label: 'Forms & Fees', slug: 'forms' }
      ],
      
      searchQuery: '',
      selectedCategory: 'all',
      readingHistory: [],
      
      searchArticles: (query) => {
        const { articles } = get()
        if (!query.trim()) return articles
        
        const lowerQuery = query.toLowerCase()
        return articles.filter(article =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      getArticleBySlug: (slug) => {
        const { articles } = get()
        return articles.find(a => a.slug === slug)
      },
      
      markAsRead: (articleId) => {
        const { readingHistory } = get()
        if (!readingHistory.includes(articleId)) {
          set((state) => ({
            readingHistory: [...state.readingHistory, articleId]
          }))
        }
      },
      
      rateArticle: (articleId, helpful) => set((state) => ({
        articles: state.articles.map(a =>
          a.id === articleId
            ? {
                ...a,
                helpful: helpful ? a.helpful + 1 : a.helpful,
                notHelpful: !helpful ? a.notHelpful + 1 : a.notHelpful
              }
            : a
        )
      })),
      
      incrementViews: (articleId) => set((state) => ({
        articles: state.articles.map(a =>
          a.id === articleId ? { ...a, views: a.views + 1 } : a
        )
      })),
      
      getPopularArticles: (limit = 3) => {
        const { articles } = get()
        return [...articles].sort((a, b) => b.views - a.views).slice(0, limit)
      },
      
      getRecentArticles: (limit = 3) => {
        const { articles } = get()
        return [...articles].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).slice(0, limit)
      }
    }),
    { name: 'aegis-knowledge' }
  )
)

// ========================================
// ATTORNEYS STORE - Legal Services
// ========================================
export const useAttorneyStore = create(
    persist(
      (set, get) => ({
        attorneys: [
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
            responseTime: '< 24 hours',
            featured: true,
            videoConsult: true,
            acceptingNew: true
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
            responseTime: '< 48 hours',
            featured: true,
            videoConsult: true,
            acceptingNew: true
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
            responseTime: '< 24 hours',
            featured: true,
            videoConsult: true,
            acceptingNew: true
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
            responseTime: '< 24 hours',
            featured: false,
            videoConsult: true,
            acceptingNew: true
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
            responseTime: '< 12 hours',
            featured: false,
            videoConsult: true,
            acceptingNew: true
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
            responseTime: '< 24 hours',
            featured: false,
            videoConsult: true,
            acceptingNew: true
          }
        ],
        
        appointments: [],
        messages: [],
        reviews: [],
        
        searchQuery: '',
        selectedSpecialty: 'all',
        sortBy: 'rating',
        
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSelectedSpecialty: (specialty) => set({ selectedSpecialty: specialty }),
        setSortBy: (sort) => set({ sortBy: sort }),
        
        searchAttorneys: () => {
          const { attorneys, searchQuery, selectedSpecialty, sortBy } = get()
          
          return attorneys.filter(attorney => {
            const matchesSearch = !searchQuery || 
              attorney.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              attorney.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
              attorney.location.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesSpecialty = selectedSpecialty === 'all' ||
              attorney.specialties.some(s => s.toLowerCase().replace(' ', '-') === selectedSpecialty)
            
            return matchesSearch && matchesSpecialty
          }).sort((a, b) => {
            switch (sortBy) {
              case 'rating': return b.rating - a.rating
              case 'reviews': return b.reviews - a.reviews
              case 'rate-low': return a.hourlyRate - b.hourlyRate
              case 'rate-high': return b.hourlyRate - a.hourlyRate
              case 'experience': return parseInt(b.experience) - parseInt(a.experience)
              default: return 0
            }
          })
        },
        
        bookAppointment: (appointmentData) => {
          const id = Date.now()
          const appointment = {
            id,
            ...appointmentData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
          }
          
          set((state) => ({
            appointments: [...state.appointments, appointment]
          }))
          
          return id
        },
        
        cancelAppointment: (id) => set((state) => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, status: 'cancelled' } : a
          )
        })),
        
        sendMessage: (messageData) => {
          const id = Date.now()
          const message = {
            id,
            ...messageData,
            status: 'sent',
            createdAt: new Date().toISOString()
          }
          
          set((state) => ({
            messages: [...state.messages, message]
          }))
          
          return id
        },
        
        addReview: (reviewData) => {
          const id = Date.now()
          const review = {
            id,
            ...reviewData,
            createdAt: new Date().toISOString()
          }
          
          set((state) => ({
            reviews: [...state.reviews, review]
          }))
          
          return id
        },
        
        getAttorneyById: (id) => {
          const { attorneys } = get()
          return attorneys.find(a => a.id === id)
        },
        
        getAppointmentsByAttorney: (attorneyId) => {
          const { appointments } = get()
          return appointments.filter(a => a.attorneyId === attorneyId)
        },
        
        getFeaturedAttorneys: () => {
          const { attorneys } = get()
          return attorneys.filter(a => a.featured)
        }
      }),
      { name: 'aegis-attorneys' }
    )
  )

// ========================================
// CHECKLIST STORE - Post-Approval Tasks
// ========================================
export const useChecklistStore = create(
  persist(
    (set, get) => ({
      checklist: [
        {
          id: 1,
          title: 'Apply for Social Security Number',
          description: 'If you haven\'t already, visit your local SSA office to apply for your SSN card.',
          resource: 'https://www.ssa.gov/ssnumber/',
          resourceLabel: 'SSA Website',
          category: 'documents',
          priority: 'high',
          completed: false,
          completedAt: null,
          subtasks: [
            { id: 'ssn-1', title: 'Gather required documents', completed: false },
            { id: 'ssn-2', title: 'Visit SSA office', completed: false },
            { id: 'ssn-3', title: 'Receive SSN card', completed: false }
          ]
        },
        {
          id: 2,
          title: 'Update Driver\'s License/State ID',
          description: 'Visit your DMV to update your driver\'s license with your new permanent resident status.',
          resource: null,
          category: 'documents',
          priority: 'high',
          completed: false,
          completedAt: null,
          subtasks: [
            { id: 'dl-1', title: 'Check DMV requirements', completed: false },
            { id: 'dl-2', title: 'Schedule appointment', completed: false },
            { id: 'dl-3', title: 'Visit DMV with documents', completed: false }
          ]
        },
        {
          id: 3,
          title: 'Register with Selective Service',
          description: 'Male immigrants aged 18-25 must register with Selective Service.',
          resource: 'https://www.sss.gov/',
          resourceLabel: 'Selective Service',
          category: 'legal',
          priority: 'medium',
          completed: false,
          completedAt: null,
          subtasks: []
        },
        {
          id: 4,
          title: 'File Taxes as Resident Alien',
          description: 'Ensure you understand your new tax obligations as a lawful permanent resident.',
          resource: null,
          category: 'financial',
          priority: 'high',
          completed: false,
          completedAt: null,
          subtasks: [
            { id: 'tax-1', title: 'Understand tax residency rules', completed: false },
            { id: 'tax-2', title: 'Gather tax documents', completed: false },
            { id: 'tax-3', title: 'File tax return', completed: false }
          ]
        },
        {
          id: 5,
          title: 'Update International Travel Documents',
          description: 'Apply for a re-entry permit if planning extended international travel.',
          resource: null,
          category: 'travel',
          priority: 'medium',
          completed: false,
          completedAt: null,
          subtasks: []
        },
        {
          id: 6,
          title: 'Notify Employer of Status Change',
          description: 'Update I-9 and other employment documents with your employer.',
          resource: null,
          category: 'employment',
          priority: 'high',
          completed: false,
          completedAt: null,
          subtasks: [
            { id: 'emp-1', title: 'Complete I-9 verification', completed: false },
            { id: 'emp-2', title: 'Update HR records', completed: false }
          ]
        },
        {
          id: 7,
          title: 'Establish Credit History',
          description: 'Apply for credit cards and establish U.S. credit history.',
          resource: null,
          category: 'financial',
          priority: 'medium',
          completed: false,
          completedAt: null,
          subtasks: [
            { id: 'credit-1', title: 'Open bank account', completed: false },
            { id: 'credit-2', title: 'Apply for secured credit card', completed: false },
            { id: 'credit-3', title: 'Use credit responsibly', completed: false }
          ]
        },
        {
          id: 8,
          title: 'Consider U.S. Citizenship',
          description: 'Start planning for naturalization after meeting residency requirements.',
          resource: null,
          category: 'future',
          priority: 'low',
          completed: false,
          completedAt: null,
          subtasks: [
            { id: 'cit-1', title: 'Check eligibility date', completed: false },
            { id: 'cit-2', title: 'Start English practice', completed: false },
            { id: 'cit-3', title: 'Study civics questions', completed: false }
          ]
        }
      ],
      
      milestones: [
        { id: 1, title: 'Green Card Approved', date: '2024-06-20', completed: true },
        { id: 2, title: 'SSN Received', date: '2024-07-01', completed: false },
        { id: 3, title: 'Driver\'s License Updated', date: '2024-07-15', completed: false },
        { id: 4, title: 'First Tax Filed', date: '2025-04-15', completed: false },
        { id: 5, title: '3 Years LPR', date: '2027-06-20', completed: false },
        { id: 6, title: 'Citizenship Eligible', date: '2029-06-20', completed: false }
      ],
      
      toggleItem: (id) => set((state) => {
        const checklist = state.checklist.map(item => {
          if (item.id === id) {
            const completed = !item.completed
            return {
              ...item,
              completed,
              completedAt: completed ? new Date().toISOString() : null,
              subtasks: item.subtasks.map(st => ({ ...st, completed }))
            }
          }
          return item
        })
        return { checklist }
      }),
      
      toggleSubtask: (itemId, subtaskId) => set((state) => ({
        checklist: state.checklist.map(item => {
          if (item.id === itemId) {
            const subtasks = item.subtasks.map(st =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
            const allSubtasksCompleted = subtasks.every(st => st.completed)
            return {
              ...item,
              subtasks,
              completed: allSubtasksCompleted || item.completed,
              completedAt: allSubtasksCompleted ? new Date().toISOString() : item.completedAt
            }
          }
          return item
        })
      })),
      
      getProgress: () => {
        const { checklist } = get()
        const completed = checklist.filter(i => i.completed).length
        return Math.round((completed / checklist.length) * 100)
      },
      
      getCompletedItems: () => {
        const { checklist } = get()
        return checklist.filter(i => i.completed)
      },
      
      getPendingItems: () => {
        const { checklist } = get()
        return checklist.filter(i => !i.completed)
      },
      
      getItemsByCategory: (category) => {
        const { checklist } = get()
        return checklist.filter(i => i.category === category)
      },
      
      getUpcomingMilestones: () => {
        const { milestones } = get()
        const now = new Date()
        return milestones
          .filter(m => !m.completed && new Date(m.date) > now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
      },
      
      reset: () => set({
        checklist: [
          {
            id: 1, title: 'Apply for Social Security Number', description: '',
            resource: '', category: 'documents', priority: 'high',
            completed: false, completedAt: null, subtasks: []
          },
          {
            id: 2, title: 'Update Driver\'s License/State ID', description: '',
            resource: null, category: 'documents', priority: 'high',
            completed: false, completedAt: null, subtasks: []
          },
          {
            id: 3, title: 'Register with Selective Service', description: '',
            resource: '', category: 'legal', priority: 'medium',
            completed: false, completedAt: null, subtasks: []
          },
          {
            id: 4, title: 'File Taxes as Resident Alien', description: '',
            resource: null, category: 'financial', priority: 'high',
            completed: false, completedAt: null, subtasks: []
          },
          {
            id: 5, title: 'Update International Travel Documents', description: '',
            resource: null, category: 'travel', priority: 'medium',
            completed: false, completedAt: null, subtasks: []
          },
          {
            id: 6, title: 'Notify Employer of Status Change', description: '',
            resource: null, category: 'employment', priority: 'high',
            completed: false, completedAt: null, subtasks: []
          },
          {
            id: 7, title: 'Establish Credit History', description: '',
            resource: null, category: 'financial', priority: 'medium',
            completed: false, completedAt: null, subtasks: []
          },
          {
            id: 8, title: 'Consider U.S. Citizenship', description: '',
            resource: null, category: 'future', priority: 'low',
            completed: false, completedAt: null, subtasks: []
          }
        ],
        milestones: []
      })
    }),
    { name: 'aegis-checklist' }
  )
)

// ========================================
// THEME STORE
// ========================================
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      })),
      setTheme: (theme) => set({ theme })
    }),
    { name: 'aegis-theme' }
  )
)
