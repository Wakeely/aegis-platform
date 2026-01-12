import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, AlertTriangle, CheckCircle, 
  Clock, Target, Zap, Eye, RefreshCw, Info
} from 'lucide-react'
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts'

const AdjudicatorInsights = () => {
  const [caseId, setCaseId] = useState('MSC-2024-123456')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const approvalRates = [
    { name: 'Approved', value: 78, color: '#10B981' },
    { name: 'Pending', value: 15, color: '#F59E0B' },
    { name: 'Denied', value: 7, color: '#EF4444' }
  ]

  const processingTrend = [
    { month: 'Jul', days: 180 },
    { month: 'Aug', days: 165 },
    { month: 'Sep', days: 155 },
    { month: 'Oct', days: 145 },
    { month: 'Nov', days: 138 },
    { month: 'Dec', days: 127 },
    { month: 'Jan', days: 115 }
  ]

  const riskFactors = [
    { factor: 'Employment gaps', impact: 'Medium', level: 35 },
    { factor: 'International travel history', impact: 'Low', level: 15 },
    { factor: 'Previous visa violations', impact: 'High', level: 65 },
    { factor: 'Incomplete documentation', impact: 'High', level: 55 },
    { factor: 'Criminal history', impact: 'Critical', level: 85 }
  ]

  const improvementTips = [
    { title: 'Strengthen Employment Evidence', desc: 'Obtain detailed letters from all past employers', priority: 'high' },
    { title: 'Complete Travel History', desc: 'Gather passports and create comprehensive travel timeline', priority: 'high' },
    { title: 'Update Financial Documentation', desc: 'Include recent bank statements and investment accounts', priority: 'medium' },
    { title: 'Medical Examination', desc: 'Schedule and complete required medical exam', priority: 'medium' }
  ]

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 2500)
  }

  return (
    <div className="adjudicator-insights">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Adjudicator AI Insights
        </motion.h1>
        <p>Analyze your case probability and identify areas for improvement.</p>
      </div>

      {/* Case Search */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '500' }}>
              Case Number
            </label>
            <input 
              type="text" 
              className="glass-input"
              placeholder="Enter your case number (e.g., MSC-2024-123456)"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            />
          </div>
          <button 
            className="glass-button primary"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}
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
          </button>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        {/* Success Probability */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Target size={20} style={{ color: 'var(--color-success)' }} />
            Success Probability
          </h3>
          
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
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-success)' }}>78%</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Approval</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xl)' }}>
            {approvalRates.map(rate => (
              <div key={rate.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: rate.color 
                }} />
                <span style={{ fontSize: '0.875rem' }}>{rate.name}: {rate.value}%</span>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-md)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--spacing-md)',
            alignItems: 'flex-start'
          }}>
            <CheckCircle size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--color-success)' }}>Strong Case Profile</div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                Based on your profile and documentation, your case has favorable characteristics for approval.
              </p>
            </div>
          </div>
        </div>

        {/* Processing Timeline */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Clock size={20} style={{ color: 'var(--color-secondary)' }} />
            Processing Timeline
          </h3>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              127
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Estimated days to decision</div>
          </div>

          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={processingTrend}>
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
              <Line 
                type="monotone" 
                dataKey="days" 
                stroke="url(#gradient)" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Processing time has improved by 23% over the past 6 months
          </p>
        </div>
      </div>

      {/* Risk Factors Analysis */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
          Risk Factors Analysis
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
          <div>
            {riskFactors.map((factor, index) => (
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
                  }`
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xs)' }}>
                  <span style={{ fontWeight: '500' }}>{factor.factor}</span>
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
                      factor.impact === 'Medium' ? 'var(--color-secondary)' : 'var(--color-success)'
                  }}>
                    {factor.impact} Impact
                  </span>
                </div>
                <div style={{ 
                  height: '6px',
                  background: 'var(--bg-dark)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${factor.level}%`,
                    background: 
                      factor.level >= 70 ? 'var(--color-danger)' :
                      factor.level >= 40 ? 'var(--color-warning)' : 'var(--color-success)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ 
            padding: 'var(--spacing-lg)',
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)'
          }}>
            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Risk Mitigation Tips</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {[
                { icon: '📋', text: 'Document all employment gaps with valid explanations' },
                { icon: '✈️', text: 'Create comprehensive travel timeline with passport stamps' },
                { icon: '📄', text: 'Include detailed cover letter explaining your case' },
                { icon: '💼', text: 'Obtain expert opinions for complex aspects' },
                { icon: '👥', text: 'Consider professional legal consultation' }
              ].map((tip, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ fontSize: '1.25rem' }}>{tip.icon}</span>
                  <span>{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Improvement Recommendations */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <TrendingUp size={20} style={{ color: 'var(--color-secondary)' }} />
          AI Recommendations to Strengthen Your Case
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
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
                <h4 style={{ fontSize: '1rem' }}>{tip.title}</h4>
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
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                {tip.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div style={{ 
          marginTop: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          gap: 'var(--spacing-lg)',
          alignItems: 'center'
        }}>
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
          <div style={{ flex: 1 }}>
            <h4 style={{ marginBottom: '4px' }}>Want a Deeper Analysis?</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Our AI can perform a comprehensive review of your entire case file. Upload all documents for a complete assessment.
            </p>
          </div>
          <button className="glass-button primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdjudicatorInsights
