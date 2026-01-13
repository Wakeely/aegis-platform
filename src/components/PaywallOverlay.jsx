import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, X, Check, Sparkles, Crown, 
  CreditCard, Shield, Zap, ArrowRight, Star 
} from 'lucide-react'
import { useSubscriptionStore } from '../utils/subscriptionStore'

const PaywallOverlay = ({ 
  isOpen, 
  onClose, 
  title = "Premium Feature", 
  description = "Unlock this feature and more with Premium access.",
  feature = null
}) => {
  const { isProcessing, upgradeToMonthly, upgradeToAnnual, plans } = useSubscriptionStore()
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  
  const handleUpgrade = async (plan) => {
    if (plan === 'monthly') {
      await upgradeToMonthly()
    } else {
      await upgradeToAnnual()
    }
    onClose()
  }
  
  const benefits = [
    { icon: '🤖', text: 'AI-Powered Case Analysis' },
    { icon: '📄', text: 'Unlimited Form Generation' },
    { icon: '⚖️', text: 'Priority Attorney Booking' },
    { icon: '🎤', text: 'AI Mock Interview Simulator' },
    { icon: '📚', text: 'Premium Legal Guides' },
    { icon: '💾', text: '1GB Document Storage' }
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
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000
            }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--bg-dark-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-xl)',
              zIndex: 1001,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 'var(--spacing-md)',
                right: 'var(--spacing-md)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 'var(--spacing-xs)'
              }}
            >
              <X size={24} />
            </button>
            
            {/* Lock Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg)'
            }}>
              <Lock size={40} style={{ color: 'var(--color-warning)' }} />
            </div>
            
            {/* Title */}
            <h2 style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '1.75rem'
            }}>
              {title}
            </h2>
            
            {/* Description */}
            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              {description}
            </p>
            
            {/* Feature Highlight */}
            {feature && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-xl)',
                justifyContent: 'center'
              }}>
                <Sparkles size={20} style={{ color: 'var(--color-secondary)' }} />
                <span>Includes: <strong>{feature}</strong></span>
              </div>
            )}
            
            {/* Benefits Preview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              {benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  fontSize: '0.875rem'
                }}>
                  <Check size={16} style={{ color: 'var(--color-success)' }} />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <motion.button
              onClick={() => handleUpgrade(billingPeriod)}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: 'var(--spacing-md) var(--spacing-xl)',
                background: 'var(--gradient-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-md)'
              }}
            >
              {isProcessing ? (
                <>
                  <div className="spin" style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%'
                  }} />
                  Processing...
                </>
              ) : (
                <>
                  <Crown size={20} />
                  Upgrade to Premium - $29.99/month
                </>
              )}
            </motion.button>
            
            {/* Trust Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem'
            }}>
              <Shield size={14} />
              <span>Secure payment powered by Stripe</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ========================================
// Locked Content Wrapper
// ========================================
export const LockedContent = ({ 
  children, 
  title = "Premium Content", 
  description = "Upgrade to access this content",
  feature = null,
  fallback = null 
}) => {
  const [showPaywall, setShowPaywall] = useState(false)
  const { plan } = useSubscriptionStore()
  
  if (plan !== 'FREE') {
    return children
  }
  
  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Blurred Content Preview */}
        <div style={{
          filter: showPaywall ? 'none' : 'blur(8px)',
          opacity: showPaywall ? 1 : 0.5,
          pointerEvents: showPaywall ? 'auto' : 'none',
          userSelect: 'none'
        }}>
          {children}
        </div>
        
        {/* Paywall Overlay */}
        {!showPaywall && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, transparent 0%, var(--bg-dark-secondary) 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)'
          }}>
            <Lock size={48} style={{ color: 'var(--color-warning)', marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
              {description}
            </p>
            <motion.button
              onClick={() => setShowPaywall(true)}
              className="glass-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ padding: 'var(--spacing-sm) var(--spacing-xl)' }}
            >
              <Sparkles size={18} />
              Unlock with Premium
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Full Paywall Modal */}
      <PaywallOverlay
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        title={title}
        description={description}
        feature={feature}
      />
    </>
  )
}

// ========================================
// Feature Gate Component
// ========================================
export const FeatureGate = ({ 
  feature, 
  children, 
  fallback = null,
  title = "Premium Feature",
  description = "Upgrade to access this feature"
}) => {
  const hasAccess = useSubscriptionStore(state => state.hasAccess(feature))
  
  if (hasAccess) {
    return children
  }
  
  if (fallback) {
    return fallback
  }
  
  return (
    <div style={{
      padding: 'var(--spacing-lg)',
      background: 'var(--bg-glass)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--glass-border)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Lock size={24} style={{ color: 'var(--color-warning)' }} />
        </div>
        <div>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Premium Badge Component
// ========================================
export const PremiumBadge = ({ showText = true, size = 'sm' }) => {
  const iconSize = size === 'lg' ? 24 : size === 'md' ? 20 : 16
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: size === 'lg' ? '6px 12px' : size === 'md' ? '4px 10px' : '2px 6px',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: 'var(--radius-full)',
      color: 'var(--color-warning)',
      fontSize: size === 'lg' ? '0.875rem' : size === 'md' ? '0.75rem' : '0.625rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      <Crown size={iconSize} />
      {showText && 'Premium'}
    </span>
  )
}

export default PaywallOverlay
