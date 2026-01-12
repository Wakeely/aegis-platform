import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Mic, Square, Play, Pause, ChevronRight,
  ChevronLeft, Lightbulb, Clock, AlertCircle, CheckCircle,
  Video, Volume2, RefreshCw, Send
} from 'lucide-react'
import { useInterviewStore } from '../utils/store'

const InterviewPrep = () => {
  const { 
    questions, 
    currentQuestion, 
    responses,
    isRecording, 
    recordingTime,
    nextQuestion, 
    prevQuestion,
    setRecording,
    setRecordingTime 
  } = useInterviewStore()

  const [feedback, setFeedback] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [recordingMode, setRecordingMode] = useState('voice') // 'voice' or 'text'
  const [textAnswer, setTextAnswer] = useState('')
  const timerRef = useRef(null)

  const currentQ = questions[currentQuestion]

  useEffect(() => {
    let timer
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRecording, setRecordingTime])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleRecording = () => {
    if (isRecording) {
      setRecording(false)
      generateFeedback()
    } else {
      setRecording(true)
      setShowFeedback(false)
      setTextAnswer('')
    }
  }

  const generateFeedback = () => {
    setTimeout(() => {
      setFeedback({
        score: Math.floor(Math.random() * 30) + 70,
        strengths: [
          'Clear communication of key points',
          'Good use of specific examples',
          'Confident delivery'
        ],
        improvements: [
          'Include more specific dates',
          'Elaborate on timeline details',
          'Add emotional context to relationship story'
        ],
        overall: 'Your response demonstrated good preparation and clear communication. The inclusion of specific dates and personal anecdotes would strengthen your answer further.'
      })
      setShowFeedback(true)
    }, 1500)
  }

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      generateFeedback()
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="interview-prep">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Interview Preparation Simulator
        </motion.h1>
        <p>Practice with AI-powered mock interviews and receive instant feedback.</p>
      </div>

      {/* Progress */}
      <div className="glass" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span style={{ fontWeight: '600' }}>{Math.round(progress)}% Complete</span>
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
          />
        </div>
      </div>

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
                {currentQ.category}
              </span>
              <h2 style={{ fontSize: '1.25rem', marginTop: 'var(--spacing-xs)' }}>{currentQ.question}</h2>
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
              {currentQ.tips}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Clock size={14} />
              Expected: {currentQ.expectedDuration}
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
                transition: 'all 0.3s ease'
              }}>
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
                  ? 'Recording your response... Speak clearly.'
                  : 'Click to start recording your answer'
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
            </div>
          )}

          {/* Text Answer */}
          {recordingMode === 'text' && (
            <div>
              <div className="form-group">
                <label>Type your answer</label>
                <textarea
                  className="glass-input"
                  rows={8}
                  placeholder="Practice typing your response here..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: spaceBetween, alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {textAnswer.split(' ').length} words
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h4>AI Feedback</h4>
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
                      <span style={{ fontWeight: '600' }}>
                        {feedback.score >= 80 ? 'Excellent' : feedback.score >= 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div style={{ 
                      height: '8px',
                      background: 'var(--bg-dark)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${feedback.score}%`,
                        background: feedback.score >= 80 
                          ? 'var(--color-success)'
                          : feedback.score >= 60
                          ? 'var(--color-warning)'
                          : 'var(--color-danger)',
                        borderRadius: 'var(--radius-full)'
                      }} />
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
                          <span style={{ color: 'var(--color-success)' }}>•</span>
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
                          <span style={{ color: 'var(--color-warning)' }}>•</span>
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
                    marginTop: 'var(--spacing-lg)'
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
        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>All Practice Questions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
          {questions.map((q, index) => {
            const hasResponse = responses.find(r => r.questionId === q.id)
            return (
              <div 
                key={q.id}
                style={{ 
                  padding: 'var(--spacing-md)',
                  background: index === currentQuestion 
                    ? 'rgba(59, 130, 246, 0.1)'
                    : hasResponse
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${
                    index === currentQuestion 
                      ? 'var(--color-secondary)' 
                      : hasResponse
                      ? 'var(--color-success)'
                      : 'var(--glass-border)'
                  }`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)'
                }}
                onClick={() => {
                  // Navigate to question
                }}
              >
                <div style={{ 
                  width: '32px', 
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: hasResponse ? 'var(--color-success)' : 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {hasResponse ? (
                    <CheckCircle size={16} color="white" />
                  ) : (
                    <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '2px', fontSize: '0.875rem' }}>{q.category}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.question}
                  </div>
                </div>
              </div>
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
          { icon: Video, title: 'Video Practice', desc: 'Enable camera for realistic practice' },
          { icon: Volume2, title: 'Voice Analysis', desc: 'AI analyzes tone and clarity' },
          { icon: RefreshCw, title: 'Unlimited Attempts', desc: 'Practice until confident' }
        ].map((tip, index) => (
          <div 
            key={index}
            style={{ 
              padding: 'var(--spacing-lg)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textAlign: 'center'
            }}
          >
            <tip.icon size={32} style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-sm)' }} />
            <h4>{tip.title}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const spaceBetween = 'space-between'

export default InterviewPrep
