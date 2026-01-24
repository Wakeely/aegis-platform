import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, MapPin, Clock, AlertTriangle, CheckCircle,
  ChevronRight, ArrowRight, Sparkles, Target, Shield,
  FileText, Users, Calendar, TrendingUp, Lightbulb,
  MessageSquare, HelpCircle, Building, DollarSign,
  Star, Phone, Mail, Flag, Briefcase, Plane,
  Heart, Home, User, CreditCard, FileCheck
} from 'lucide-react'
import {
  useEligibilityStore,
  useGlobalStore
} from '../utils/enhancedStore'

// Immigration path configurations with detailed guidance
const immigrationPaths = {
  'k1_fiance': {
    id: 'k1_fiance',
    name: 'K-1 Fiancé Visa',
    shortName: 'K-1',
    category: 'family',
    description: 'For engaged couples where the US citizen sponsor lives in the US',
    timeline: '6-9 months',
    timelineDetailed: 'Typically 4-6 months for visa approval, then 90 days to marry in US',
    cost: '$2,500-$4,000',
    successRate: '~73%',
    pros: [
      'Faster path to entering US (4-6 months)',
      'Can work immediately after arrival with EAD',
      'Stay together in US while adjusting status'
    ],
    cons: [
      'Must marry within 90 days of entry',
      'Cannot work or leave US before marriage',
      'Longer overall process (2-3 years to green card)',
      'Cannot file I-485 at port of entry'
    ],
    requirements: [
      'Proof of genuine relationship',
      'Met in person within 2 years',
      'US citizen sponsor with income 125% above poverty level',
      'No criminal history that would bar entry'
    ],
    risks: [
      'If marriage doesn\'t happen in 90 days, must leave US',
      'Green card process takes 2-3 years (conditional)',
      'Cannot travel internationally during adjustment'
    ],
    recommendedFor: ['Couples who want to marry in the US', 'Those who can afford time without working initially'],
    notRecommendedFor: ['Couples who already married', 'Those who need to work immediately', 'Couples with complex legal histories']
  },
  'cr1_spouse': {
    id: 'cr1_spouse',
    name: 'CR-1 Spouse Visa',
    shortName: 'CR-1',
    category: 'family',
    description: 'For legally married couples where spouse is US citizen or green card holder',
    timeline: '12-18 months',
    timelineDetailed: '6-8 months for petition approval, 3-4 months for visa processing',
    cost: '$1,500-$3,000',
    successRate: '~98%',
    pros: [
      'Immediate permanent residence upon entry',
      'Work authorization included',
      'Lower overall cost than K-1 path',
      'No 90-day marriage deadline'
    ],
    cons: [
      'Longer separation (12-18 months)',
      'Cannot visit US while petition pending (with some exceptions)',
      'More documents required to prove marriage'
    ],
    requirements: [
      'Valid marriage certificate',
      'Proof of relationship (photos, communication, shared finances)',
      'US citizen spouse income requirement',
      'Police certificates from all countries of residence'
    ],
    risks: [
      'Long separation period',
      'Interview at US embassy in home country',
      'Must establish domicile in US after entry'
    ],
    recommendedFor: ['Couples okay with separation', 'Those with complex cases needing more preparation', 'Budget-conscious couples'],
    notRecommendedFor: ['Those who need to be together urgently', 'Couples with pending K-1 petitions']
  },
  'i130_i485_concurrent': {
    id: 'i130_i485_concurrent',
    name: 'I-130 + I-485 Concurrent Filing',
    shortName: 'Concurrent Filing',
    category: 'family',
    description: 'For immediate relatives of US citizens already in the US legally',
    timeline: '8-14 months',
    timelineDetailed: 'Same time filing for family petition and adjustment of status',
    cost: '$1,700-$2,500',
    successRate: '~89%',
    pros: [
      'Can work while waiting (with EAD)',
      'Can travel with AP while waiting',
      'No need to leave the US',
      'Allows early filing of some benefits'
    ],
    cons: [
      'Cannot travel outside US without Advance Parole',
      'Longer processing time than consular processing',
      'Must maintain continuous residence'
    ],
    requirements: [
      'Legal entry to US (visa, ESTA, etc.)',
      'Valid marriage certificate (if applicable)',
      'Medical examination',
      'Biometrics appointment'
    ],
    risks: [
      'Leaving US without AP = abandonment of application',
      'Accidental trip can restart entire process',
      'Some visa categories have bars to adjustment'
    ],
    recommendedFor: ['Those already in US on valid visa', 'Immediate relatives of US citizens', 'Those who can\'t afford long separation'],
    notRecommendedFor: ['Those on tourist visas (may be problematic)', 'Those who entered without inspection']
  },
  'h1b_adjustment': {
    id: 'h1b_adjustment',
    name: 'H-1B to Green Card',
    shortName: 'EB-2/EB-3',
    category: 'employment',
    description: 'Employment-based adjustment for H-1B and other work visa holders',
    timeline: '18-36 months',
    timelineDetailed: 'PERM (6-12 months) + I-140 (4-6 months) + I-485 (12-24 months)',
    cost: '$5,000-$15,000+',
    successRate: '~85%',
    pros: [
      'Can change employers (with caveats)',
      'Portability under AC21',
      'Premium processing available at some stages',
      'Path to citizenship for skilled workers'
    ],
    cons: [
      'Employer-sponsored (job dependency)',
      'Long overall timeline',
      'PERM labor certification can be denied',
      'Priority date backlogs for some countries'
    ],
    requirements: [
      'Bachelor\'s degree or equivalent experience',
      'Employer willing to sponsor',
      'PERM labor certification',
      'Permanent job offer'
    ],
    risks: [
      'Job loss = loss of status',
      'Country-specific backlogs (India/China 10+ years)',
      'Employer can withdraw petition',
      'Changing jobs can restart priority date'
    ],
    recommendedFor: ['Skilled workers with employer sponsorship', 'Those in stable jobs', 'STEM professionals'],
    notRecommendedFor: ['Job hoppers', 'Those in unstable industries', 'Indian/Chinese nationals (long backlogs)']
  },
  'n400_naturalization': {
    id: 'n400_naturalization',
    name: 'N-400 Naturalization',
    shortName: 'Citizenship',
    category: 'citizenship',
    description: 'Application for US citizenship for green card holders',
    timeline: '6-12 months',
    timelineDetailed: '3-5 months for interview, 1-2 months for oath ceremony after approval',
    cost: '$725-$1,400',
    successRate: '~90%',
    pros: [
      'Full US citizenship rights',
      'Can sponsor more family members',
      'No more green card renewals',
      'Can travel freely'
    ],
    cons: [
      'Must meet 3/5 year residency requirement',
      'English and civics test required',
      'Tax compliance required',
      'Can lose citizenship under rare circumstances'
    ],
    requirements: [
      'Green card for 3-5 years (or 3 if married to USC)',
      'Continuous residence in US',
      'Physical presence in US (30 months / 18 months)',
      'Good moral character'
    ],
    risks: [
      'Extended travel abroad (>6 months) can break continuous residence',
      'Criminal history can delay or deny',
      'Failing English/civics test (can retake)',
      'Tax compliance issues'
    ],
    recommendedFor: ['Green card holders ready for citizenship', 'Those wanting to sponsor family faster', 'Those tired of immigration bureaucracy'],
    notRecommendedFor: ['Those who travel extensively for work', 'Those with complex criminal histories', 'Those planning extended abroad stays']
  },
  'ead_ap': {
    id: 'ead_ap',
    name: 'EAD + Advance Parole',
    shortName: 'Work/Travel Card',
    category: 'work',
    description: 'Employment Authorization Document and Advance Parole for pending applications',
    timeline: '2-5 months',
    timelineDetailed: 'Processing time varies by service center, premium processing not available',
    cost: '$500-$1,000',
    successRate: '~95%',
    pros: [
      'Can work legally in US',
      'Can travel internationally and return',
      'Essential for those on dependent visas',
      'Can be filed concurrently with I-485'
    ],
    cons: [
      'Not a green card (needs renewal)',
      'Processing delays possible',
      'Travel restrictions still apply',
      'Must be renewed every 1-2 years'
    ],
    requirements: [
      'Pending I-485 or qualifying category',
      'Biometrics completed',
      'Valid passport',
      'Filing fee or fee waiver'
    ],
    risks: [
      'Travel to certain countries can be flagged',
      'Leaving US during pending AP = abandonment',
      'AP does not guarantee entry back to US',
      'Changing status can invalidate EAD'
    ],
    recommendedFor: ['I-485 applicants', 'Dependent visa holders', 'Those needing to work/travel'],
    notRecommendedFor: ['Those from countries with travel advisories', 'Those planning to visit high-risk countries']
  }
}

