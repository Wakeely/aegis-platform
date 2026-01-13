import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, TrendingUp, AlertTriangle, CheckCircle, 
  Clock, Target, Zap, Eye, RefreshCw, Info, Search,
  FileText, Download, Share2, Filter, ChevronDown, ChevronUp
} from 'lucide-react'
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { useCaseStore, useGlobalStore, useUserStore } from '../utils/enhancedStore'

const AdjudicatorInsights = () => {
  const { 
    cases, 
    getCaseById, 
    updateCaseStatus,
    addNote,
    getUpcomingDeadlines
  } = useCaseStore()
  
  const { addNotification } = useGlobalStore()
  const { user } = useUserStore()
  
  const [caseId, setCaseId] = useState(user.caseNumber || 'MSC-2024-123456')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [filterImpact, setFilterImpact] = useState('all')
  const [expandedSection, setExpandedSection] = useState(null)
  const [analysisHistory, setAnalysisHistory] = useState([])

  // Get user's current case
  useEffect(() => {
    if (cases.length > 0) {
      const currentCase = cases.find(c => c.status === 'interview' || c.status === 'pending')
      if (currentCase && !selectedCase) {
        setSelectedCase(currentCase)
        setCaseId(currentCase.caseNumber)
      }
    }
  }, [cases, selectedCase])

  // Dynamic approval rates based on case type
  const approvalRates = useMemo(() => {
    if (!selectedCase) {
      return [
        { name: 'Approved', value: 78, color: '#10B981' },
        { name: 'Pending', value: 15, color: '#F59E0B' },
        { name: 'Denied', value: 7, color: '#EF4444' }
      ]
    }
    
    // Adjust rates based on case type
    const typeMultipliers = {
      'approved': { approved: 1.15, pending: 0.7, denied: 0.5 },
      'interview': { approved: 1.0, pending: 1.2, denied: 0.8 },
      'pending': { approved: 0.85, pending: 1.3, denied: 1.1 },
      'rfe': { approved: 0.75, pending: 1.4, denied: 1.3 }
    }
    
    const multiplier = typeMultipliers[selectedCase.status] || typeMultipliers.pending
    const baseApproved = 78 * multiplier.approved
    const basePending = 15 * multiplier.pending
    const baseDenied = 7 * multiplier.denied
    const total = baseApproved + basePending + baseDenied
    
    return [
      { name: 'Approved', value: Math.round((baseApproved / total) * 100), color: '#10B981' },
      { name: 'Pending', value: Math.round((basePending / total) * 100), color: '#F59E0B' },
      { name: 'Denied', value: Math.round((baseDenied / total) * 100), color: '#EF4444' }
    ]
  }, [selectedCase])

  // Processing trend data
  const processingTrend = [
    { month: 'Jul', days: 180, cases: 1250 },
    { month: 'Aug', days: 165, cases: 1380 },
    { month: 'Sep', days: 155, cases: 1420 },
    { month: 'Oct', days: 145, cases: 1580 },
    { month: 'Nov', days: 138, cases: 1650 },
    { month: 'Dec', days: 127, cases: 1720 },
    { month: 'Jan', days: 115, cases: 1890 }
  ]

  // Dynamic risk factors based on selected case
  const riskFactors = useMemo(() => [
    { factor: 'Employment gaps', impact: 'Medium', level: 35, trend: 'stable' },
    { factor: 'International travel history', impact: 'Low', level: 15, trend: 'decreasing' },
    { factor: 'Previous visa violations', impact: 'High', level: 65, trend: 'stable' },
    { factor: 'Incomplete documentation', impact: 'High', level: 55, trend: 'improving' },
    { factor: 'Criminal history', impact: 'Critical', level: 85, trend: 'stable' }
  ], [selectedCase])

  // Filter risk factors
  const filteredRiskFactors = useMemo(() => {
    if (filterImpact === 'all') return riskFactors
    return riskFactors.filter(f => f.impact.toLowerCase() === filterImpact)
  }, [riskFactors, filterImpact])

  const improvementTips = [
    { 
      title: 'Strengthen Employment Evidence', 
      desc: 'Obtain detailed letters from all past employers including dates, position, and duties.',
      priority: 'high',
      action: 'Request Letters',
      icon: '📋'
    },
    { 
      title: 'Complete Travel History', 
      desc: 'Gather passports and create comprehensive travel timeline with dates and purposes.',
      priority: 'high',
      action: 'Create Timeline',
      icon: '✈️'
    },
    { 
      title: 'Update Financial Documentation', 
      desc: 'Include recent bank statements, tax returns, and investment account details.',
      priority: 'medium',
      action: 'Upload Documents',
      icon: '💰'
    },
    { 
      title: 'Medical Examination', 
      desc: 'Schedule and complete required medical exam with authorized physician.',
      priority: 'medium',
      action: 'Find Doctor',
      icon: '🏥'
    },
    { 
      title: 'Update Address History', 
      desc: 'Provide complete address history for the past 5 years with supporting documentation.',
      priority: 'low',
      action: 'Add Addresses',
      icon: '🏠'
    },
    { 
      title: 'Marriage Evidence', 
      desc: 'Include joint financial accounts, photos, and correspondence showing relationship.',
      priority: 'medium',
      action: 'Upload Evidence',
      icon: '💑'
    }
  ]

  const handleAnalyze = () => {
    if (!caseId.trim()) {
      addNotification({
        type: 'warning',
        title: 'Case Number Required',
        message: 'Please enter a valid case number to analyze.'
      })
      return
    }
    
    setIsAnalyzing(true)
    
    // Find case or simulate analysis
    const foundCase = getCaseById(cases.find(c => c.caseNumber === caseId)?.id)
    
    setTimeout(() => {
      setSelectedCase(foundCase || {
        id: Date.now(),
        caseNumber: caseId,
        status: 'interview',
        type: 'I-485 Adjustment of Status'
      })
      
      // Add to analysis history
      setAnalysisHistory(prev => [{
        caseNumber: caseId,
        timestamp: new Date(),
        status: foundCase?.status || 'interview'
      }, ...prev.slice(0, 9)])
      
      setIsAnalyzing(false)
      
      addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: `Case ${caseId} has been analyzed successfully.`
      })
    }, 2500)
  }

  const handleAddNote = (content) => {
    if (selectedCase) {
      addNote(selectedCase.id, content)
      addNotification({
        type: 'success',
        title: 'Note Added',
        message: 'Your note has been saved to this case.'
      })
    }
  }

  // Calculate overall case strength score
  const caseStrengthScore = useMemo(() => {
    const completedRequirements = selectedCase ? 6 : 4
    const totalRequirements = 8
    return Math.round((completedRequirements / totalRequirements) * 100)
  }, [selectedCase])

  // Radar chart data for case profile
  const caseProfileData = [
    { subject: 'Documentation', A: 85, fullMark: 100 },
    { subject: 'Financial', A: 72, fullMark: 100 },
    { subject: 'Employment', A: 68, fullMark: 100 },
    { subject: 'Travel History', A: 90, fullMark: 100 },
    { subject: 'Family Ties', A: 95, fullMark: 100 },
    { subject: 'Legal Status', A: 88, fullMark: 100 }
  ]

  return (
    <div className="adjudicator-insights">
      {/* Page Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1>
          Adjudicator AI Insights
        </motion.h1>
        <p>
          Analyze your case probability, identify risk factors, and get AI-powered recommendations 
          to strengthen your immigration application.
        </p>
      </motion.div>

      {/* Case Search & Selection */}
      <motion.div 
        className="glass" 
        style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Case Number
            </label>
            <div style={{ position: 'relative' }}>
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
                placeholder="Enter your case number (e.g., MSC-2024-123456)"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          
          {/* Quick Select from Your Cases */}
          {cases.length > 0 && (
            <div style={{ minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
                Your Cases
              </label>
              <select 
                className="glass-input"
                value={selectedCase?.caseNumber || ''}
                onChange={(e) => {
                  const found = cases.find(c => c.caseNumber === e.target.value)
                  setSelectedCase(found)
                  setCaseId(found?.caseNumber || '')
                }}
                style={{ width: '100%' }}
              >
                <option value="">Select a case...</option>
                {cases.map(c => (
                  <option key={c.id} value={c.caseNumber}>
                    {c.caseNumber} - {c.type}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <motion.button 
            className="glass-button primary"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={18} className="spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap size={18} />
                Analyze Case
              </>
            )}
          </motion.button>
        </div>

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)' }}>
              Recent Analyses
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
              {analysisHistory.map((history, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: '4px 12px',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCaseId(history.caseNumber)}
                  whileHover={{ scale: 1.05 }}
                >
                  {history.caseNumber}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        {/* Success Probability */}
        <motion.div 
          className="glass" 
          style={{ padding: 'var(--spacing-xl)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Target size={20} style={{ color: 'var(--color-success)' }} />
              Success Probability
            </h3>
            {selectedCase && (
              <span style={{ 
                fontSize: '0.75rem',
                padding: '4px 12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-success)',
                textTransform: 'capitalize'
              }}>
                {selectedCase.type}
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={approvalRates}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {approvalRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                  {approvalRates[0].value}%
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Approval</div>
              </motion.div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xl)', flexWrap: 'wrap', marginBottom: 'var(--spacing-lg)' }}>
            {approvalRates.map(rate => (
              <motion.div 
                key={rate.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rate.value / 20 }}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
              >
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: rate.color 
                }} />
                <span style={{ fontSize: '0.875rem' }}>{rate.name}: {rate.value}%</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            style={{ 
              padding: 'var(--spacing-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              gap: 'var(--spacing-md)',
              alignItems: 'flex-start'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--color-success)' }}>Strong Case Profile</div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Based on your profile and documentation, your case has favorable characteristics for approval. 
                Continue maintaining proper documentation.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Processing Timeline */}
        <motion.div 
          className="glass" 
          style={{ padding: 'var(--spacing-xl)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Clock size={20} style={{ color: 'var(--color-secondary)' }} />
              Processing Timeline
            </h3>
            <div style={{ 
              padding: '4px 12px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-secondary)',
              fontSize: '0.75rem'
            }}>
              Improving
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <motion.div 
              style={{ 
                fontSize: '3rem', 
                fontWeight: '700',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              127
            </motion.div>
            <div style={{ color: 'var(--text-secondary)' }}>Estimated days to decision</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-success)', marginTop: '4px' }}>
              ↓ 23% faster than 6 months ago
            </div>
          </div>

          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={processingTrend}>
              <defs>
                <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-dark)', 
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="days" 
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDays)" 
              />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{ 
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-sm)',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              📈 Processing volume: <strong>1,890 cases/month</strong> (increasing)
            </span>
          </div>
        </motion.div>
      </div>

      {/* Case Profile Radar */}
      <motion.div 
        className="glass" 
        style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <BarChart3 size={20} style={{ color: 'var(--color-secondary)' }} />
          Case Profile Analysis
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', alignItems: 'center' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={caseProfileData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <Radar
                  name="Your Case"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Strength Areas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {[
                { area: 'Family Ties', score: 95, status: 'excellent' },
                { area: 'Travel History', score: 90, status: 'excellent' },
                { area: 'Legal Status', score: 88, status: 'good' },
                { area: 'Documentation', score: 85, status: 'good' },
                { area: 'Financial', score: 72, status: 'fair' },
                { area: 'Employment', score: 68, status: 'fair' }
              ].map((item, index) => (
                <motion.div
                  key={item.area}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.875rem' }}>{item.area}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{item.score}%</span>
                    </div>
                    <div style={{ 
                      height: '6px',
                      background: 'var(--bg-dark)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <motion.div 
                        style={{ 
                          height: '100%', 
                          width: `${item.score}%`,
                          background: item.score >= 80 ? 'var(--color-success)' : 
                                     item.score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)',
                          borderRadius: 'var(--radius-full)'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Factors Analysis */}
      <motion.div 
        className="glass" 
        style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
            Risk Factors Analysis
          </h3>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            {['all', 'critical', 'high', 'medium', 'low'].map(filter => (
              <motion.button
                key={filter}
                className={`glass-button ${filterImpact === filter ? 'primary' : ''}`}
                onClick={() => setFilterImpact(filter)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', textTransform: 'capitalize' }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)' }}>
          <div>
            {filteredRiskFactors.map((factor, index) => (
              <motion.div
                key={index}
                style={{ 
                  marginBottom: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `3px solid ${
                    factor.impact === 'Critical' ? 'var(--color-danger)' :
                    factor.impact === 'High' ? 'var(--color-warning)' :
                    factor.impact === 'Medium' ? 'var(--color-secondary)' : 'var(--color-success)'
                  }`,
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedSection(expandedSection === `risk-${index}` ? null : `risk-${index}`)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xs)' }}>
                  <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    {factor.factor}
                    {factor.trend === 'improving' && <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />}
                    {factor.trend === 'decreasing' && <TrendingUp size={14} style={{ color: 'var(--color-success)', transform: 'rotate(180deg)' }} />}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    background: 
                      factor.impact === 'Critical' ? 'rgba(239, 68, 68, 0.1)' :
                      factor.impact === 'High' ? 'rgba(245, 158, 11, 0.1)' :
                      factor.impact === 'Medium' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    color: 
                      factor.impact === 'Critical' ? 'var(--color-danger)' :
                      factor.impact === 'High' ? 'var(--color-warning)' :
                      factor.impact === 'Medium' ? 'var(--color-secondary)' : 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {factor.impact}
                    {expandedSection === `risk-${index}` ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </span>
                </div>
                
                <div style={{ 
                  height: '6px',
                  background: 'var(--bg-dark)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  <motion.div 
                    style={{ 
                      height: '100%', 
                      width: `${factor.level}%`,
                      background: 
                        factor.level >= 70 ? 'var(--color-danger)' :
                        factor.level >= 40 ? 'var(--color-warning)' : 'var(--color-success)',
                      borderRadius: 'var(--radius-full)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.level}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
                
                <AnimatePresence>
                  {expandedSection === `risk-${index}` && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}
                    >
                      {factor.impact === 'Critical' && 'This requires immediate attention. Consider consulting with an immigration attorney.'}
                      {factor.impact === 'High' && 'This may affect your case timeline. Gather supporting documentation.'}
                      {factor.impact === 'Medium' && 'Monitor this factor and ensure documentation is complete.'}
                      {factor.impact === 'Low' && 'Minimal impact. Continue maintaining records.'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div style={{ 
            padding: 'var(--spacing-lg)',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Info size={18} style={{ color: 'var(--color-secondary)' }} />
              Risk Mitigation Tips
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {[
                { icon: '📋', text: 'Document all employment gaps with valid explanations and supporting letters' },
                { icon: '✈️', text: 'Create comprehensive travel timeline with passport stamps and entry/exit records' },
                { icon: '📄', text: 'Include detailed cover letter explaining your case circumstances' },
                { icon: '💼', text: 'Obtain expert opinions or professional evaluations for complex aspects' },
                { icon: '👥', text: 'Consider professional legal consultation for high-risk factors' },
                { icon: '📊', text: 'Maintain organized file with chronological documentation' }
              ].map((tip, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}
                >
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{tip.icon}</span>
                  <span style={{ fontSize: '0.875rem' }}>{tip.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Improvement Recommendations */}
      <motion.div 
        className="glass" 
        style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <TrendingUp size={20} style={{ color: 'var(--color-secondary)' }} />
          AI Recommendations to Strengthen Your Case
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
          {improvementTips.map((tip, index) => (
            <motion.div
              key={index}
              style={{ 
                padding: 'var(--spacing-lg)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                cursor: 'pointer'
              }}
              whileHover={{ y: -2, borderColor: 'rgba(59, 130, 246, 0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span>{tip.icon}</span>
                  {tip.title}
                </h4>
                <span style={{ 
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  background: tip.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  color: tip.priority === 'high' ? 'var(--color-danger)' : 'var(--color-warning)',
                  textTransform: 'uppercase'
                }}>
                  {tip.priority}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, marginBottom: 'var(--spacing-md)' }}>
                {tip.desc}
              </p>
              <motion.button
                className="glass-button"
                style={{ width: '100%', justifyContent: 'center' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tip.action}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Deep Analysis CTA */}
        <motion.div 
          style={{ 
            padding: 'var(--spacing-lg)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            gap: 'var(--spacing-lg)',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div style={{ 
            width: '56px', 
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Eye size={28} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ marginBottom: '4px' }}>Want a Deeper Analysis?</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Our AI can perform a comprehensive review of your entire case file. Upload all documents for a complete assessment.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <motion.button
              className="glass-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} />
              Export Report
            </motion.button>
            <motion.button
              className="glass-button primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText size={16} />
              Upload Documents
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Stats Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
        {[
          { label: 'Case Strength', value: `${caseStrengthScore}%`, color: 'var(--color-success)', icon: Target },
          { label: 'Docs Complete', value: '85%', color: 'var(--color-secondary)', icon: FileText },
          { label: 'Risk Level', value: 'Low', color: 'var(--color-warning)', icon: AlertTriangle },
          { label: 'Est. Decision', value: '127 days', color: 'var(--color-secondary)', icon: Clock }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass"
            style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <stat.icon size={24} style={{ color: stat.color, marginBottom: 'var(--spacing-sm)' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AdjudicatorInsights
