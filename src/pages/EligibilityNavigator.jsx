import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, ChevronRight, ChevronLeft, Check, 
  Users, Briefcase, GraduationCap, Calendar,
  Building, Globe, Award, ArrowRight, Brain,
  Zap, Clock, TrendingUp, AlertTriangle, FileText
} from 'lucide-react'
import { 
  useEligibilityStore, 
  useUserStore,
  useGlobalStore 
} from '../utils/enhancedStore'

const EligibilityNavigator = () => {
  const { user } = useUserStore()
  const { 
    currentStep, 
    answers, 
    results,
    setAnswer, 
    nextStep, 
    prevStep, 
    calculateResults,
    reset,
    saveAssessment,
    history
  } = useEligibilityStore()
  const { addNotification } = useGlobalStore()
  
  // Local state for enhanced features
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedPathway, setSelectedPathway] = useState(null)
  
  // Questions with enhanced metadata
  const questions = [
    {
      id: 'relationship',
      title: 'What is your relationship to a U.S. citizen or green card holder?',
      icon: Users,
      category: 'family',
      weight: 35,
      options: [
        { value: 'immediate', label: 'Immediate Relative (Spouse, Parent, Child)', desc: 'No wait times, highest priority', score: 35 },
        { value: 'sibling', label: 'Sibling of U.S. Citizen', desc: 'Longer wait times (12+ years)', score: 15 },
        { value: 'extended', label: 'Extended Family', desc: 'Limited categories, longer processing', score: 5 },
        { value: 'none', label: 'No family relationship', desc: 'Explore employment or other options', score: 0 }
      ]
    },
    {
      id: 'status',
      title: 'What is your current immigration status?',
      icon: Building,
      category: 'status',
      weight: 30,
      options: [
        { value: 'citizen', label: 'U.S. Citizen', desc: 'Applying for naturalization', score: 40 },
        { value: 'green_card', label: 'Green Card Holder', desc: 'Permanent resident seeking citizenship', score: 35 },
        { value: 'h1b', label: 'H-1B Visa Holder', desc: 'Specialty occupation worker', score: 25 },
        { value: 'l1', label: 'L-1 Visa Holder', desc: 'Intracompany transferee', score: 20 },
        { value: 'f1', label: 'F-1 Student Visa', desc: 'Student or OPT holder', score: 10 },
        { value: 'other_visa', label: 'Other Visa Status', desc: 'Tourist, work, or other visa', score: 5 },
        { value: 'undocumented', label: 'No Current Status', desc: 'Need to explore options carefully', score: 0 }
      ]
    },
    {
      id: 'timeInUS',
      title: 'How long have you been continuously present in the U.S.?',
      icon: Calendar,
      category: 'residence',
      weight: 20,
      options: [
        { value: 'less_3', label: 'Less than 3 years', desc: 'May affect naturalization eligibility', score: 10 },
        { value: '3_5', label: '3-5 years', desc: 'May qualify for naturalization', score: 20 },
        { value: '5_plus', label: '5+ years', desc: 'Strong naturalization eligibility', score: 25 }
      ]
    },
    {
      id: 'education',
      title: 'What is your highest level of education?',
      icon: GraduationCap,
      category: 'qualifications',
      weight: 15,
      options: [
        { value: 'high_school', label: 'High School/GED', desc: 'May qualify for some employment categories', score: 5 },
        { value: 'bachelors', label: "Bachelor's Degree", desc: 'Qualifies for H-1B and some EB categories', score: 15 },
        { value: 'masters', label: "Master's Degree", desc: 'Qualifies for advanced EB categories', score: 20 },
        { value: 'phd', label: 'Doctorate (PhD)', desc: 'Strong EB-2/EB-1 qualifications', score: 25 },
        { value: 'professional', label: 'Professional Degree (JD, MD)', desc: 'Specialized expertise', score: 25 }
      ]
    },
    {
      id: 'workExperience',
      title: 'Do you have specialized work experience?',
      icon: Briefcase,
      category: 'employment',
      weight: 20,
      options: [
        { value: 'none', label: 'Entry Level', desc: 'Standard employment categories', score: 5 },
        { value: 'general', label: '3-5 Years Experience', desc: 'General professional experience', score: 10 },
        { value: 'specialized', label: '5+ Years Specialized', desc: 'May qualify for EB-2/EB-1', score: 20 },
        { value: 'extraordinary', label: 'Extraordinary Ability', desc: 'National interest or exceptional ability', score: 30 }
      ]
    },
    {
      id: 'goals',
      title: 'What is your primary immigration goal?',
      icon: Target,
      category: 'objectives',
      weight: 25,
      options: [
        { value: 'citizenship', label: 'U.S. Citizenship', desc: 'Full rights and privileges', score: 30 },
        { value: 'green_card', label: 'Green Card', desc: 'Permanent residence', score: 25 },
        { value: 'work', label: 'Work Authorization', desc: 'Legal employment', score: 15 },
        { value: 'family', label: 'Family Reunification', desc: 'Bring family to U.S.', score: 20 }
      ]
    }
  ]

  const handleOptionSelect = useCallback((questionId, value) => {
    setAnswer(questionId, value)
    
    // Show contextual notification
    const question = questions.find(q => q.id === questionId)
    const option = question?.options.find(o => o.value === value)
    
    if (option) {
      addNotification({
        type: 'info',
        title: 'Response Recorded',
        message: `${question.title.split('?')[0]}? - ${option.label}`
      })
    }
    
    // Auto-advance with slight delay for smooth UX
    setTimeout(() => {
      nextStep()
    }, 400)
  }, [setAnswer, nextStep, addNotification, questions])

  const handleCalculate = useCallback(async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    // Simulate AI analysis with progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 15
      })
    }, 200)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Calculate results
    const result = calculateResults()
    
    clearInterval(progressInterval)
    setAnalysisProgress(100)
    
    setTimeout(() => {
      setIsAnalyzing(false)
      addNotification({
        type: 'success',
        title: 'Assessment Complete',
        message: `Your eligibility analysis is ready with ${result.pathways.length} recommended pathways.`
      })
    }, 500)
  }, [calculateResults, addNotification])

  const handleReset = useCallback(() => {
    reset()
    addNotification({
      type: 'info',
      title: 'Assessment Reset',
      message: 'You can start a new eligibility assessment.'
    })
  }, [reset, addNotification])

  const handleSaveAssessment = useCallback(() => {
    const name = `Assessment ${new Date().toLocaleDateString()}`
    saveAssessment(name)
    addNotification({
      type: 'success',
      title: 'Assessment Saved',
      message: 'Your assessment has been saved for future reference.'
    })
  }, [saveAssessment, addNotification])

  const getProgress = () => {
    const answeredCount = Object.keys(answers).length
    return Math.round((answeredCount / questions.length) * 100)
  }

  const getTotalScore = () => {
    let total = 0
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = questions.find(q => q.id === questionId)
      const option = question?.options.find(o => o.value === answerValue)
      if (option) {
        total += option.score
      }
    })
    return Math.min(total, 100)
  }

  return (
    <div className="eligibility-navigator">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Intelligent Eligibility Navigator
        </motion.h1>
        <p>Let AEGIS analyze your situation and recommend the best immigration pathway for you using our advanced decision engine.</p>
      </div>

      {/* AI Analysis Status */}
      {isAnalyzing && (
        <motion.div 
          className="glass"
          style={{ 
            padding: 'var(--spacing-xl)',
            marginBottom: 'var(--spacing-xl)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>AEGIS AI Analyzing Your Profile</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Processing {Object.keys(answers).length} data points across {questions.length} categories
              </div>
            </div>
            <div style={{ 
              width: '120px', 
              height: '6px', 
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <motion.div 
                style={{ 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                  borderRadius: 'var(--radius-full)'
                }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-xl)',
            flexWrap: 'wrap'
          }}>
            {[
              { label: 'Family Analysis', status: 'complete' },
              { label: 'Status Assessment', status: 'complete' },
              { label: 'Qualification Scoring', status: 'processing' },
              { label: 'Pathway Matching', status: 'pending' }
            ].map((item, index) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: item.status === 'complete' ? 'var(--color-success)' : 
                             item.status === 'processing' ? 'var(--color-secondary)' : 'var(--text-muted)'
                }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Steps */}
      {!results.length && !isAnalyzing && (
        <div className="eligibility-wizard" style={{ marginBottom: 'var(--spacing-xl)' }}>
          {/* Overall Progress Bar */}
          <div style={{ 
            marginBottom: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Assessment Progress</span>
              <span style={{ fontWeight: '600' }}>{getProgress()}%</span>
            </div>
            <div style={{ 
              height: '8px', 
              background: 'var(--bg-dark)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: 'var(--spacing-md)'
            }}>
              <motion.div 
                style={{ 
                  height: '100%', 
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)'
                }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Current Score: {getTotalScore()}/100</span>
              <span>Answered: {Object.keys(answers).length}/{questions.length}</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="wizard-progress" style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            {questions.map((q, index) => (
              <motion.div 
                key={q.id}
                className={`wizard-step ${index === currentStep ? 'active' : ''} ${answers[q.id] ? 'completed' : ''}`}
                onClick={() => {
                  if (answers[q.id] || index <= currentStep + 1) {
                    // Navigate to step
                    for (let i = 0; i < index; i++) {
                      if (!answers[questions[i].id]) {
                        addNotification({
                          type: 'warning',
                          title: 'Complete Required',
                          message: `Please answer all previous questions first.`
                        })
                        return
                      }
                    }
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  background: answers[q.id] ? 'rgba(16, 185, 129, 0.1)' : 
                             index === currentStep ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-glass)',
                  border: `1px solid ${answers[q.id] ? 'rgba(16, 185, 129, 0.3)' : 
                           index === currentStep ? 'rgba(59, 130, 246, 0.3)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius-full)',
                  cursor: answers[q.id] || index <= currentStep ? 'pointer' : 'not-allowed',
                  opacity: index > currentStep + 1 && !answers[q.id] ? 0.5 : 1
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: answers[q.id] ? 'var(--color-success)' : 
                             index === currentStep ? 'var(--color-secondary)' : 'var(--bg-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {answers[q.id] ? <Check size={14} /> : index + 1}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'none' }} className="step-label">
                  Step {index + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!results.length && !isAnalyzing ? (
          <motion.div
            key={currentStep}
            className="glass question-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ padding: 'var(--spacing-xl)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: 'var(--radius-lg)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {React.createElement(questions[currentStep].icon, { size: 32, color: 'white' })}
              </div>
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-sm)',
                  marginBottom: 'var(--spacing-xs)' 
                }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--color-secondary)',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Category {currentStep + 1}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>|</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Weight: {questions[currentStep].weight} pts
                  </span>
                </div>
                <h3>{questions[currentStep].title}</h3>
              </div>
            </div>

            <div className="option-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-md)'
            }}>
              {questions[currentStep].options.map((option, index) => (
                <motion.button
                  key={option.value}
                  className={`option-button ${answers[questions[currentStep].id] === option.value ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(questions[currentStep].id, option.value)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    textAlign: 'left',
                    padding: 'var(--spacing-lg)',
                    background: answers[questions[currentStep].id] === option.value 
                      ? 'rgba(59, 130, 246, 0.15)' 
                      : 'var(--bg-glass)',
                    border: `2px solid ${answers[questions[currentStep].id] === option.value 
                      ? 'var(--color-secondary)' 
                      : 'var(--glass-border)'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                    <h4 style={{ margin: 0 }}>{option.label}</h4>
                    <span style={{
                      padding: '2px 8px',
                      background: `rgba(59, 130, 246, 0.1)`,
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--color-secondary)',
                      fontWeight: '600'
                    }}>
                      +{option.score}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{option.desc}</p>
                </motion.button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-xl)' }}>
              <button 
                className="glass-button"
                onClick={prevStep}
                disabled={currentStep === 0}
                style={{ 
                  opacity: currentStep === 0 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                {currentStep === questions.length - 1 ? (
                  <motion.button 
                    className="glass-button primary"
                    onClick={handleCalculate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      fontSize: '1rem', 
                      padding: 'var(--spacing-md) var(--spacing-xl)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}
                  >
                    <Brain size={20} />
                    Analyze My Profile
                    <Zap size={18} />
                  </motion.button>
                ) : (
                  <button 
                    className="glass-button"
                    onClick={nextStep}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            className="glass"
            style={{ 
              padding: 'var(--spacing-3xl)',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto var(--spacing-xl)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Brain size={40} color="white" />
            </motion.div>
            <h2>Analyzing Your Immigration Profile</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              Our AI is evaluating your responses across {questions.length} categories to identify the best immigration pathways.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="glass"
            style={{ padding: 'var(--spacing-2xl)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Result Header */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: 'var(--spacing-2xl)',
              padding: 'var(--spacing-xl)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
              }}>
                <Award size={50} color="white" />
              </div>
              <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Your Recommended Pathway</h2>
              <p style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                {results[0]?.pathways?.[0]?.name || 'Based on your profile'}
              </p>
              <p style={{ color: 'var(--color-secondary)', marginTop: 'var(--spacing-xs)' }}>
                {results[0]?.pathways?.[0]?.category || 'Naturalization'}
              </p>
            </div>

            {/* Eligibility Score */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
              <motion.div 
                className="glass" 
                style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}
                whileHover={{ y: -4 }}
              >
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                  Overall Score
                </div>
                <div style={{ 
                  fontSize: '3.5rem', 
                  fontWeight: '700',
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}>
                  {results[0]?.overallScore || getTotalScore()}%
                </div>
                <div style={{ 
                  marginTop: 'var(--spacing-md)',
                  height: '8px',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${results[0]?.overallScore || getTotalScore()}%`,
                    background: (results[0]?.overallScore || getTotalScore()) >= 80 
                      ? 'var(--color-success)' 
                      : (results[0]?.overallScore || getTotalScore()) >= 60 
                        ? 'var(--color-warning)' 
                        : 'var(--color-danger)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </motion.div>

              <motion.div 
                className="glass" 
                style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}
                whileHover={{ y: -4 }}
              >
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                  Estimated Timeline
                </div>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  lineHeight: 1
                }}>
                  {results[0]?.pathways?.[0]?.timeframe || '6-12 months'}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-sm)' }}>
                  Based on current processing times
                </p>
              </motion.div>

              <motion.div 
                className="glass" 
                style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}
                whileHover={{ y: -4 }}
              >
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                  Priority Level
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  color: (results[0]?.pathways?.[0]?.priority || 'high') === 'high' 
                    ? 'var(--color-success)' 
                    : 'var(--color-warning)',
                  textTransform: 'uppercase',
                  lineHeight: 1
                }}>
                  {(results[0]?.pathways?.[0]?.priority || 'high').toUpperCase()}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-sm)' }}>
                  Visa category priority
                </p>
              </motion.div>
            </div>

            {/* All Pathways */}
            {results[0]?.pathways && results[0].pathways.length > 1 && (
              <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Alternative Pathways</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {results[0].pathways.slice(1).map((pathway, index) => (
                    <motion.div
                      key={pathway.id}
                      className="glass"
                      style={{ 
                        padding: 'var(--spacing-lg)',
                        border: selectedPathway === pathway.id ? '2px solid var(--color-secondary)' : '1px solid var(--glass-border)',
                        cursor: 'pointer'
                      }}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedPathway(pathway.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{pathway.name}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{pathway.category}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', color: 'var(--color-secondary)' }}>{pathway.score}%</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{pathway.timeframe}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements & Documents */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-2xl)' }}>
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Check size={20} style={{ color: 'var(--color-success)' }} />
                  Requirements
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {(results[0]?.pathways?.[0]?.requirements || [
                    '5 years as LPR',
                    'Physical presence in U.S.',
                    'Good moral character',
                    'English & Civics test'
                  ]).map((req, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <Check size={16} style={{ color: 'var(--color-success)' }} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <FileText size={20} style={{ color: 'var(--color-secondary)' }} />
                  Required Documents
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {(results[0]?.pathways?.[0]?.documents || [
                    'Birth Certificate',
                    'Passport',
                    'Marriage Certificate',
                    'Tax Returns',
                    'Employment Letters'
                  ]).map((doc, index) => (
                    <li key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>{index + 1}</span>
                      </div>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            <div style={{ 
              padding: 'var(--spacing-xl)',
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--glass-border)',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Recommended Next Steps</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {[
                  { title: 'Schedule a Consultation', desc: 'Connect with a specialist for personalized guidance', icon: Calendar, color: '#3B82F6' },
                  { title: 'Start Document Collection', desc: 'Gather all required documents for your application', icon: Briefcase, color: '#8B5CF6' },
                  { title: 'Begin Form Preparation', desc: 'Let AEGIS help you fill out the necessary forms', icon: Target, color: '#14B8A6' }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)',
                      background: 'var(--bg-dark)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div style={{ 
                      width: '48px', 
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: `${step.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <step.icon size={24} color={step.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>{step.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{step.desc}</div>
                    </div>
                    <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <motion.button 
                className="glass-button primary" 
                style={{ 
                  flex: 1, 
                  padding: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-sm)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar size={20} />
                Schedule Consultation
              </motion.button>
              <button 
                className="glass-button"
                onClick={handleSaveAssessment}
                style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}
              >
                Save Assessment
              </button>
              <button 
                className="glass-button"
                onClick={handleReset}
                style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}
              >
                Retake Assessment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EligibilityNavigator
