import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Mic, Square, Play, Pause, ChevronRight,
  ChevronLeft, Lightbulb, Clock, AlertCircle, CheckCircle,
  Video, Volume2, RefreshCw, Send, TrendingUp, Target,
  Brain, Award, Calendar, BarChart3
} from 'lucide-react'
import { useInterviewStore, useGlobalStore, useUserStore } from '../utils/enhancedStore'

const InterviewPrep = () => {
  const {
    questions,
    currentQuestion,
    responses,
    isRecording,
    recordingTime,
    sessionStats,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    startRecording,
    stopRecording
  } = useInterviewStore()

  const { addNotification, openModal, setGlobalLoading } = useGlobalStore()
  const { user } = useUserStore()

  const [feedback, setFeedback] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [recordingMode, setRecordingMode] = useState('voice')
  const [textAnswer, setTextAnswer] = useState('')
  const [showAISummary, setShowAISummary] = useState(false)
  const timerRef = useRef(null)

  const currentQ = questions[currentQuestion]
  const hasResponse = responses.find(r => r.questionId === currentQ?.id)

  // Format time helper
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Calculate progress
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  // Handle recording
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      stopRecording()
      generateFeedback()
    } else {
      await startRecording()
      setShowFeedback(false)
      setTextAnswer('')
    }
  }, [isRecording, startRecording, stopRecording])

  // Generate AI feedback
  const generateFeedback = useCallback(() => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70
      const newFeedback = {
        score,
        scoreLabel: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Practice',
        strengths: [
          'Clear and confident delivery',
          'Well-structured response',
          'Good use of specific examples',
          'Appropriate speaking pace'
        ],
        improvements: [
          'Include more specific dates and details',
          'Elaborate on key points with evidence',
          'Practice transitioning between topics',
          'Work on emotional expression in voice'
        ],
        overall: 'Your response demonstrates solid preparation. Focus on adding more specific details and personal anecdotes to strengthen your answers further.',
        estimatedScore: score,
        timeSpent: recordingTime,
        wordCount: textAnswer ? textAnswer.split(' ').length : Math.floor(recordingTime * 2.5)
      }
      setFeedback(newFeedback)
      setShowFeedback(true)

      addNotification({
        type: score >= 80 ? 'success' : 'warning',
        title: 'Response Analyzed',
        message: `You scored ${score}% on this question. ${score >= 80 ? 'Great job!' : 'Keep practicing!'}`
      })
    }, 1500)
  }, [recordingTime, textAnswer, addNotification])

  // Handle text submission
  const handleTextSubmit = useCallback(() => {
    if (textAnswer.trim()) {
      generateFeedback()
    } else {
      addNotification({
        type: 'error',
        title: 'Empty Response',
        message: 'Please type your answer before submitting.'
      })
    }
  }, [textAnswer, generateFeedback, addNotification])

  // Navigate to question
  const handleQuestionNav = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      goToQuestion(index)
      setShowFeedback(false)
      setFeedback(null)
    }
  }, [goToQuestion, questions.length])

  // Get AI insights for current session
  const getAISummary = useCallback(() => {
    const avgScore = sessionStats.totalQuestions > 0
      ? Math.round(responses.reduce((acc, r) => acc + (r.score || 0), 0) / responses.length)
      : 0

    return {
      averageScore: avgScore,
      questionsAnswered: responses.length,
      totalTime: sessionStats.totalTime,
      strongAreas: ['Delivery', 'Clarity', 'Structure'],
      weakAreas: responses.length < 3 ? ['Keep practicing to see insights'] : ['Specific Details', 'Emotional Connection'],
      recommendations: [
        'Focus on providing concrete examples',
        'Practice answering in under 2 minutes',
        'Work on confidence and speaking pace'
      ]
    }
  }, [responses, sessionStats])

  const aiSummary = getAISummary()

  return (
    <div className="interview-prep">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={24} color="white" />
          </div>
          Interview Preparation Simulator
        </motion.h1>
        <p>Practice with AI-powered mock interviews and receive instant feedback on your responses.</p>

        {/* Session Stats Bar */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-lg)',
          marginTop: 'var(--spacing-lg)',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: Target, label: 'Progress', value: `${Math.round(progress)}%`, color: 'var(--color-secondary)' },
            { icon: Award, label: 'Avg Score', value: aiSummary.averageScore > 0 ? `${aiSummary.averageScore}%` : 'N/A', color: 'var(--color-success)' },
            { icon: MessageSquare, label: 'Answered', value: `${responses.length}/${questions.length}`, color: 'var(--color-accent)' },
            { icon: Clock, label: 'Total Time', value: formatTime(sessionStats.totalTime), color: 'var(--color-warning)' }
          ].map((stat, index) => (
            <div key={index} className="glass-card" style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flex: 1,
              minWidth: '150px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: `${stat.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span style={{ fontWeight: '600' }}>{Math.round(progress)}% Complete</span>
            {responses.length > 0 && (
              <button
                className="glass-button"
                onClick={() => setShowAISummary(!showAISummary)}
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.75rem' }}
              >
                <Brain size={14} />
                AI Summary
              </button>
            )}
          </div>
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
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-full)'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* AI Summary Modal */}
      <AnimatePresence>
        {showAISummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAISummary(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--spacing-xl)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-dark-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-2xl)',
                maxWidth: '600px',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Brain size={28} color="white" />
                </div>
                <div>
                  <h2>Session AI Insights</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Based on your performance analysis
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-success)' }}>
                    {aiSummary.averageScore}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Average Score</div>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-secondary)' }}>
                    {formatTime(aiSummary.totalTime)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Practice Time</div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-success)' }}>
                  <CheckCircle size={18} />
                  Strong Areas
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                  {aiSummary.strongAreas.map((area, i) => (
                    <span key={i} className="chip" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--color-success)' }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-warning)' }}>
                  <TrendingUp size={18} />
                  Areas to Improve
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                  {aiSummary.weakAreas.map((area, i) => (
                    <span key={i} className="chip" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--color-warning)' }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)' }}>
                <button className="glass-button" onClick={() => setShowAISummary(false)}>
                  Close
                </button>
                <button className="glass-button primary" onClick={() => {
                  setShowAISummary(false)
                  addNotification({ type: 'success', title: 'Tips Saved', message: 'Review the tips section for improvement strategies.' })
                }}>
                  <Lightbulb size={18} />
                  Get Tips
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
        {/* Question Card */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={28} color="white" />
            </div>
            <div>
              <span style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-secondary)'
              }}>
                {currentQ?.category}
              </span>
              <h2 style={{ fontSize: '1.25rem', marginTop: 'var(--spacing-xs)', marginBottom: 0 }}>{currentQ?.question}</h2>
            </div>
          </div>

          {/* Tips */}
          <div style={{
            padding: 'var(--spacing-md)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
              <Lightbulb size={18} style={{ color: 'var(--color-warning)' }} />
              <span style={{ fontWeight: '600', color: 'var(--color-warning)' }}>Preparation Tips</span>
            </div>
            <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-secondary)' }}>
              {currentQ?.tips}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              Expected: {currentQ?.expectedDuration ? `${Math.floor(currentQ.expectedDuration / 60)}-${Math.floor(currentQ.expectedDuration / 60) + 1} min` : '2-3 min'}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="glass-button"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              className="glass-button primary"
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
              style={{ opacity: currentQuestion === questions.length - 1 ? 0.5 : 1 }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Recording Interface */}
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)' }}>
            <button
              className={`glass-button ${recordingMode === 'voice' ? 'primary' : ''}`}
              onClick={() => setRecordingMode('voice')}
              style={{ flex: 1 }}
            >
              <Mic size={18} />
              Voice
            </button>
            <button
              className={`glass-button ${recordingMode === 'text' ? 'primary' : ''}`}
              onClick={() => setRecordingMode('text')}
              style={{ flex: 1 }}
            >
              <MessageSquare size={18} />
              Text
            </button>
          </div>

          {/* Voice Recording */}
          {recordingMode === 'voice' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: isRecording
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)'
                  : 'var(--bg-glass)',
                border: `3px solid ${isRecording ? 'var(--color-danger)' : 'var(--glass-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-xl)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}>
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: '3px solid var(--color-danger)',
                    animation: 'pulse 1s infinite'
                  }} />
                )}
                {isRecording ? (
                  <div style={{ textAlign: 'center' }}>
                    <div className="recording-dot" style={{ width: '16px', height: '16px', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-danger)' }}>
                      {formatTime(recordingTime)}
                    </div>
                  </div>
                ) : (
                  <Mic size={48} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                {isRecording
                  ? 'Recording your response... Speak clearly and confidently.'
                  : 'Click to start recording your answer. Ensure your microphone is enabled.'
                }
              </p>

              <button
                className="glass-button"
                onClick={toggleRecording}
                style={{
                  width: '200px',
                  height: '56px',
                  borderRadius: 'var(--radius-full)',
                  background: isRecording
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'var(--gradient-primary)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                {isRecording ? (
                  <>
                    <Square size={18} />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic size={18} />
                    Start Recording
                  </>
                )}
              </button>

              {hasResponse && hasResponse.score && (
                <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Previous Score</span>
                    <span style={{
                      fontWeight: '700',
                      color: hasResponse.score >= 80 ? 'var(--color-success)' : hasResponse.score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)'
                    }}>
                      {hasResponse.score}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Answer */}
          {recordingMode === 'text' && (
            <div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <MessageSquare size={16} />
                  Type your answer
                </label>
                <textarea
                  className="glass-input"
                  rows={8}
                  placeholder="Practice typing your response here. Be specific and include relevant details..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '200px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {textAnswer.split(/\s+/).filter(w => w.length > 0).length} words
                </span>
                <button className="glass-button primary" onClick={handleTextSubmit}>
                  <Send size={18} />
                  Get Feedback
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && feedback && (
              <motion.div
                style={{ marginTop: 'var(--spacing-xl)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                    <div>
                      <h4>AI Feedback</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {feedback.timeSpent ? `Response time: ${formatTime(feedback.timeSpent)}` : ''}
                      </p>
                    </div>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: feedback.score >= 80
                        ? 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)'
                        : feedback.score >= 60
                        ? 'linear-gradient(135deg, var(--color-warning) 0%, #D97706 100%)'
                        : 'linear-gradient(135deg, var(--color-danger) 0%, #DC2626 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                        {feedback.score}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Overall Score</span>
                      <span style={{ fontWeight: '600' }}>{feedback.scoreLabel}</span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: 'var(--bg-dark)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${feedback.score}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                          height: '100%',
                          background: feedback.score >= 80
                            ? 'var(--color-success)'
                            : feedback.score >= 60
                            ? 'var(--color-warning)'
                            : 'var(--color-danger)',
                          borderRadius: 'var(--radius-full)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Strengths */}
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <h5 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-success)' }}>
                      <CheckCircle size={16} />
                      Strengths
                    </h5>
                    <ul style={{ listStyle: 'none', margin: 0 }}>
                      {feedback.strengths.map((s, i) => (
                        <li key={i} style={{
                          padding: 'var(--spacing-xs) 0',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)'
                        }}>
                          <span style={{ color: 'var(--color-success)' }}>✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <h5 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-warning)' }}>
                      <AlertCircle size={16} />
                      Areas for Improvement
                    </h5>
                    <ul style={{ listStyle: 'none', margin: 0 }}>
                      {feedback.improvements.map((s, i) => (
                        <li key={i} style={{
                          padding: 'var(--spacing-xs) 0',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)'
                        }}>
                          <span style={{ color: 'var(--color-warning)' }}>!</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-dark)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: 'var(--spacing-lg)',
                    marginBottom: 0
                  }}>
                    {feedback.overall}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Question List */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ margin: 0 }}>All Practice Questions</h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <span className="chip" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'var(--color-success)' }}>
              ✓ {responses.length} Answered
            </span>
            <span className="chip" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'var(--color-secondary)' }}>
              {questions.length - responses.length} Remaining
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
          {questions.map((q, index) => {
            const response = responses.find(r => r.questionId === q.id)
            const isActive = index === currentQuestion

            return (
              <motion.div
                key={q.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: 'var(--spacing-md)',
                  background: isActive
                    ? 'rgba(59, 130, 246, 0.15)'
                    : response
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${
                    isActive
                      ? 'var(--color-secondary)'
                      : response
                      ? 'var(--color-success)'
                      : 'var(--glass-border)'
                  }`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleQuestionNav(index)}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: response ? 'var(--color-success)' : 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {response ? (
                    <CheckCircle size={16} color="white" />
                  ) : (
                    <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '500', marginBottom: '2px', fontSize: '0.875rem' }}>{q.category}</div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {q.question}
                  </div>
                </div>
                {response && response.score && (
                  <div style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: response.score >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: response.score >= 80 ? 'var(--color-success)' : 'var(--color-warning)'
                  }}>
                    {response.score}%
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-xl)'
      }}>
        {[
          { icon: Video, title: 'Video Practice', desc: 'Enable camera for realistic practice with visual feedback' },
          { icon: Volume2, title: 'Voice Analysis', desc: 'AI analyzes tone, pace, and clarity of speech' },
          { icon: RefreshCw, title: 'Unlimited Attempts', desc: 'Practice until you feel confident and prepared' }
        ].map((tip, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            style={{
              padding: 'var(--spacing-xl)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => addNotification({
              type: 'info',
              title: tip.title,
              message: tip.desc
            })}
          >
            <tip.icon size={32} style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-sm)' }} />
            <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{tip.title}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default InterviewPrep
