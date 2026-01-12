import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// User Profile Store
export const useUserStore = create(
  persist(
    (set) => ({
      user: {
        name: 'Alexandra Chen',
        email: 'alexandra.chen@email.com',
        avatar: 'AC',
        country: 'Taiwan',
        currentStatus: 'H-1B Visa',
        caseNumber: 'MSC-2024-123456'
      },
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      }))
    }),
    { name: 'aegis-user' }
  )
)

// Eligibility Assessment Store
export const useEligibilityStore = create(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: {},
      result: null,
      
      setAnswer: (questionId, answer) => set((state) => ({
        answers: { ...state.answers, [questionId]: answer }
      })),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 5)
      })),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0)
      })),
      
      goToStep: (step) => set({ currentStep: step }),
      
      calculateResult: () => {
        const { answers } = get()
        const result = eligibilityLogic(answers)
        set({ result })
        return result
      },
      
      reset: () => set({ currentStep: 0, answers: {}, result: null })
    }),
    { name: 'aegis-eligibility' }
  )
)

// Eligibility Logic
const eligibilityLogic = (answers) => {
  const { relationship, status, timeInUS, education, workExperience } = answers
  
  if (status === 'citizen') {
    return {
      pathway: 'U.S. Citizenship',
      category: 'Naturalization',
      eligibility: 92,
      timeframe: '3-6 months',
      description: 'You appear eligible for naturalization based on your marriage to a U.S. citizen. You may qualify for the 3-year rule if continuously married.',
      requirements: ['Continuous residence for 3 years', 'Physical presence in U.S.', 'Good moral character', 'English & Civics test'],
      documents: ['Birth certificate', 'Marriage certificate', 'Tax returns', 'Passport']
    }
  }
  
  if (relationship === 'immediate' && status === 'green_card') {
    return {
      pathway: 'Citizenship via Marriage',
      category: 'Naturalization (3-Year Rule)',
      eligibility: 88,
      timeframe: '3-6 months',
      description: 'As a green card holder married to a U.S. citizen, you may qualify for the 3-year naturalization rule.',
      requirements: ['3 years of continuous residence', '3 years of marriage', 'Joint sponsor if needed'],
      documents: ['Green card', 'Marriage certificate', 'Tax returns', 'Birth certificates of children']
    }
  }
  
  if (relationship === 'immediate' && (status === 'h1b' || status === 'l1' || status === 'other_visa')) {
    return {
      pathway: 'I-130 Petition + I-485 Adjustment',
      category: 'Family-Based Immigration',
      eligibility: 95,
      timeframe: '12-18 months',
      description: 'Your U.S. citizen immediate relative can file Form I-130 and I-485 concurrently for faster processing.',
      requirements: ['I-130 petition approval', 'I-485 application', 'Medical examination', 'Biometrics'],
      documents: ['Passport', 'Birth certificate', 'Marriage certificate', 'Police certificates', 'Tax returns']
    }
  }
  
  if (relationship === 'sibling' && status === 'h1b') {
    return {
      pathway: 'I-130 Petition (F4 Category)',
      category: 'Family-Based Immigration',
      eligibility: 75,
      timeframe: '14-20 years',
      description: 'While you have a valid H-1B, sibling petitions for adult citizens have very long wait times (12+ years). Consider employment-based options.',
      requirements: ['I-130 petition', 'PERM labor certification (if employer-sponsored)', 'I-485 when priority date current'],
      documents: ['Birth certificates', 'Passport', 'Police certificates'],
      notes: 'Consider H-1B extension or employment-based green card options for faster processing.'
    }
  }
  
  if (education === 'advanced' && workExperience === 'specialized') {
    return {
      pathway: 'EB-2 NIW or PERM',
      category: 'Employment-Based Immigration',
      eligibility: 82,
      timeframe: '18-24 months',
      description: 'Your advanced degree and specialized experience may qualify you for employment-based second preference (EB-2).',
      requirements: ['PERM labor certification OR NIW petition', 'I-140 petition', 'I-485 adjustment'],
      documents: ['Degrees and transcripts', 'Employment letters', 'Publications or patents', 'Expert letters'],
      notes: 'National Interest Waiver (NIW) may allow self-petition without employer sponsorship.'
    }
  }
  
  return {
    pathway: 'General Consultation Recommended',
    category: 'Custom Assessment',
    eligibility: 65,
    timeframe: 'Variable',
    description: 'Based on your answers, we recommend a personalized consultation to explore your best options.',
    requirements: ['Schedule consultation', 'Gather all documents'],
    documents: ['All passports', 'Current visa', 'Employment history', 'Educational credentials'],
    notes: 'Multiple pathways may be available. A specialist can provide detailed guidance.'
  }
}

