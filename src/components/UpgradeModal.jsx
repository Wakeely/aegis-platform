import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Crown, Sparkles, Check, CreditCard, 
  Lock, Shield, Zap, Star, ArrowRight,
  AlertCircle, Loader2
} from 'lucide-react'
import { useSubscriptionStore } from '../utils/subscriptionStore'
import { useNavigate } from 'react-router-dom'

const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  feature = null, 
  title = "Unlock Premium Features",
  description = "Upgrade to Premium to access this feature and much more.",
  plan = 'monthly' // 'monthly' | 'annual'
}) => {
  const navigate = useNavigate()
  const { isProcessing, upgradeToMonthly, upgradeToAnnual, plan: currentPlan } = useSubscriptionStore()
  const [billingPeriod, setBillingPeriod] = useState(plan)
  const [paymentStep, setPaymentStep] = useState('select')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const handleUpgrade = async () => {
    if (billingPeriod === 'monthly') {
      await upgradeToMonthly()
    } else {
      await upgradeToAnnual()
    }
    setPaymentStep('success')
    
    // Close after success animation
    setTimeout(() => {
      onClose()
      navigate('/dashboard')
    }, 2000)
  }

  const premiumFeatures = [
    { icon: 'brain', text: 'AI-Powered Case Analysis' },
    { icon: 'file', text: 'Unlimited Form Generation' },
    { icon: 'scan', text: 'Advanced Document Scanning' },
    { icon: 'calendar', text: 'Mock Interview Simulator' },
    { icon: 'users', text: 'Priority Attorney Booking' },
    { icon: 'shield', text: 'Adjudicator Insights' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                maxWidth: billingPeriod === 'select' ? '500px' : '450px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Header */}
              <div style={{
                padding: 'var(--spacing-xl)',
                borderBottom: '1px solid var(--glass-border)',
                position: 'relative'
              }}>
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: 'var(--spacing-md)',
                    right: 'var(--spacing-md)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  <X size={18} />
                </button>

                {paymentStep === 'select' ? (
                  <>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--spacing-md)'
                    }}>
                      <Crown size={32} style={{ color: 'var(--color-warning)' }} />
                    </div>
                    <h2 style={{
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      {title}
                    </h2>
                    <p style={{
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      {description}
                    </p>
                  </>
                ) : paymentStep === 'processing' ? (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        border: '3px solid var(--glass-border)',
                        borderTopColor: 'var(--color-warning)',
                        margin: '0 auto var(--spacing-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Loader2 size={24} style={{ color: 'var(--color-warning)' }} />
                    </motion.div>
                    <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Processing Payment</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Please wait while we set up your Premium account...
                    </p>
                  </div>
                ) : paymentStep === 'success' ? (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--color-success)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)'
                      }}>
                      <Check size={40} style={{ color: 'white' }} />
                    </motion.div>
                    <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-success)' }}>
                      Welcome to Premium!
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Your Premium features are now unlocked
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Content */}
              {paymentStep === 'select' && (
                <>
                  {/* Billing Toggle */}
                  <div style={{
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--glass-border)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-xs)',
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      <button
                        onClick={() => setBillingPeriod('monthly')}
                        style={{
                          flex: 1,
                          padding: 'var(--spacing-sm)',
                          borderRadius: 'var(--radius-full)',
                          border: 'none',
                          background: billingPeriod === 'monthly' ? 'var(--gradient-primary)' : 'transparent',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingPeriod('annual')}
                        style={{
                          flex: 1,
                          padding: 'var(--spacing-sm)',
                          borderRadius: 'var(--radius-full)',
                          border: 'none',
                          background: billingPeriod === 'annual' ? 'var(--gradient-primary)' : 'transparent',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Annual
                        <span style={{
                          padding: '2px 6px',
                          background: 'var(--color-success)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.7rem'
                        }}>
                          Save 33%
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Features List */}
                  <div style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-lg)'
                    }}>
                      {premiumFeatures.map((feature, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)',
                          fontSize: '0.8rem'
                        }}>
                          <Check size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div style={{
                      background: 'var(--bg-glass)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--spacing-lg)',
                      marginBottom: 'var(--spacing-lg)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-md)'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {billingPeriod === 'monthly' ? 'Monthly' : 'Annual'} Plan
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                            ${billingPeriod === 'monthly' ? '29.99' : '249.99'}
                            <span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'var(--text-muted)' }}>
                              /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          </div>
                          {billingPeriod === 'annual' && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
                              Save $109 per year
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        onClick={handleUpgrade}
                        disabled={isProcessing || currentPlan !== 'FREE'}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%',
                          padding: 'var(--spacing-md)',
                          borderRadius: 'var(--radius-md)',
                          border: 'none',
                          background: billingPeriod === 'annual' 
                            ? 'var(--gradient-primary)' 
                            : 'linear-gradient(135deg, var(--color-warning) 0%, #F97316 100%)',
                          color: billingPeriod === 'annual' ? 'white' : '#000',
                          fontWeight: '600',
                          fontSize: '1rem',
                          cursor: isProcessing || currentPlan !== 'FREE' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--spacing-sm)',
                          opacity: isProcessing || currentPlan !== 'FREE' ? 0.6 : 1
                        }}
                      >
                        {currentPlan !== 'FREE' ? (
                          <>
                            <Check size={20} />
                            Already Premium
                          </>
                        ) : isProcessing ? (
                          <>
                            <Loader2 size={20} className="spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Crown size={20} />
                            {billingPeriod === 'annual' ? 'Get Premium & Save' : 'Upgrade to Premium'}
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      flexWrap: 'wrap'
                    }}>
                      {[
                        { icon: Shield, text: 'Secure' },
                        { icon: Lock, text: 'Encrypted' },
                        { icon: Check, text: '30-Day Guarantee' }
                      ].map((badge, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem'
                        }}>
                          <badge.icon size={14} />
                          <span>{badge.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UpgradeModal
