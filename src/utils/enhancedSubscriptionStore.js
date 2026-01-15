import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ========================================
// ENHANCED SUBSCRIPTION STORE - Paywall & Access Control
// ========================================
export const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      // Subscription Plan State
      plan: 'FREE', // 'FREE' | 'PREMIUM_MONTHLY' | 'PREMIUM_ANNUAL'
      status: 'none', // 'active' | 'past_due' | 'cancelled' | 'none'
      subscriptionId: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      
      // Usage Tracking for Free Tier
      usage: {
        formsGenerated: 0,
        documentsUploaded: 0,
        storageUsed: 0,
        aiAssessments: 0,
        interviewSessions: 0,
        attorneyBookings: 0
      },
      
      // Usage Limits for Free Tier
      limits: {
        formsPerMonth: 3,
        maxDocuments: 10,
        maxStorageMB: 50,
        aiAssessmentsPerMonth: 1,
        interviewSessionsPerMonth: 0,
        attorneyBookingsPerMonth: 0
      },
      
      // Feature Flags - Comprehensive Access Control
      features: {
        // AI & Insights
        aiInsights: false,
        adjudicatorAnalysis: false,
        mockInterview: false,
        riskAssessment: false,
        casePrediction: false,
        
        // Documents
        ocrScanning: false,
        documentAnalysis: false,
        maxStorage: 50, // 50MB for free, 1024MB for premium
        
        // Forms
        autoFill: false,
        unlimitedForms: false,
        digitalSignature: false,
        formValidation: false,
        
        // Case Tracking
        autoCaseUpdates: false,
        priorityNotifications: false,
        caseAnalytics: false,
        
        // Attorney
        bookAppointments: false,
        freeConsultation: false,
        caseReviewDiscount: false,
        priorityResponse: false,
        
        // Knowledge Base
        premiumArticles: false,
        legalTemplates: false,
        videoContent: false,
        
        // Post-Approval
        postApprovalTools: false,
        citizenshipGuide: false,
        
        // Support
        prioritySupport: false,
        dedicatedManager: false,
        liveChat: false
      },
      
      // Loading States
      isProcessing: false,
      isInitializing: false,
      
      // Plan Configuration with Full Details
      plans: {
        FREE: {
          id: 'FREE',
          name: 'Free',
          price: 0,
          interval: 'forever',
          description: 'Essential features to get started',
          features: [
            'basic_case_tracking',
            'document_upload',
            'knowledge_base',
            'attorney_directory'
          ],
          benefits: [
            'Basic Case Tracking',
            '50MB Document Storage',
            '3 Forms per month',
            'Knowledge Base Access',
            'Attorney Directory'
          ],
          limitations: {
            storage: 50,
            formsPerMonth: 3,
            aiAssessments: 1,
            documents: 10,
            interviewSessions: 0,
            attorneyBookings: 0
          }
        },
        PREMIUM_MONTHLY: {
          id: 'PREMIUM_MONTHLY',
          name: 'Premium',
          price: 29.99,
          interval: 'month',
          recommended: false,
          description: 'Full AI-powered immigration support',
          features: [
            'ai_insights',
            'unlimited_forms',
            'attorney_booking',
            'interview_prep',
            'priority_support',
            'premium_knowledge'
          ],
          benefits: [
            'AI-Powered Case Analysis',
            'Unlimited Form Generation',
            'Mock Interview Simulator',
            'Priority Attorney Booking',
            '1GB Storage',
            '24/7 Priority Support',
            'Adjudicator Insights',
            'Document AI Analysis'
          ]
        },
        PREMIUM_ANNUAL: {
          id: 'PREMIUM_ANNUAL',
          name: 'Premium Annual',
          price: 249.99,
          interval: 'year',
          recommended: true,
          savings: '33%',
          description: 'Best value - Full AI-powered support',
          features: [
            'ai_insights',
            'unlimited_forms',
            'attorney_booking',
            'interview_prep',
            'priority_support',
            'premium_knowledge',
            'priority_processing',
            'extended_storage'
          ],
          benefits: [
            'Save $109 per year',
            'Everything in Premium Monthly',
            'Priority Case Processing',
            'Extended 2GB Storage',
            'VIP Support Channel',
            'Early Access to New Features',
            'Dedicated Account Manager',
            'Custom Immigration Roadmap'
          ]
        }
      },
      
      // ========================================
      // CORE ACTIONS
      // ========================================
      
      setPlan: (plan) => {
        const currentFeatures = get().features
        const isPremium = plan !== 'FREE'
        
        const featureState = {
          ...currentFeatures,
          // AI Features
          aiInsights: isPremium,
          adjudicatorAnalysis: isPremium,
          mockInterview: isPremium,
          riskAssessment: isPremium,
          casePrediction: isPremium,
          
          // Document Features
          ocrScanning: isPremium,
          documentAnalysis: isPremium,
          maxStorage: isPremium ? (plan === 'PREMIUM_ANNUAL' ? 2048 : 1024) : 50,
          
          // Form Features
          autoFill: isPremium,
          unlimitedForms: isPremium,
          digitalSignature: isPremium,
          formValidation: isPremium,
          
          // Case Features
          autoCaseUpdates: isPremium,
          priorityNotifications: isPremium,
          caseAnalytics: isPremium,
          
          // Attorney Features
          bookAppointments: isPremium,
          freeConsultation: isPremium,
          caseReviewDiscount: isPremium,
          priorityResponse: isPremium,
          
          // Knowledge Features
          premiumArticles: isPremium,
          legalTemplates: isPremium,
          videoContent: isPremium,
          
          // Post-Approval Features
          postApprovalTools: isPremium,
          citizenshipGuide: isPremium,
          
          // Support Features
          prioritySupport: isPremium,
          dedicatedManager: plan === 'PREMIUM_ANNUAL',
          liveChat: isPremium
        }
        
        if (plan === 'FREE') {
          set({
            plan: 'FREE',
            status: 'none',
            subscriptionId: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            features: featureState
          })
        } else if (plan === 'PREMIUM_MONTHLY') {
          set({
            plan: 'PREMIUM_MONTHLY',
            status: 'active',
            subscriptionId: `sub_${Date.now()}`,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
            features: featureState
          })
        } else if (plan === 'PREMIUM_ANNUAL') {
          set({
            plan: 'PREMIUM_ANNUAL',
            status: 'active',
            subscriptionId: `sub_${Date.now()}`,
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false,
            features: featureState
          })
        }
        
        // Add notification
        const { addNotification } = require('../utils/enhancedStore').useGlobalStore.getState()
        if (addNotification) {
          addNotification({
            type: 'success',
            title: isPremium ? 'Welcome to Premium!' : 'Plan Updated',
            message: isPremium 
              ? 'You now have full access to all Premium features.'
              : 'Your plan has been updated to Free.'
          })
        }
      },
      
      upgradeToMonthly: async () => {
        set({ isProcessing: true })
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        get().setPlan('PREMIUM_MONTHLY')
        set({ isProcessing: false })
        return true
      },
      
      upgradeToAnnual: async () => {
        set({ isProcessing: true })
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        get().setPlan('PREMIUM_ANNUAL')
        set({ isProcessing: false })
        return true
      },
      
      cancelSubscription: async () => {
        set({ isProcessing: true })
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({
          plan: 'FREE',
          status: 'cancelled',
          cancelAtPeriodEnd: true,
          isProcessing: false
        })
        return true
      },
      
      reactivateSubscription: async () => {
        set({ isProcessing: true })
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({
          cancelAtPeriodEnd: false,
          isProcessing: false
        })
        return true
      },
      
      // ========================================
      // USAGE TRACKING
      // ========================================
      
      incrementUsage: (category) => {
        const { usage } = get()
        set({
          usage: {
            ...usage,
            [category]: (usage[category] || 0) + 1
          }
        })
      },
      
      decrementUsage: (category) => {
        const { usage } = get()
        set({
          usage: {
            ...usage,
            [category]: Math.max(0, (usage[category] || 0) - 1)
          }
        })
      },
      
      resetUsage: () => {
        set({
          usage: {
            formsGenerated: 0,
            documentsUploaded: 0,
            storageUsed: 0,
            aiAssessments: 0,
            interviewSessions: 0,
            attorneyBookings: 0
          }
        })
      },
      
      updateStorageUsage: (bytes) => {
        const { usage } = get()
        set({
          usage: {
            ...usage,
            storageUsed: usage.storageUsed + bytes
          }
        })
      },
      
      // ========================================
      // ACCESS CHECK HELPERS
      // ========================================
      
      hasAccess: (feature) => {
        const { features, plan } = get()
        if (plan !== 'FREE') return true
        return features[feature] || false
      },
      
      canAccessPage: (pagePath) => {
        const { plan, features } = get()
        
        // Premium-only pages
        const premiumPages = [
          '/adjudicator',
          '/post-approval',
          '/attorneys-premium'
        ]
        
        // AI feature pages
        const aiFeaturePages = [
          '/eligibility-ai',
          '/document-ai',
          '/interview-ai'
        ]
        
        if (plan !== 'FREE') return true
        
        if (premiumPages.some(page => pagePath.startsWith(page))) {
          return false
        }
        
        return true
      },
      
      canUseFeature: (featureName) => {
        const { plan, features, usage, limits } = get()
        
        // Premium users have all features
        if (plan !== 'FREE') return true
        
        // Check feature flag
        if (!features[featureName]) return false
        
        // For usage-based features, check limits
        switch (featureName) {
          case 'formsGeneration':
            return usage.formsGenerated < limits.formsPerMonth
          case 'documentUpload':
            return usage.documentsUploaded < limits.maxDocuments
          case 'aiAssessment':
            return usage.aiAssessments < limits.aiAssessmentsPerMonth
          case 'interviewSession':
            return usage.interviewSessions < limits.interviewSessionsPerMonth
          case 'attorneyBooking':
            return usage.attorneyBookings < limits.attorneyBookingsPerMonth
          default:
            return features[featureName]
        }
      },
      
      getRemainingUsage: (featureName) => {
        const { plan, usage, limits } = get()
        
        if (plan !== 'FREE') return 'unlimited'
        
        switch (featureName) {
          case 'formsGeneration':
            return Math.max(0, limits.formsPerMonth - usage.formsGenerated)
          case 'documentUpload':
            return Math.max(0, limits.maxDocuments - usage.documentsUploaded)
          case 'aiAssessment':
            return Math.max(0, limits.aiAssessmentsPerMonth - usage.aiAssessments)
          case 'interviewSession':
            return Math.max(0, limits.interviewSessionsPerMonth - usage.interviewSessions)
          case 'attorneyBooking':
            return Math.max(0, limits.attorneyBookingsPerMonth - usage.attorneyBookings)
          default:
            return null
        }
      },
      
      getStorageUsage: () => {
        const { usage, features, plan } = get()
        const limitMB = features.maxStorage
        const usedMB = Math.round(usage.storageUsed / (1024 * 1024))
        
        return {
          used: usedMB,
          limit: limitMB,
          percentage: Math.min(100, (usedMB / limitMB) * 100),
          isFull: usedMB >= limitMB
        }
      },
      
      getFormsRemaining: () => {
        const { plan, usage, limits } = get()
        if (plan !== 'FREE') return 'unlimited'
        return Math.max(0, limits.formsPerMonth - usage.formsGenerated)
      },
      
      // ========================================
      // UPGRADE PROMPTS
      // ========================================
      
      shouldShowUpgradePrompt: (featureName) => {
        const { plan, canUseFeature } = get()
        
        if (plan !== 'FREE') return false
        
        // Show prompt if feature exists but is limited
        return !canUseFeature(featureName)
      },
      
      getUpgradeContext: (featureName) => {
        const contexts = {
          formsGeneration: {
            title: 'Form Limit Reached',
            description: 'You\'ve used all 3 free forms this month. Upgrade to Premium for unlimited form generation.',
            feature: 'unlimited_forms'
          },
          documentUpload: {
            title: 'Document Limit Reached',
            description: 'You\'ve reached your free document limit. Upgrade for up to 1GB storage.',
            feature: 'document_storage'
          },
          aiAssessment: {
            title: 'AI Assessment Limit',
            description: 'You\'ve used your free AI assessment. Upgrade for unlimited AI-powered insights.',
            feature: 'ai_insights'
          },
          interviewSession: {
            title: 'Interview Prep Locked',
            description: 'Upgrade to Premium to access the AI Mock Interview Simulator.',
            feature: 'mock_interview'
          },
          attorneyBooking: {
            title: 'Attorney Booking Limited',
            description: 'Upgrade for priority attorney booking and free consultations.',
            feature: 'attorney_booking'
          },
          default: {
            title: 'Premium Feature',
            description: 'Upgrade to Premium to unlock this feature.',
            feature: 'premium_access'
          }
        }
        
        return contexts[featureName] || contexts.default
      },
      
      // ========================================
      // SUBSCRIPTION MANAGEMENT
      // ========================================
      
      getSubscriptionDetails: () => {
        const { plan, status, currentPeriodEnd, cancelAtPeriodEnd, plans } = get()
        const planDetails = plans[plan]
        
        return {
          plan,
          planName: planDetails?.name || 'Free',
          status,
          price: planDetails?.price || 0,
          interval: planDetails?.interval || 'forever',
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
          cancelAtPeriodEnd,
          benefits: planDetails?.benefits || [],
          isPremium: plan !== 'FREE',
          daysRemaining: currentPeriodEnd 
            ? Math.ceil((new Date(currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24))
            : null
        }
      },
      
      isFeatureLocked: (featureKey) => {
        const { features, plan } = get()
        // Feature is locked if it's not enabled for free users
        return plan === 'FREE' && !features[featureKey]
      },
      
      reset: () => set({
        plan: 'FREE',
        status: 'none',
        subscriptionId: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        usage: {
          formsGenerated: 0,
          documentsUploaded: 0,
          storageUsed: 0,
          aiAssessments: 0,
          interviewSessions: 0,
          attorneyBookings: 0
        },
        features: {
          aiInsights: false,
          adjudicatorAnalysis: false,
          mockInterview: false,
          riskAssessment: false,
          casePrediction: false,
          ocrScanning: false,
          documentAnalysis: false,
          maxStorage: 50,
          autoFill: false,
          unlimitedForms: false,
          digitalSignature: false,
          formValidation: false,
          autoCaseUpdates: false,
          priorityNotifications: false,
          caseAnalytics: false,
          bookAppointments: false,
          freeConsultation: false,
          caseReviewDiscount: false,
          priorityResponse: false,
          premiumArticles: false,
          legalTemplates: false,
          videoContent: false,
          postApprovalTools: false,
          citizenshipGuide: false,
          prioritySupport: false,
          dedicatedManager: false,
          liveChat: false
        },
        isProcessing: false
      })
    }),
    {
      name: 'aegis-subscription',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ========================================
// HOOKS FOR EASY ACCESS
// ========================================

export const useFeatureAccess = (feature) => {
  const hasAccess = useSubscriptionStore(state => state.hasAccess(feature))
  const canUse = useSubscriptionStore(state => state.canUseFeature(feature))
  const plan = useSubscriptionStore(state => state.plan)
  const isPremium = plan !== 'FREE'
  
  return {
    hasAccess,
    canUse,
    isPremium,
    plan,
    needsUpgrade: !canUse && plan === 'FREE'
  }
}

export const usePageAccess = (pagePath) => {
  const canAccess = useSubscriptionStore(state => state.canAccessPage(pagePath))
  const plan = useSubscriptionStore(state => state.plan)
  const isPremium = plan !== 'FREE'
  const getUpgradeContext = useSubscriptionStore(state => state.getUpgradeContext)
  
  return {
    canAccess,
    isPremium,
    plan,
    needsUpgrade: !canAccess && plan === 'FREE',
    upgradeContext: getUpgradeContext('page_access')
  }
}

export const useSubscription = () => {
  const plan = useSubscriptionStore(state => state.plan)
  const status = useSubscriptionStore(state => state.status)
  const currentPeriodEnd = useSubscriptionStore(state => state.currentPeriodEnd)
  const cancelAtPeriodEnd = useSubscriptionStore(state => state.cancelAtPeriodEnd)
  const plans = useSubscriptionStore(state => state.plans)
  const features = useSubscriptionStore(state => state.features)
  const usage = useSubscriptionStore(state => state.usage)
  const isProcessing = useSubscriptionStore(state => state.isProcessing)
  const cancelSubscription = useSubscriptionStore(state => state.cancelSubscription)
  const reactivateSubscription = useSubscriptionStore(state => state.reactivateSubscription)
  
  const planDetails = plans[plan] || plans.FREE
  const isPremium = plan !== 'FREE'
  
  // Calculate storage usage
  const limitMB = features.maxStorage
  const usedMB = Math.round(usage.storageUsed / (1024 * 1024))
  const storageUsage = {
    used: usedMB,
    limit: limitMB,
    percentage: Math.min(100, (usedMB / limitMB) * 100),
    isFull: usedMB >= limitMB
  }
  
  // Calculate forms remaining
  const formsRemaining = isPremium ? 'unlimited' : Math.max(0, 3 - usage.formsGenerated)
  
  // Calculate days remaining
  const daysRemaining = currentPeriodEnd 
    ? Math.ceil((new Date(currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24))
    : null
  
  return {
    plan,
    planName: planDetails?.name || 'Free',
    status,
    price: planDetails?.price || 0,
    interval: planDetails?.interval || 'forever',
    currentPeriodEnd,
    cancelAtPeriodEnd,
    daysRemaining,
    benefits: planDetails?.benefits || [],
    isPremium,
    storageUsage,
    formsRemaining,
    isProcessing,
    cancelSubscription,
    reactivateSubscription
  }
}