// Documents Store
export const useDocumentStore = create(
  persist(
    (set, get) => ({
      documents: [],
      
      addDocument: (doc) => set((state) => ({
        documents: [...state.documents, { ...doc, id: Date.now(), uploadedAt: new Date().toISOString() }]
      })),
      
      removeDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),
      
      getDocumentsByCategory: (category) => {
        const { documents } = get()
        return documents.filter(d => d.category === category)
      },
      
      reset: () => set({ documents: [] })
    }),
    { name: 'aegis-documents' }
  )
)

// Case Tracking Store
export const useCaseStore = create(
  persist(
    (set, get) => ({
      cases: [
        {
          id: 1,
          type: 'I-485 Adjustment of Status',
          caseNumber: 'MSC-2024-123456',
          status: 'interview',
          submittedDate: '2024-03-15',
          estimatedCompletion: '2025-01-30',
          milestones: [
            { id: 1, name: 'Application Received', date: '2024-03-18', completed: true },
            { id: 2, name: 'Biometrics Scheduled', date: '2024-04-05', completed: true },
            { id: 3, name: 'Biometrics Completed', date: '2024-04-20', completed: true },
            { id: 4, name: 'Interview Scheduled', date: '2025-01-10', completed: false, active: true },
            { id: 5, name: 'Decision Issued', date: null, completed: false }
          ]
        },
        {
          id: 2,
          type: 'I-130 Petition',
          caseNumber: 'WAC-2024-987654',
          status: 'approved',
          submittedDate: '2024-01-10',
          estimatedCompletion: '2024-08-15',
          milestones: [
            { id: 1, name: 'Petition Received', date: '2024-01-12', completed: true },
            { id: 2, name: 'Request for Evidence', date: '2024-03-01', completed: true },
            { id: 3, name: 'RFE Response', date: '2024-03-25', completed: true },
            { id: 4, name: 'Petition Approved', date: '2024-06-20', completed: true }
          ]
        }
      ],
      
      addCase: (caseData) => set((state) => ({
        cases: [...state.cases, { ...caseData, id: Date.now() }]
      })),
      
      updateMilestone: (caseId, milestoneId, data) => set((state) => ({
        cases: state.cases.map(c => 
          c.id === caseId 
            ? { ...c, milestones: c.milestones.map(m => m.id === milestoneId ? { ...m, ...data } : m) }
            : c
        )
      })),
      
      getCaseById: (id) => {
        const { cases } = get()
        return cases.find(c => c.id === id)
      }
    }),
    { name: 'aegis-cases' }
  )
)

// Form Data Store
export const useFormStore = create(
  persist(
    (set, get) => ({
      currentForm: 'I-485',
      formData: {},
      
      setFormData: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value }
      })),
      
      setCurrentForm: (form) => set({ currentForm: form, formData: {} }),
      
      autoFillFromProfile: (profileData) => set((state) => ({
        formData: { ...state.formData, ...profileData }
      })),
      
      getFormCompletion: () => {
        const { formData } = get()
        const requiredFields = ['fullName', 'dateOfBirth', 'countryOfBirth', 'alienNumber', 'ssn']
        const completed = requiredFields.filter(f => formData[f]).length
        return Math.round((completed / requiredFields.length) * 100)
      },
      
      reset: () => set({ currentForm: 'I-485', formData: {} })
    }),
    { name: 'aegis-forms' }
  )
)

// Chat Store
export const useChatStore = create(
  (set, get) => ({
    messages: [
      {
        id: 1,
        role: 'agent',
        agent: 'AEGIS Navigator',
        content: "Hello! I'm AEGIS Navigator, your AI guide through the U.S. immigration process. How can I help you today?",
        timestamp: new Date(Date.now() - 3600000)
      }
    ],
    isTyping: false,
    
    addMessage: (message) => set((state) => ({
      messages: [...state.messages, { ...message, id: Date.now(), timestamp: new Date() }]
    })),
    
    setTyping: (isTyping) => set({ isTyping }),
    
    clearChat: () => set({
      messages: [{
        id: 1,
        role: 'agent',
        agent: 'AEGIS Navigator',
        content: "Hello! I'm AEGIS Navigator, your AI guide through the U.S. immigration process. How can I help you today?",
        timestamp: new Date()
      }]
    })
  })
)

// Interview Prep Store
export const useInterviewStore = create(
  (set, get) => ({
    currentQuestion: 0,
    responses: [],
    isRecording: false,
    recordingTime: 0,
    
    questions: [
      {
        id: 1,
        category: 'Background',
        question: 'Tell me about yourself and your background.',
        tips: 'Focus on your professional journey, education, and what brought you to the United States.',
        expectedDuration: '2-3 minutes'
      },
      {
        id: 2,
        category: 'Relationship',
        question: 'How did you and your spouse meet? Can you describe your relationship?',
        tips: 'Be genuine and specific. Include details about your dating experience, engagement, and marriage.',
        expectedDuration: '3-4 minutes'
      },
      {
        id: 3,
        category: 'Life Together',
        question: 'Describe a typical day in your life with your spouse.',
        tips: 'Include daily routines, responsibilities, and how you support each other.',
        expectedDuration: '2-3 minutes'
      },
      {
        id: 4,
        category: 'Future Plans',
        question: 'What are your plans for the future together?',
        tips: 'Discuss career goals, family plans, and how you see your life unfolding.',
        expectedDuration: '2-3 minutes'
      }
    ],
    
    nextQuestion: () => set((state) => ({
      currentQuestion: Math.min(state.currentQuestion + 1, state.questions.length - 1)
    })),
    
    prevQuestion: () => set((state) => ({
      currentQuestion: Math.max(state.currentQuestion - 1, 0)
    })),
    
    saveResponse: (questionId, response) => set((state) => ({
      responses: [...state.responses, { questionId, response, timestamp: new Date() }]
    })),
    
    setRecording: (isRecording) => set({ isRecording }),
    
    setRecordingTime: (time) => set({ recordingTime: time }),
    
    reset: () => set({ currentQuestion: 0, responses: [], isRecording: false, recordingTime: 0 })
  })
)

// Post-Approval Store
export const useChecklistStore = create(
  persist(
    (set, get) => ({
      checklist: [
        {
          id: 1,
          title: 'Apply for Social Security Number',
          description: 'If you haven\'t already, visit your local SSA office to apply for your SSN card.',
          resource: 'https://www.ssa.gov/ssnumber/',
          completed: false
        },
        {
          id: 2,
          title: 'Update Driver\'s License/State ID',
          description: 'Visit your DMV to update your driver\'s license with your new status.',
          resource: null,
          completed: false
        },
        {
          id: 3,
          title: 'Register with Selective Service (if applicable)',
          description: 'Male immigrants aged 18-25 must register with Selective Service.',
          resource: 'https://www.sss.gov/',
          completed: false
        },
        {
          id: 4,
          title: 'File Taxes as Resident Alien',
          description: 'Ensure you understand your new tax obligations as a lawful permanent resident.',
          resource: null,
          completed: false
        },
        {
          id: 5,
          title: 'Update International Travel Documents',
          description: 'Apply for a re-entry permit if planning extended international travel.',
          resource: null,
          completed: false
        },
        {
          id: 6,
          title: 'Notify Employer of Status Change',
          description: 'Update I-9 and other employment documents with your employer.',
          resource: null,
          completed: false
        },
        {
          id: 7,
          title: 'Establish Credit History',
          description: 'Apply for credit cards and establish U.S. credit history.',
          resource: null,
          completed: false
        },
        {
          id: 8,
          title: 'Consider U.S. Citizenship (Future)',
          description: 'Start planning for naturalization after meeting residency requirements.',
          resource: null,
          completed: false
        }
      ],
      
      toggleItem: (id) => set((state) => ({
        checklist: state.checklist.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      })),
      
      getProgress: () => {
        const { checklist } = get()
        const completed = checklist.filter(i => i.completed).length
        return Math.round((completed / checklist.length) * 100)
      },
      
      reset: () => set({
        checklist: [
          {
            id: 1,
            title: 'Apply for Social Security Number',
            description: 'If you haven\'t already, visit your local SSA office to apply for your SSN card.',
            resource: 'https://www.ssa.gov/ssnumber/',
            completed: false
          },
          {
            id: 2,
            title: 'Update Driver\'s License/State ID',
            description: 'Visit your DMV to update your driver\'s license with your new status.',
            resource: null,
            completed: false
          },
          {
            id: 3,
            title: 'Register with Selective Service (if applicable)',
            description: 'Male immigrants aged 18-25 must register with Selective Service.',
            resource: 'https://www.sss.gov/',
            completed: false
          },
          {
            id: 4,
            title: 'File Taxes as Resident Alien',
            description: 'Ensure you understand your new tax obligations as a lawful permanent resident.',
            resource: null,
            completed: false
          },
          {
            id: 5,
            title: 'Update International Travel Documents',
            description: 'Apply for a re-entry permit if planning extended international travel.',
            resource: null,
            completed: false
          },
          {
            id: 6,
            title: 'Notify Employer of Status Change',
            description: 'Update I-9 and other employment documents with your employer.',
            resource: null,
            completed: false
          },
          {
            id: 7,
            title: 'Establish Credit History',
            description: 'Apply for credit cards and establish U.S. credit history.',
            resource: null,
            completed: false
          },
          {
            id: 8,
            title: 'Consider U.S. Citizenship (Future)',
            description: 'Start planning for naturalization after meeting residency requirements.',
            resource: null,
            completed: false
          }
        ]
      })
    }),
    { name: 'aegis-checklist' }
  )
)

// Theme Store
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
