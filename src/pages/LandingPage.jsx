import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Check, ArrowRight, Star, Clock, FileText,
  Users, Brain, Calendar, MessageSquare, Search, ChevronDown,
  ChevronUp, Play, Lock, Zap, Target, BookOpen, Fingerprint,
  BarChart3, Send, Twitter, Linkedin, Github, Mail, ExternalLink
} from 'lucide-react'

// ========================================
// LANDING PAGE COMPONENT
// ========================================
const LandingPage = () => {
  const navigate = useNavigate()
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [email, setEmail] = useState('')
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'AI Case Analysis',
      description: 'Get instant insights about your immigration case probability with our advanced AI engine trained on 50,000+ successful applications.',
      color: '#3B82F6'
    },
    {
      icon: FileText,
      title: 'Smart Document Manager',
      description: 'Upload, organize, and analyze documents with OCR technology. Never miss a required form or deadline again.',
      color: '#8B5CF6'
    },
    {
      icon: Calendar,
      title: 'Mock Interview Prep',
      description: 'Practice with our AI interview simulator. Get real-time feedback on your answers and body language.',
      color: '#10B981'
    },
    {
      icon: Users,
      title: 'Attorney Connection',
      description: 'Connect with verified immigration attorneys. Book consultations and get expert guidance for complex cases.',
      color: '#F59E0B'
    },
    {
      icon: Target,
      title: 'Form Auto-Fill',
      description: 'Stop filling out the same information repeatedly. Our AI auto-fills forms based on your profile data.',
      color: '#EF4444'
    },
    {
      icon: BarChart3,
      title: 'Case Tracking',
      description: 'Track your case status in real-time. Get notifications when there are updates from USCIS.',
      color: '#06B6D4'
    }
  ]

  const testimonials = [
    {
      name: 'Maria Santos',
      status: 'H-1B to Green Card',
      avatar: 'MS',
      quote: 'VisaGuideAi helped me understand exactly what documents I needed. Got my H-1B approval on the first try!',
      rating: 5
    },
    {
      name: 'James Chen',
      status: 'Marriage Green Card',
      avatar: 'JC',
      quote: 'The interview prep was incredible. I walked into my interview confident and prepared. Highly recommend!',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      status: 'Citizenship Approved',
      avatar: 'PS',
      quote: 'The AI insights helped me identify gaps in my application before submitting. Saved me months of waiting.',
      rating: 5
    }
  ]

  const stats = [
    { value: '50,000+', label: 'Applications Analyzed' },
    { value: '94%', label: 'Success Rate' },
    { value: '10,000+', label: 'Happy Users' },
    { value: '24/7', label: 'AI Support' }
  ]

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Enter your basic information and immigration goals. Our AI learns your unique situation.'
    },
    {
      number: '02',
      title: 'Upload Documents',
      description: 'Snap photos or upload PDFs. Our OCR extracts and organizes everything automatically.'
    },
    {
      number: '03',
      title: 'Get AI Insights',
      description: 'Receive personalized recommendations, risk assessments, and actionable next steps.'
    },
    {
      number: '04',
      title: 'Connect & Succeed',
      description: 'Book attorneys, practice interviews, and track your journey to immigration success.'
    }
  ]

  const faqs = [
    {
      question: 'Is VisaGuideAi a replacement for an attorney?',
      answer: 'No, VisaGuideAi is not a replacement for legal counsel. We provide AI-powered guidance and tools to help you navigate the immigration process more effectively. For complex legal matters, we always recommend consulting with a licensed immigration attorney.'
    },
    {
      question: 'How accurate is the AI case analysis?',
      answer: 'Our AI model is trained on extensive data from successful immigration cases and current regulations. While we strive for high accuracy, case outcomes depend on many factors. Our insights are designed to help you identify potential issues before they become problems.'
    },
    {
      question: 'Can I use VisaGuideAi on mobile?',
      answer: 'Yes! VisaGuideAi is fully responsive and works great on all devices. We also have dedicated mobile apps coming soon for iOS and Android.'
    },
    {
      question: 'What happens if my case is denied?',
      answer: 'If your case is denied, VisaGuideAi can help you understand the reasons and explore options. We also provide connections to immigration attorneys who specialize in appeals and reconsiderations.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption and are fully GDPR compliant. Your personal information and documents are never shared without your explicit consent.'
    }
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="landing-page">
      {/* ========================================
          NAVBAR
      ======================================== */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Shield size={32} />
            <span>VisaGuide<span style={{ color: 'var(--color-secondary)' }}>AI</span></span>
          </motion.div>
          
          <div className="nav-links">
            <button onClick={() => scrollToSection('features')}>Features</button>
            <button onClick={() => scrollToSection('how-it-works')}>How it Works</button>
            <button onClick={() => scrollToSection('pricing')}>Pricing</button>
            <button onClick={() => scrollToSection('testimonials')}>Reviews</button>
          </div>
          
          <div className="nav-actions">
            <button 
              className="nav-btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Log In
            </button>
            <button 
              className="nav-btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================
          HERO SECTION
      ======================================== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-grid" />
        </div>
        
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              <span className="badge-dot" />
              Trusted by 10,000+ immigrants worldwide
            </div>
            
            <h1 className="hero-title">
              Navigate Your Immigration Journey with{' '}
              <span className="gradient-text">AI-Powered</span> Confidence
            </h1>
            
            <p className="hero-subtitle">
              From visa applications to citizenship exams, get personalized guidance, 
              document analysis, and expert attorney connections—all in one powerful platform.
            </p>
            
            <div className="hero-actions">
              <motion.button 
                className="hero-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
              >
                Start Free Assessment
                <ArrowRight size={20} />
              </motion.button>
              
              <motion.button 
                className="hero-btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Open video modal or navigate to demo
                  window.open('https://www.youtube.com', '_blank')
                }}
              >
                <Play size={20} />
                Watch Demo
              </motion.button>
            </div>
            
            <div className="hero-trust">
              <div className="trust-avatars">
                {['MS', 'JC', 'PS', 'AK', 'MR'].map((avatar, i) => (
                  <div key={i} className="trust-avatar">{avatar}</div>
                ))}
              </div>
              <div className="trust-text">
                <div className="trust-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <span>Rated 4.9/5 by 2,000+ users</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span /><span /><span />
                </div>
                <span className="card-title">Case Analysis</span>
              </div>
              <div className="card-content">
                <div className="analysis-score">
                  <div className="score-circle">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="score-bg" />
                      <circle cx="50" cy="50" r="45" className="score-progress" style={{ strokeDashoffset: 28 }} />
                    </svg>
                    <div className="score-value">
                      <span className="score-number">94%</span>
                      <span className="score-label">Approval</span>
                    </div>
                  </div>
                </div>
                <div className="analysis-details">
                  <div className="detail-item">
                    <Check size={16} style={{ color: '#10B981' }} />
                    <span>Strong documentation</span>
                  </div>
                  <div className="detail-item">
                    <Check size={16} style={{ color: '#10B981' }} />
                    <span>Clean background check</span>
                  </div>
                  <div className="detail-item">
                    <Check size={16} style={{ color: '#10B981' }} />
                    <span>Complete forms</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="floating-card card-1">
              <div className="floating-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <FileText size={20} style={{ color: '#10B981' }} />
              </div>
              <span>Form I-485 Ready</span>
            </div>
            
            <div className="floating-card card-2">
              <div className="floating-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                <Calendar size={20} style={{ color: '#3B82F6' }} />
              </div>
              <span>Interview: Jan 15</span>
            </div>
          </motion.div>
        </div>
        
        <div className="hero-trust-strip">
          <p>Trusted by immigrants from</p>
          <div className="trust-countries">
            {['🇺🇸 USA', '🇨🇦 Canada', '🇬🇧 UK', '🇦🇺 Australia', '🇩🇪 Germany', '🇫🇷 France', '🇮🇳 India', '🇧🇷 Brazil'].map((country, i) => (
              <span key={i}>{country}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          STATS SECTION
      ======================================== */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================
          FEATURES SECTION
      ======================================== */}
      <section id="features" className="features-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              Powerful AI tools designed specifically for immigrants navigating the U.S. immigration system.
            </p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon" style={{ background: `${feature.color}20` }}>
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS SECTION
      ======================================== */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Get Started in 4 Simple Steps</h2>
            <p className="section-subtitle">
              Our intuitive platform guides you through every stage of your immigration journey.
            </p>
          </motion.div>
          
          <div className="steps-container">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="step-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < steps.length - 1 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          TESTIMONIALS SECTION
      ======================================== */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">Success Stories from Real Users</h2>
            <p className="section-subtitle">
              Join thousands of immigrants who have successfully navigated their journey with VisaGuideAi.
            </p>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div>
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <span className="testimonial-status">{testimonial.status}</span>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          PRICING SECTION
      ======================================== */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Pricing</span>
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">
              Choose the plan that's right for you. Upgrade or downgrade anytime.
            </p>
          </motion.div>
          
          <div className="pricing-grid">
            {/* Free Plan */}
            <motion.div 
              className="pricing-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="pricing-header">
                <h3 className="pricing-name">Free</h3>
                <div className="pricing-price">
                  <span className="price-amount">$0</span>
                  <span className="price-period">/forever</span>
                </div>
                <p className="pricing-description">Essential tools to get started</p>
              </div>
              <div className="pricing-features">
                {['Basic case tracking', '50MB document storage', '3 forms per month', 'Knowledge base access', 'Attorney directory'].map((feature, i) => (
                  <div key={i} className="pricing-feature">
                    <Check size={18} style={{ color: '#10B981' }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <motion.button 
                className="pricing-btn secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
              >
                Get Started Free
              </motion.button>
            </motion.div>
            
            {/* Premium Plan */}
            <motion.div 
              className="pricing-card featured"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Premium</h3>
                <div className="pricing-price">
                  <span className="price-amount">$29.99</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="pricing-description">Complete AI-powered immigration support</p>
              </div>
              <div className="pricing-features">
                {['Everything in Free', 'AI case analysis', 'Unlimited form generation', 'Mock interview simulator', 'Priority attorney booking', '1GB storage', '24/7 support'].map((feature, i) => (
                  <div key={i} className="pricing-feature">
                    <Check size={18} style={{ color: '#F59E0B' }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <motion.button 
                className="pricing-btn primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
              >
                Start Free Trial
              </motion.button>
            </motion.div>
            
            {/* Annual Plan */}
            <motion.div 
              className="pricing-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="pricing-badge savings">Save 33%</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Premium Annual</h3>
                <div className="pricing-price">
                  <span className="price-amount">$249.99</span>
                  <span className="price-period">/year</span>
                </div>
                <p className="pricing-description">Best value for long-term users</p>
              </div>
              <div className="pricing-features">
                {['Everything in Premium', 'Save $109 per year', 'Priority processing', 'Extended storage', 'VIP support'].map((feature, i) => (
                  <div key={i} className="pricing-feature">
                    <Check size={18} style={{ color: '#10B981' }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <motion.button 
                className="pricing-btn secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
              >
                Go Annual & Save
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================
          FAQ SECTION
      ======================================== */}
      <section className="faq-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Have questions? We've got answers. If you don't see your question here, feel free to contact us.
            </p>
          </motion.div>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button 
                  className="faq-question"
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  {activeFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {activeFAQ === index && (
                    <motion.div 
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          CTA SECTION
      ======================================== */}
      <section className="cta-section">
        <div className="cta-container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to Start Your Immigration Journey?</h2>
            <p className="cta-subtitle">
              Join thousands of immigrants who have successfully navigated their path to the United States with VisaGuideAi.
            </p>
            <div className="cta-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cta-input"
              />
              <motion.button 
                className="cta-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (email) {
                    // In a real app, this would sign up the user
                    navigate('/dashboard')
                  }
                }}
              >
                Get Started Free
                <ArrowRight size={20} />
              </motion.button>
            </div>
            <p className="cta-note">No credit card required. Start free today.</p>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          FOOTER
      ======================================== */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <Shield size={28} />
                <span>VisaGuideAI</span>
              </div>
              <p className="footer-tagline">
                Your AI-powered guide to navigating the U.S. immigration system with confidence.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link"><Twitter size={20} /></a>
                <a href="#" className="social-link"><Linkedin size={20} /></a>
                <a href="#" className="social-link"><Github size={20} /></a>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#">Case Tracking</a>
                <a href="#">Document Manager</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Knowledge Base</a>
                <a href="#">Immigration Guides</a>
                <a href="#">Blog</a>
                <a href="#">Help Center</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
                <a href="#">Disclaimer</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 VisaGuideAI. All rights reserved.</p>
            <div className="footer-badges">
              <span className="badge">🔒 SSL Secured</span>
              <span className="badge">✓ GDPR Compliant</span>
              <span className="badge">🛡️ Bank-Level Encryption</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
