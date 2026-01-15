import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, X, Sparkles, Crown, Shield, 
  Zap, Star, ArrowRight, CreditCard, Lock,
  FileText, Brain, Users, Calendar, BookOpen, CheckCircle
} from 'lucide-react'
import { useSubscription } from '../utils/enhancedSubscriptionStore'

const PricingPage = () => {
  const { plan, setPlan, isProcessing, upgradeToMonthly, upgradeToAnnual } = useSubscription()
  const [billingPeriod, setBillingPeriod] = useState('annual')
  
  const features = [
    { 
      category: 'AI & Insights',
      icon: Brain,
      free: false,
      premium: true,
      items: [
        { name: 'AI-Powered Case Analysis', free: false, premium: true },
        { name: 'Adjudicator Insights Dashboard', free: false, premium: true },
        { name: 'Risk Factor Assessment', free: false, premium: true }
      ]
    },
    { 
      category: 'Document Management',
      icon: FileText,
      free: true,
      premium: true,
      items: [
        { name: 'Document Upload & Storage', free: '50MB', premium: '1GB' },
        { name: 'OCR Text Extraction', free: false, premium: true },
        { name: 'AI Document Analysis', free: false, premium: true },
        { name: 'Auto-Classification', free: true, premium: true }
      ]
    },
    { 
      category: 'Form Generation',
      icon: BookOpen,
      free: true,
      premium: true,
      items: [
        { name: 'Immigration Form Templates', free: true, premium: true },
        { name: 'Form Auto-Fill', free: false, premium: true },
        { name: 'Unlimited Forms', free: false, premium: true },
        { name: 'Digital Signature', free: false, premium: true }
      ]
    },
    { 
      category: 'Interview Preparation',
      icon: Calendar,
      free: true,
      premium: true,
      items: [
        { name: 'Practice Questions', free: true, premium: true },
        { name: 'AI Mock Interview Simulator', free: false, premium: true },
        { name: 'Voice Recording & Analysis', free: false, premium: true },
        { name: 'Personalized Feedback', free: false, premium: true }
      ]
    },
    { 
      category: 'Attorney Services',
      icon: Users,
      free: true,
      premium: true,
      items: [
        { name: 'Attorney Directory Access', free: true, premium: true },
        { name: 'Priority Booking', free: false, premium: true },
        { name: 'Free Consultation Credit', free: false, premium: true },
        { name: 'Case Review Discounts', free: false, premium: true }
      ]
    },
    { 
      category: 'Support',
      icon: Shield,
      free: true,
      premium: true,
      items: [
        { name: 'Email Support', free: true, premium: true },
        { name: 'Priority Support', free: false, premium: true },
        { name: '24/7 Live Chat', free: false, premium: true },
        { name: 'Dedicated Account Manager', free: false, premium: false }
      ]
    }
  ]
  
  const handlePlanSelect = async (selectedPlan) => {
    if (selectedPlan === 'FREE') {
      setPlan('FREE')
    } else if (selectedPlan === 'PREMIUM_MONTHLY') {
      await upgradeToMonthly()
    } else if (selectedPlan === 'PREMIUM_ANNUAL') {
      await upgradeToAnnual()
    }
  }
  
  return (
    <div className="pricing-page" style={{ paddingBottom: 'var(--spacing-2xl)' }}>
      {/* Page Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-md)',
          fontSize: '2.5rem'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={28} color="white" />
          </div>
          Choose Your Plan
        </motion.h1>
        <p>
          Unlock the full power of AI-driven immigration guidance with Premium access
        </p>
      </motion.div>
      
      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-2xl)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          padding: 'var(--spacing-xs)',
          background: 'var(--bg-glass)',
          borderRadius: 'var(--radius-full)'
        }}>
          <button
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: billingPeriod === 'monthly' ? 'var(--gradient-primary)' : 'transparent',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: billingPeriod === 'annual' ? 'var(--gradient-primary)' : 'transparent',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              transition: 'all 0.3s ease'
            }}
          >
            Annual
            <span style={{
              padding: '2px 8px',
              background: 'var(--color-success)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem'
            }}>
              Save 33%
            </span>
          </button>
        </div>
      </motion.div>
      
      {/* Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-2xl)'
      }}>
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass"
          style={{
            padding: 'var(--spacing-xl)',
            border: plan === 'FREE' ? '2px solid var(--color-secondary)' : '1px solid var(--glass-border)',
            position: 'relative'
          }}
        >
          {plan === 'FREE' && (
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 16px',
              background: 'var(--color-secondary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'white'
            }}>
              Current Plan
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md)'
            }}>
              <Lock size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>Free</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
              $0
              <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/forever</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Essential features to get started
            </p>
          </div>
          
          <motion.button
            onClick={() => handlePlanSelect('FREE')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'default',
              marginBottom: 'var(--spacing-xl)'
            }}
          >
            Your Current Plan
          </motion.button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {['Basic Case Tracking', '50MB Document Storage', '3 Forms/month', 'Knowledge Base Access', 'Attorney Directory'].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                fontSize: '0.875rem'
              }}>
                <Check size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Premium Monthly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass"
          style={{
            padding: 'var(--spacing-xl)',
            border: plan === 'PREMIUM_MONTHLY' ? '2px solid var(--color-warning)' : '1px solid rgba(245, 158, 11, 0.3)',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
          }}
        >
          {plan === 'PREMIUM_MONTHLY' && (
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 16px',
              background: 'var(--color-warning)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#000'
            }}>
              Current Plan
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
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
              <Sparkles size={32} style={{ color: 'var(--color-warning)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>Premium</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
              $29.99
              <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/month</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Full AI-powered immigration support
            </p>
          </div>
          
          <motion.button
            onClick={() => handlePlanSelect('PREMIUM_MONTHLY')}
            disabled={isProcessing || plan === 'PREMIUM_MONTHLY'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: plan === 'PREMIUM_MONTHLY' ? 'var(--color-success)' : 'linear-gradient(135deg, var(--color-warning) 0%, #F97316 100%)',
              color: plan === 'PREMIUM_MONTHLY' ? 'white' : '#000',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: isProcessing || plan === 'PREMIUM_MONTHLY' ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-xl)',
              boxShadow: plan !== 'PREMIUM_MONTHLY' ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            {plan === 'PREMIUM_MONTHLY' ? (
              <>
                <CheckCircle size={20} />
                Current Plan
              </>
            ) : isProcessing ? (
              <>
                <div className="spin" style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(0,0,0,0.3)',
                  borderTopColor: '#000',
                  borderRadius: '50%'
                }} />
                Processing...
              </>
            ) : (
              <>
                <Crown size={20} />
                Select Monthly - $29.99/mo
              </>
            )}
          </motion.button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {['Everything in Free', 'AI Case Analysis', 'Unlimited Forms', 'Mock Interview Simulator', 'Priority Support', '1GB Storage'].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                fontSize: '0.875rem'
              }}>
                <Check size={16} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Premium Annual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass"
          style={{
            padding: 'var(--spacing-xl)',
            border: plan === 'PREMIUM_ANNUAL' ? '2px solid var(--color-success)' : '1px solid rgba(16, 185, 129, 0.3)',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 16px',
            background: 'var(--color-success)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Star size={12} />
            Best Value
          </div>
          
          {plan === 'PREMIUM_ANNUAL' && (
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: 'var(--spacing-md)',
              padding: '4px 16px',
              background: 'var(--color-secondary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'white'
            }}>
              Current Plan
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md)'
            }}>
              <Crown size={32} style={{ color: 'var(--color-success)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>Premium Annual</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
              $249.99
              <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/year</span>
            </div>
            <p style={{ 
              color: 'var(--color-success)', 
              fontSize: '0.875rem',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Save $109 (33% off monthly)
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Full AI-powered immigration support
            </p>
          </div>
          
          <motion.button
            onClick={() => handlePlanSelect('PREMIUM_ANNUAL')}
            disabled={isProcessing || plan === 'PREMIUM_ANNUAL'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: plan === 'PREMIUM_ANNUAL' ? 'var(--color-success)' : 'var(--gradient-primary)',
              color: 'white',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: isProcessing || plan === 'PREMIUM_ANNUAL' ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-xl)',
              boxShadow: plan !== 'PREMIUM_ANNUAL' ? '0 4px 20px rgba(59, 130, 246, 0.5)' : 'none'
            }}
          >
            {plan === 'PREMIUM_ANNUAL' ? (
              <>
                <CheckCircle size={20} />
                Current Plan
              </>
            ) : isProcessing ? (
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
                <Zap size={20} />
                Select Annual - $249.99/yr
              </>
            )}
          </motion.button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {['Everything in Premium Monthly', 'Save $109 per year', 'Priority Processing', 'Extended Storage', 'VIP Support', 'Early Access to New Features'].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                fontSize: '0.875rem'
              }}>
                <Check size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Feature Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass"
        style={{ padding: 'var(--spacing-xl)' }}
      >
        <h3 style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
          Complete Feature Comparison
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem'
          }}>
            <thead>
              <tr>
                <th style={{
                  textAlign: 'left',
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--glass-border)',
                  color: 'var(--text-muted)',
                  fontWeight: '500'
                }}>Feature</th>
                <th style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--glass-border)',
                  fontWeight: '600'
                }}>Free</th>
                <th style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--glass-border)',
                  color: 'var(--color-warning)',
                  fontWeight: '600'
                }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, catIndex) => (
                <React.Fragment key={catIndex}>
                  <tr>
                    <td colSpan={3} style={{
                      padding: 'var(--spacing-md) var(--spacing-sm)',
                      background: 'var(--bg-glass)',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}>
                      <category.icon size={18} style={{ color: 'var(--color-secondary)' }} />
                      {category.category}
                    </td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr key={`${catIndex}-${itemIndex}`}>
                      <td style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderBottom: '1px solid var(--glass-border)',
                        paddingLeft: 'var(--spacing-2xl)'
                      }}>
                        {item.name}
                      </td>
                      <td style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderBottom: '1px solid var(--glass-border)'
                      }}>
                        {item.free === true ? (
                          <Check size={18} style={{ color: 'var(--color-success)' }} />
                        ) : item.free === false ? (
                          <X size={18} style={{ color: 'var(--text-muted)' }} />
                        ) : (
                          <span style={{ color: 'var(--text-secondary)' }}>{item.free}</span>
                        )}
                      </td>
                      <td style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderBottom: '1px solid var(--glass-border)'
                      }}>
                        {item.premium === true ? (
                          <Check size={18} style={{ color: 'var(--color-warning)' }} />
                        ) : (
                          <X size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--spacing-xl)',
          marginTop: 'var(--spacing-2xl)',
          flexWrap: 'wrap'
        }}
      >
        {[
          { icon: Shield, text: 'Secure Payment' },
          { icon: CreditCard, text: 'Stripe Powered' },
          { icon: Lock, text: '256-bit SSL' },
          { icon: CheckCircle, text: '30-Day Guarantee' }
        ].map((badge, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            <badge.icon size={18} />
            <span>{badge.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default PricingPage
