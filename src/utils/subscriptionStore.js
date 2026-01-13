import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ========================================
// SUBSCRIPTION STORE - Paywall & Access Control
// ========================================
export const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      // Subscription Plan State
      plan: 'FREE', // 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_ANNUAL'
      status: 'none', // 'active' | 'past_due' | 'cancelled' | 'none'
      subscriptionId: null,
      currentPeriodEnd: null,
      
      // Feature Flags
      features: {
        // AI & Insights
        aiInsights: false,
        adjucatorAnalysis: false,
        mockInterview: false,
        
        // Documents
        ocrScanning: false,
        documentAnalysis: false,
        maxStorage: 50, // 50MB for free, 1024MB for premium
        
        // Forms
        autoFill: false,
        unlimitedForms: false,
        
        // Case Tracking
        autoCaseUpdates: false,
        priorityNotifications: false,
        
        // Attorney
        bookAppointments: false,
        freeConsultation: false,
        
        // Knowledge Base
        premiumArticles: false,
        legalTemplates: false,
        
        // Post-Approval
        postApprovalTools: false,
        
        // General
        prioritySupport: false
      },
      
      // Loading States
      isProcessing: false,
      
      // Plan Configuration
      plans: {
        FREE: {
          name: 'Free',
          price: 0,
          interval: 'forever',
          features: ['basic_case_tracking', 'document_upload', 'knowledge_base', 'attorney_directory'],
          limitations: {
            storage: 50,
            formsPerMonth: 3,
            aiAssessments: 1
          }
        },
        PREMIUM_MONTHLY: {
          name: 'Premium',
          price: 29.99,
          interval: 'month',
          recommended: false,
          features: ['ai_insights', 'unlimited_forms', 'attorney_booking', 'interview_prep', 'priority_support', 'premium_knowledge'],
          benefits: ['AI-Powered Insights', 'Unlimited Form Generation', 'Priority Attorney Booking', 'Mock Interview Simulator', '1GB Storage', '24/7 Support']
        },
        PREMIUM_ANNUAL: {
          name: 'Premium Annual',
          price: 249.99,
          interval: 'year',
          recommended: true,
          savings: '33%',
          features: ['ai_insights', 'unlimited_forms', 'attorney_booking', 'interview_prep', 'priority_support', 'premium_knowledge'],
          benefits: ['Save $109 per year', 'AI-Powered Insights', 'Unlimited Form Generation', 'Priority Attorney Booking', 'Mock Interview Simulator', '1GB Storage', '24/7 Support']
        }
      },
      
      // Actions
      setPlan: (plan) => {
        const featureState = get().features
        
        if (plan === 'FREE') {
          set({
            plan: 'FREE',
            status: 'none',
            subscriptionId: null,
            currentPeriodEnd: null,
            features: {
              ...featureState,
              aiInsights: false,
              adjucatorAnalysis: false,
              mockInterview: false,
              ocrScanning: false,
              documentAnalysis: false,
              maxStorage: 50,
              autoFill: false,
              unlimitedForms: false,
              autoCaseUpdates: false,
              priorityNotifications: false,
              bookAppointments: false,
              freeConsultation: false,
              premiumArticles: false,
              legalTemplates: false,
              postApprovalTools: false,
              prioritySupport: false
            }
          })
        } else if (plan === 'PREMIUM_MONTHLY') {
          set({
            plan: 'PREMIUM_MONTHLY',
            status: 'active',
            subscriptionId: `sub_${Date.now()}`,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            features: {
              ...featureState,
              aiInsights: true,
              adjucatorAnalysis: true,
              mockInterview: true,
              ocrScanning: true,
              documentAnalysis: true,
              maxStorage: 1024,
              autoFill: true,
              unlimitedForms: true,
              autoCaseUpdates: true,
              priorityNotifications: true,
              bookAppointments: true,
              freeConsultention: true,
              premiumArticles: true,
              legalTemplates: true,
              postApprovalTools: true,
              prioritySupport: true
            }
          })
        } else if (plan === 'PREMIUM_ANNUAL') {
          set({
            plan: 'PREMIUM_ANNUAL',
            status: 'active',
            subscriptionId: `sub_${Date.now()}`,
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            features: {
              ...featureState,
              aiInsights: true,
              adjucatorAnalysis: true,
              mockInterview: true,
              ocrScanning: true,
              documentAnalysis: true,
              maxStorage: 1024,
              autoFill: true,
              unlimitedForms: true,
              autoCaseUpdates: true,
              priorityNotifications: true,
              bookAppointments: true,
              freeConsultation: true,
              premiumArticles: true,
              legalTemplates: true,
              postApprovalTools: true,
              prioritySupport: true
            }
          })
        }
      },
      
      upgradeToMonthly: async () => {
        set({ isProcessing: true })
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        get().setPlan('PREMIUM_MONTHLY')
        set({ isProcessing: false })
      },
      
      upgradeToAnnual: async () => {
        set({ isProcessing: true })
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        get().setPlan('PREMIUM_ANNUAL')
        set({ isProcessing: false })
      },
      
      cancelSubscription: async () => {
        set({ isProcessing: true })
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({
          plan: 'FREE',
          status: 'cancelled',
          isProcessing: false
        })
      },
      
      // Feature Check Helpers
      hasAccess: (feature) => {
        const { features, plan } = get()
        if (plan !== 'FREE') return true
        return features[feature] || false
      },
      
      canAccessPage: (pageName) => {
        const { plan } = get()
        
        const premiumPages = [
          'adjudicator',
          'post-approval'
        ]
        
        const aiFeaturePages = [
          'eligibility_ai',
          'document_ai',
          'interview_ai'
        ]
        
        if (plan !== 'FREE') return true
        if (premiumPages.includes(pageName)) return false
        
        return true
      },
      
      getStorageUsage: () => {
        const { features } = get()
        return {
          used: 0, // Would integrate with document store
          limit: features.maxStorage,
          percentage: 0
        }
      },
      
      getFormsRemaining: () => {
        const { features, plan } = get()
        if (plan !== 'FREE') return 'unlimited'
        return features.unlimitedForms ? 'unlimited' : 3
      },
      
      reset: () => set({
        plan: 'FREE',
        status: 'none',
        subscriptionId: null,
        currentPeriodEnd: null,
        isProcessing: false
      })
    }),
    {
      name: 'visaguideai-subscription',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ========================================
// Feature Access Hook
// ========================================
export const useFeatureAccess = (feature) => {
  const hasAccess = useSubscriptionStore(state => state.hasAccess(feature))
  const plan = useSubscriptionStore(state => state.plan)
  
  return {
    hasAccess,
    isPremium: plan !== 'FREE',
    plan
  }
}

// ========================================
// Page Protection Hook
// ========================================
export const usePageAccess = (pagePath) => {
  const canAccess = useSubscriptionStore(state => state.canAccessPage(pagePath))
  const plan = useSubscriptionStore(state => state.plan)
  
  return {
    canAccess,
    isPremium: plan !== 'FREE',
    plan,
    needsUpgrade: !canAccess && plan === 'FREE'
  }
}