const ImmigrationGPS = () => {
  const { answers, calculateResults, results } = useEligibilityStore()
  const { addNotification } = useGlobalStore()

  const [activeTab, setActiveTab] = useState('advisor')
  const [userSituation, setUserSituation] = useState({
    status: '',
    relationship: '',
    timeInUS: '',
    goals: '',
    concerns: ''
  })
  const [advisorResponse, setAdvisorResponse] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [selectedPath, setSelectedPath] = useState(null)
  const [showComparison, setShowComparison] = useState(false)

  // Assessment questions
  const questions = {
    status: {
      label: 'What is your current immigration status in the US?',
      options: [
        { value: 'citizen', label: 'US Citizen', icon: Flag },
        { value: 'green_card', label: 'Green Card Holder', icon: CreditCard },
        { value: 'h1b', label: 'H-1B Visa', icon: Briefcase },
        { value: 'l1', label: 'L-1 Visa', icon: Building },
        { value: 'f1', label: 'F-1 Student Visa', icon: FileText },
        { value: 'tourist', label: 'Tourist Visa / ESTA', icon: Plane },
        { value: 'none', label: 'No Status / Undocumented', icon: AlertTriangle }
      ]
    },
    relationship: {
      label: 'What is your relationship situation?',
      options: [
        { value: 'married_usc', label: 'Married to US Citizen', icon: Heart },
        { value: 'married_lpr', label: 'Married to Green Card Holder', icon: Heart },
        { value: 'engaged', label: 'Engaged to US Citizen', icon: Heart },
        { value: 'relationship', label: 'In Relationship (not married/engaged)', icon: Users },
        { value: 'none', label: 'No US-based relationship', icon: User }
      ]
    },
    timeInUS: {
      label: 'How long have you been in the United States?',
      options: [
        { value: 'less_1', label: 'Less than 1 year', icon: Clock },
        { value: '1_3', label: '1-3 years', icon: Clock },
        { value: '3_5', label: '3-5 years', icon: Calendar },
        { value: '5_plus', label: '5+ years', icon: Calendar },
        { value: 'born', label: 'Born in the US', icon: Home }
      ]
    },
    goals: {
      label: 'What is your primary immigration goal?',
      options: [
        { value: 'citizenship', label: 'Become US Citizen', icon: Flag },
        { value: 'green_card', label: 'Get Green Card', icon: CreditCard },
        { value: 'work', label: 'Work Authorization', icon: Briefcase },
        { value: 'family', label: 'Bring Family to US', icon: Users },
        { value: 'stay', label: 'Stay Legally', icon: Home }
      ]
    }
  }

  // Get icon component helper - now handles direct component references
  const getIconComponent = (iconComponent) => {
    if (!iconComponent) return <HelpCircle size={20} />
    const Icon = iconComponent
    return <Icon size={20} />
  }

  // AI Advisor Logic
  const generateAdvisorResponse = useCallback(() => {
    setIsThinking(true)

    setTimeout(() => {
      const response = analyzeSituation(userSituation)
      setAdvisorResponse(response)
      setIsThinking(false)

      addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: 'Your personalized immigration strategy has been generated.'
      })
    }, 2000)
  }, [userSituation, addNotification])

  const analyzeSituation = (situation) => {
    const recommendations = []
    const warnings = []
    const timeline = []
    const cost = []
    const nextSteps = []

    // Analyze based on current status
    if (situation.status === 'citizen') {
      if (situation.goals === 'citizenship') {
        recommendations.push({
          path: 'n400_naturalization',
          match: 95,
          reason: 'You\'re already a US citizen - ready for N-400!',
          urgency: 'high'
        })
        nextSteps.push('File Form N-400 immediately', 'Schedule biometrics', 'Prepare for English/Civics test')
      }
    } else if (situation.status === 'green_card') {
      if (situation.timeInUS === '5_plus' || situation.timeInUS === 'born') {
        recommendations.push({
          path: 'n400_naturalization',
          match: 90,
          reason: 'You\'ve had your green card long enough for citizenship',
          urgency: 'high'
        })
        nextSteps.push('Check continuous residence requirements', 'Gather 3 years of tax returns', 'Schedule N-400 consultation')
      } else {
        recommendations.push({
          path: 'n400_naturalization',
          match: 70,
          reason: 'Citizenship is your eventual goal, but check your 3/5 year requirement',
          urgency: 'medium'
        })
        nextSteps.push('Track your physical presence (18 months minimum needed)', 'Start studying English and civics', 'Consult about any travel concerns')
      }
    } else if (['h1b', 'l1', 'f1'].includes(situation.status)) {
      if (situation.relationship?.includes('married') && situation.relationship?.includes('citizen')) {
        recommendations.push({
          path: 'i130_i485_concurrent',
          match: 85,
          reason: 'As a married couple with a US citizen, you have direct path to green card',
          urgency: 'high'
        })
        nextSteps.push('File I-130 and I-485 concurrently', 'Apply for EAD (if needed)', 'Prepare for interview')
        timeline.push('8-14 months to green card approval')
        cost.push('$1,700-$2,500 total')
      } else if (situation.status === 'h1b') {
        recommendations.push({
          path: 'h1b_adjustment',
          match: 75,
          reason: 'Your H-1B status provides a foundation for employment-based green card',
          urgency: 'medium'
        })
        nextSteps.push('Discuss PERM with employer', 'Check if you qualify for EB-2 (advanced degree)', 'Consider premium processing')
        timeline.push('18-36 months to green card (depends on priority date)')
        cost.push('$5,000-$15,000+ (employer typically pays)')
      } else {
        recommendations.push({
          path: 'ead_ap',
          match: 60,
          reason: 'Consider your options for work authorization and staying legally',
          urgency: 'medium'
        })
        nextSteps.push('Explore adjustment of status options', 'Check if marriage or employment could help', 'Consult about visa extensions')
      }
    } else if (situation.relationship === 'engaged') {
      recommendations.push({
        path: 'k1_fiance',
        match: 88,
        reason: 'As an engaged couple, K-1 is the fastest path to be together in the US',
        urgency: 'high'
      })
      nextSteps.push('File I-129F immediately (takes 3-5 months)', 'Plan wedding details', 'Budget $2,500-$4,000')
      timeline.push('6-9 months to visa approval')
      cost.push('$2,500-$4,000')
      warnings.push('You must marry within 90 days of entering the US')
    } else if (situation.relationship === 'married_usc') {
      if (situation.status === 'tourist' || situation.status === 'none') {
        warnings.push('Important: Entering on tourist visa then marrying can raise red flags. Consult an attorney.')
        recommendations.push({
          path: 'cr1_spouse',
          match: 82,
          reason: 'CR-1 spouse visa is safer if you\'re outside the US',
          urgency: 'high'
        })
        nextSteps.push('Consider consular processing outside US', 'Gather relationship evidence', 'File I-130')
        timeline.push('12-18 months total process')
      } else {
        recommendations.push({
          path: 'i130_i485_concurrent',
          match: 90,
          reason: 'Married to US citizen - you\'re an immediate relative!',
          urgency: 'high'
        })
        nextSteps.push('File I-130 + I-485 together', 'Get medical exam', 'Apply for work permit')
        timeline.push('8-14 months typically')
        cost.push('$1,700-$2,500')
      }
    } else if (situation.status === 'tourist') {
      warnings.push('Tourist visa status has limitations. You cannot work or file most applications.')
      if (situation.relationship === 'none') {
        recommendations.push({
          path: 'tourist_extension',
          match: 50,
          reason: 'You may need to extend your stay or change status',
          urgency: 'medium'
        })
        nextSteps.push('Consider I-539 extension application', 'Consult about adjustment options', 'Plan departure before visa expires')
      }
    }

    // Add general advice
    if (!recommendations.length) {
      recommendations.push({
        path: 'consultation',
        match: 100,
        reason: 'Your situation needs personalized assessment',
        urgency: 'high'
      })
      nextSteps.push('Schedule a free consultation with an immigration attorney', 'Gather all your documents', 'Write down your complete immigration history')
    }

    return {
      recommendations,
      warnings,
      timeline,
      cost,
      nextSteps,
      summary: generateSummary(recommendations, situation)
    }
  }

  const generateSummary = (recommendations, situation) => {
    if (recommendations.length === 0) return 'Please provide more information about your situation.'

    const topRec = recommendations[0]
    const path = immigrationPaths[topRec.path]

    if (topRec.path === 'consultation') {
      return 'Based on your unique situation, we recommend speaking with an immigration attorney who can provide personalized guidance for your case.'
    }

    return `${path.name} is your recommended path with ${topRec.match}% match to your goals. ${path.timelineDetailed}. Total cost typically ${path.cost}.`
  }

  const selectRecommendation = (pathId) => {
    const path = immigrationPaths[pathId]
    if (path) {
      setSelectedPath(path)
      setShowComparison(true)
    }
  }

  const comparePaths = () => {
    const recs = advisorResponse?.recommendations || []
    const paths = recs
      .filter(r => immigrationPaths[r.path])
      .map(r => ({ ...immigrationPaths[r.path], match: r.match }))
    return paths
  }

  return (
    <div className="immigration-gps">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}
        >
          <Brain size={32} style={{ color: 'var(--color-secondary)' }} />
          Immigration GPS
        </motion.h1>
        <p>Your AI-powered immigration strategy advisor. Get personalized guidance on your immigration journey.</p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-xl)',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'advisor', label: 'AI Strategy Advisor', icon: Brain },
          { id: 'paths', label: 'Immigration Paths', icon: MapPin },
          { id: 'timeline', label: 'Timeline Explorer', icon: Clock },
          { id: 'costs', label: 'Cost Calculator', icon: DollarSign }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`glass-button ${activeTab === tab.id ? 'primary' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ padding: 'var(--spacing-sm) var(--spacing-lg)' }}
          >
            <tab.icon size={16} style={{ marginRight: '8px' }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Strategy Advisor Tab */}
      {activeTab === 'advisor' && (
        <div style={{ display: 'grid', gridTemplateColumns: advisorResponse ? '1fr 1fr' : '1fr', gap: 'var(--spacing-xl)' }}>
          {/* Assessment Form */}
          <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <MessageSquare size={20} style={{ color: 'var(--color-secondary)' }} />
              Tell us about your situation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {/* Status */}
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                  {questions.status.label}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-sm)' }}>
                  {questions.status.options.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button ${userSituation.status === option.value ? 'primary' : ''}`}
                      onClick={() => setUserSituation(prev => ({ ...prev, status: option.value }))}
                      style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        {getIconComponent(option.icon)}
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                  {questions.relationship.label}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {questions.relationship.options.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button ${userSituation.relationship === option.value ? 'primary' : ''}`}
                      onClick={() => setUserSituation(prev => ({ ...prev, relationship: option.value }))}
                      style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        {getIconComponent(option.icon)}
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time in US */}
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                  {questions.timeInUS.label}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {questions.timeInUS.options.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button ${userSituation.timeInUS === option.value ? 'primary' : ''}`}
                      onClick={() => setUserSituation(prev => ({ ...prev, timeInUS: option.value }))}
                      style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        {getIconComponent(option.icon)}
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                  {questions.goals.label}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-sm)' }}>
                  {questions.goals.options.map((option) => (
                    <button
                      key={option.value}
                      className={`glass-button ${userSituation.goals === option.value ? 'primary' : ''}`}
                      onClick={() => setUserSituation(prev => ({ ...prev, goals: option.value }))}
                      style={{ padding: 'var(--spacing-md)', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        {getIconComponent(option.icon)}
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Get Recommendations Button */}
              <motion.button
                className="glass-button primary"
                onClick={generateAdvisorResponse}
                disabled={isThinking || !userSituation.status || !userSituation.goals}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: 'var(--spacing-lg)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginTop: 'var(--spacing-md)'
                }}
              >
                {isThinking ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block' }}
                    >
                      <Clock size={20} />
                    </motion.div>
                    Analyzing your situation...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Get Personalized Recommendations
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* AI Response */}
          <AnimatePresence>
            {advisorResponse && (
              <motion.div
                className="glass"
                style={{ padding: 'var(--spacing-xl)' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-xl)',
                  paddingBottom: 'var(--spacing-lg)',
                  borderBottom: '1px solid var(--glass-border)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-secondary), #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Brain size={24} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Your Immigration Strategy</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      AI-generated recommendations based on your situation
                    </p>
                  </div>
                </div>

                {/* Warnings */}
                {advisorResponse.warnings.length > 0 && (
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      <AlertTriangle size={18} style={{ color: 'var(--color-danger)' }} />
                      <span style={{ fontWeight: '600', color: 'var(--color-danger)' }}>Important Warnings</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                      {advisorResponse.warnings.map((warning, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
                    Recommended Paths
                  </h4>
                  {advisorResponse.recommendations.map((rec, index) => {
                    const path = immigrationPaths[rec.path]
                    if (!path) return null

                    return (
                      <motion.div
                        key={rec.path}
                        style={{
                          padding: 'var(--spacing-lg)',
                          background: rec.urgency === 'high' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-glass)',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${rec.urgency === 'high' ? 'var(--color-secondary)' : 'var(--glass-border)'}`,
                          cursor: 'pointer'
                        }}
                        whileHover={{ x: 4 }}
                        onClick={() => selectRecommendation(rec.path)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                              <h5 style={{ margin: 0 }}>{path.name}</h5>
                              {rec.urgency === 'high' && (
                                <span style={{
                                  padding: '2px 6px',
                                  background: 'var(--color-secondary)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.65rem',
                                  color: 'white',
                                  fontWeight: '600'
                                }}>
                                  HIGH PRIORITY
                                </span>
                              )}
                            </div>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {path.description}
                            </p>
                          </div>
                          <div style={{
                            padding: '4px 8px',
                            background: rec.match >= 85 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            color: rec.match >= 85 ? 'var(--color-success)' : 'var(--color-warning)',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                          }}>
                            {rec.match}% match
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-sm)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <Clock size={12} /> {path.timeline}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <DollarSign size={12} /> {path.cost}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <TrendingUp size={12} /> {path.successRate} success
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Next Steps */}
                <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--glass-border)' }}>
                  <h4 style={{ margin: '0 0 var(--spacing-md) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Lightbulb size={18} style={{ color: 'var(--color-warning)' }} />
                    Your Next Steps
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {advisorResponse.nextSteps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <ChevronRight size={16} style={{ color: 'var(--color-secondary)' }} />
                        <span style={{ fontSize: '0.875rem' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Immigration Paths Tab */}
      {activeTab === 'paths' && (
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Immigration Pathways Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {Object.values(immigrationPaths).map((path, index) => (
              <motion.div
                key={path.id}
                style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{path.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {path.category}
                    </span>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-success)',
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}>
                    {path.successRate}
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  {path.description}
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} /> {path.timeline}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <DollarSign size={12} /> {path.cost}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-success)' }}>✓ {path.pros[0]}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-danger)' }}>⚠ {path.cons[0]}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Explorer Tab */}
      {activeTab === 'timeline' && (
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Immigration Timelines Comparison</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {Object.values(immigrationPaths).map((path, index) => (
              <motion.div
                key={path.id}
                style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <h4 style={{ margin: 0 }}>{path.name}</h4>
                  <span style={{
                    padding: '4px 8px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {path.timeline}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  {path.timelineDetailed}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Calculator Tab */}
      {activeTab === 'costs' && (
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Cost Comparison by Immigration Path</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {Object.values(immigrationPaths).map((path, index) => (
              <motion.div
                key={path.id}
                style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0' }}>{path.name}</h4>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--color-secondary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  {path.cost}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {path.timeline}
                </p>
              </motion.div>
            ))}
          </div>

          <div style={{
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ margin: '0 0 var(--spacing-md) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Lightbulb size={18} style={{ color: 'var(--color-warning)' }} />
              Cost-Saving Tips
            </h4>
            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
              <li>Fee waivers are available for those who qualify based on income</li>
              <li>Some employers cover H-1B and green card filing costs</li>
              <li>DIY preparation can save $2,000-5,000 but increases risk</li>
              <li>Premium processing ($2,500) can speed up certain applications by months</li>
              <li>Attorney consultations often offer free 30-minute initial meetings</li>
            </ul>
          </div>
        </div>
      )}

      {/* Path Detail Modal */}
      <AnimatePresence>
        {showComparison && selectedPath && (
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
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              className="glass"
              style={{
                width: '100%',
                maxWidth: '700px',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: 'var(--spacing-xl)'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedPath.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', margin: 'var(--spacing-xs) 0 0 0' }}>
                    {selectedPath.description}
                  </p>
                </div>
                <button
                  className="glass-button"
                  onClick={() => setShowComparison(false)}
                  style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                >
                  ×
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{selectedPath.timeline}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timeline</div>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-success)' }}>{selectedPath.cost}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Cost</div>
                </div>
                <div style={{ padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-success)' }}>{selectedPath.successRate}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Success Rate</div>
                </div>
              </div>

              {/* Pros */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <CheckCircle size={16} /> Advantages
                </h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                  {selectedPath.pros.map((pro, i) => <li key={i} style={{ marginBottom: '4px' }}>{pro}</li>)}
                </ul>
              </div>

              {/* Cons */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <AlertTriangle size={16} /> Disadvantages
                </h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                  {selectedPath.cons.map((con, i) => <li key={i} style={{ marginBottom: '4px' }}>{con}</li>)}
                </ul>
              </div>

              {/* Requirements */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <FileText size={16} /> Requirements
                </h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                  {selectedPath.requirements.map((req, i) => <li key={i} style={{ marginBottom: '4px' }}>{req}</li>)}
                </ul>
              </div>

              {/* Risks */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <AlertTriangle size={16} /> Potential Risks
                </h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                  {selectedPath.risks.map((risk, i) => <li key={i} style={{ marginBottom: '4px' }}>{risk}</li>)}
                </ul>
              </div>

              <button
                className="glass-button primary"
                onClick={() => setShowComparison(false)}
                style={{ width: '100%', padding: 'var(--spacing-md)' }}
              >
                Close Details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImmigrationGPS
