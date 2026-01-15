import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Sparkles, Info, ArrowRight } from 'lucide-react'
import UpgradeModal from './UpgradeModal'

const PremiumBadge = ({
  variant = 'badge', // 'badge' | 'pill' | 'icon'
  size = 'medium', // 'small' | 'medium' | 'large'
  showTooltip = true,
  feature = null,
  onClick = null
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showTooltipInfo, setShowTooltipInfo] = useState(false)

  const sizeStyles = {
    small: { fontSize: '0.7rem', padding: '2px 8px', iconSize: 12 },
    medium: { fontSize: '0.8rem', padding: '4px 12px', iconSize: 14 },
    large: { fontSize: '0.875rem', padding: '6px 16px', iconSize: 18 }
  }

  const currentSize = sizeStyles[size]

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setShowUpgradeModal(true)
    }
  }

  if (variant === 'icon') {
    return (
      <>
        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: currentSize.iconSize * 2,
            height: currentSize.iconSize * 2,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
          onMouseEnter={() => showTooltip && setShowTooltipInfo(true)}
          onMouseLeave={() => showTooltip && setShowTooltipInfo(false)}
        >
          <Crown size={currentSize.iconSize} style={{ color: 'var(--color-warning)' }} />
          
          {/* Tooltip */}
          {showTooltipInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'nowrap',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              Premium Feature
            </motion.div>
          )}
        </motion.button>

        {showUpgradeModal && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            feature={feature}
            title="Premium Feature"
            description="Unlock this feature and more with Premium access."
          />
        )}
      </>
    )
  }

  if (variant === 'pill') {
    return (
      <>
        <motion.span
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: currentSize.padding,
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-full)',
            fontSize: currentSize.fontSize,
            fontWeight: '600',
            color: 'var(--color-warning)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Crown size={currentSize.iconSize} />
          Premium
        </motion.span>

        {showUpgradeModal && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            feature={feature}
            title="Premium Feature"
            description="Unlock this feature and more with Premium access."
          />
        )}
      </>
    )
  }

  // Default badge style
  return (
    <>
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: currentSize.padding,
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 'var(--radius-sm)',
          fontSize: currentSize.fontSize,
          fontWeight: '600',
          color: 'var(--color-warning)',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(245, 158, 11, 0.2)'
        }}
      >
        <Sparkles size={currentSize.iconSize} />
        <span>Premium</span>
        <ArrowRight size={currentSize.iconSize} style={{ opacity: 0.7 }} />
      </motion.div>

      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature={feature}
          title="Premium Feature"
          description={description}
        />
      )}
    </>
  )
}

export default PremiumBadge
