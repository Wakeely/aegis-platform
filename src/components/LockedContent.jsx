import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Crown, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'
import UpgradeModal from './UpgradeModal'

const LockedContent = ({
  children,
  feature = 'premium_feature',
  title = 'Premium Feature',
  description = 'Upgrade to Premium to access this feature.',
  preview = true,
  blurIntensity = 8
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showPreview, setShowPreview] = useState(preview)

  return (
    <>
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Locked Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: showPreview 
            ? `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,${blurIntensity > 5 ? 0.8 : 0.5}) 100%)`
            : 'rgba(0,0,0,0.85)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1.1 : 1, 
              opacity: isHovered ? 1 : 0.8 
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--spacing-lg)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <Crown size={32} style={{ color: 'var(--color-warning)' }} />
          </motion.div>

          {/* Title */}
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: 'var(--spacing-sm)',
            textAlign: 'center',
            padding: '0 var(--spacing-lg)'
          }}>
            {title}
          </h3>

          {/* Description */}
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            textAlign: 'center',
            marginBottom: 'var(--spacing-lg)',
            padding: '0 var(--spacing-lg)',
            maxWidth: '300px'
          }}>
            {description}
          </p>

          {/* Upgrade Button */}
          <motion.button
            onClick={() => setShowUpgradeModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--gradient-primary)',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Sparkles size={18} />
            Upgrade to Unlock
            <ArrowRight size={18} />
          </motion.button>

          {/* Toggle Preview */}
          {preview && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowPreview(false)
              }}
              style={{
                position: 'absolute',
                bottom: 'var(--spacing-md)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                marginTop: 'var(--spacing-md)'
              }}
            >
              <EyeOff size={14} />
              Hide Preview
            </button>
          )}
        </div>

        {/* Blurred Content */}
        <div style={{
          filter: showPreview ? `blur(${blurIntensity}px)` : 'none',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          {children}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={feature}
        title={title}
        description={description}
      />
    </>
  )
}

export default LockedContent
