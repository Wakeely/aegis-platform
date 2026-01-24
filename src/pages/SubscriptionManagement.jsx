import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown, CreditCard, Calendar, Check, X, AlertTriangle,
  Zap, Shield, FileText, Database, BarChart3, Users,
  ChevronRight, Download, Settings, Loader2, Sparkles
} from 'lucide-react'
import { useSubscription } from '../utils/enhancedSubscriptionStore'
import { useNavigate } from 'react-router-dom'
import UpgradeModal from '../components/UpgradeModal'

const SubscriptionManagement = () => {
  const navigate = useNavigate()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Wrap in try-catch to prevent blank page on errors
  let subscriptionData
  try {
    subscriptionData = useSubscription()
  } catch (error) {
    console.error('Subscription hook error:', error)
    return (
      <div className="subscription-management" style={{ padding: 'var(--spacing-xl)' }}>
        <div className="glass" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
          <AlertTriangle size={48} style={{ color: 'var(--color-warning)', marginBottom: 'var(--spacing-md)' }} />
          <h2>Unable to load subscription data</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Please try refreshing the page or signing in again.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="glass-button primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const {
    plan,
    planName,
    status,
    price,
    interval,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    daysRemaining,
    benefits,
    isPremium,
    storageUsage,
    formsRemaining,
    isProcessing,
    cancelSubscription,
    reactivateSubscription
  } = subscriptionData

  const handleCancel = async () => {
    await cancelSubscription()
    setShowCancelConfirm(false)
  }

  const handleReactivate = async () => {
    await reactivateSubscription()
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="subscription-management">
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
            <Crown size={24} color="white" />
          </div>
          Subscription Management
        </motion.h1>
        <p>Manage your subscription, view usage, and upgrade your plan</p>
      </div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass"
        style={{
          padding: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-xl)',
          border: isPremium ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--glass-border)',
          background: isPremium 
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
            : undefined
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{planName} Plan</h2>
              {isPremium && (
                <span style={{
                  padding: '4px 12px',
                  background: 'linear-gradient(135deg, var(--color-warning) 0%, #F97316 100%)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#000'
                }}>
                  <Sparkles size={12} style={{ marginRight: '4px' }} />
                  ACTIVE
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {plan === 'FREE' 
                ? 'Essential features to get started'
                : `$${price.toFixed(2)}/${interval === 'month' ? 'month' : 'year'}`
              }
            </p>
          </div>
          
          {isPremium && (
            <div style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              {cancelAtPeriodEnd ? (
                <span style={{ color: 'var(--color-warning)' }}>
                  Cancels on {formatDate(currentPeriodEnd)}
                </span>
              ) : (
                <span>
                  Renews {formatDate(currentPeriodEnd)}
                  <span style={{ marginLeft: 'var(--spacing-sm)', color: 'var(--color-success)' }}>
                    ({daysRemaining} days left)
                  </span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Benefits List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          {benefits.map((benefit, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              fontSize: '0.875rem'
            }}>
              <Check size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          {plan === 'FREE' ? (
            <motion.button
              onClick={() => setShowUpgradeModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--gradient-primary)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <Crown size={18} />
              Upgrade to Premium
            </motion.button>
          ) : cancelAtPeriodEnd ? (
            <motion.button
              onClick={handleReactivate}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-success)',
                background: 'transparent',
                color: 'var(--color-success)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                opacity: isProcessing ? 0.6 : 1
              }}
            >
              {isProcessing ? <Loader2 size={18} className="spin" /> : <Check size={18} />}
              Reactivate Subscription
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowCancelConfirm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-danger)',
                background: 'transparent',
                color: 'var(--color-danger)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <X size={18} />
              Cancel Subscription
            </motion.button>
          )}
          
          <motion.button
            onClick={() => navigate('/pricing')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <Settings size={18} />
            {plan === 'FREE' ? 'View Plans' : 'Change Plan'}
          </motion.button>
        </div>
      </motion.div>

      {/* Compact Usage Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}
      >
        {/* Storage Usage */}
        <div className="glass" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
            <Database size={16} style={{ color: 'var(--color-secondary)' }} />
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Storage</h4>
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                {storageUsage.used}MB / {storageUsage.limit}MB
              </span>
            </div>
            <div style={{
              height: '6px',
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${storageUsage.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: storageUsage.percentage > 80 
                    ? 'var(--color-warning)' 
                    : 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Forms Usage */}
        <div className="glass" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
            <FileText size={16} style={{ color: 'var(--color-secondary)' }} />
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Forms</h4>
          </div>
          
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
            {formsRemaining === 'unlimited' ? (
              <span style={{ color: 'var(--color-success)' }}>∞</span>
            ) : (
              <span style={{ color: 'var(--text-primary)' }}>{formsRemaining}</span>
            )}
          </div>
          
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {isPremium ? 'Unlimited' : '3 free/month'}
          </p>
        </div>

        {/* Premium Features Status */}
        <div className="glass" style={{ padding: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
            <Zap size={16} style={{ color: isPremium ? 'var(--color-warning)' : 'var(--text-muted)' }} />
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Premium</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { name: 'AI Insights', active: true },
              { name: 'Mock Interview', active: true },
              { name: 'OCR Scanning', active: true },
              { name: 'Priority Support', active: true }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-sm) 0'
              }}>
                <span style={{ fontSize: '0.875rem' }}>{feature.name}</span>
                {isPremium ? (
                  <Check size={16} style={{ color: 'var(--color-success)' }} />
                ) : (
                  <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="subscription_upgrade"
        title="Upgrade Your Plan"
        description="Unlock all Premium features and get the most out of your immigration journey."
      />

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                maxWidth: '400px',
                width: '90%'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)'
              }}>
                <AlertTriangle size={32} style={{ color: 'var(--color-danger)' }} />
              </div>
              
              <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-sm)' }}>
                Cancel Subscription?
              </h3>
              <p style={{ 
                textAlign: 'center', 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--spacing-xl)',
                fontSize: '0.875rem'
              }}>
                Your Premium access will continue until {formatDate(currentPeriodEnd)}. 
                After that, you'll be downgraded to the Free plan.
              </p>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <motion.button
                  onClick={() => setShowCancelConfirm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--glass-border)',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Keep Subscription
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--color-danger)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: isProcessing ? 0.6 : 1
                  }}
                >
                  {isProcessing ? <Loader2 size={18} className="spin" /> : 'Confirm Cancel'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SubscriptionManagement
