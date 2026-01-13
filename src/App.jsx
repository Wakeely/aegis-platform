import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Home, FileText, FolderOpen, FormInput,
  BarChart3, MapPin, MessageSquare, BookOpen,
  Users, CheckCircle, Search, Bell, Sun, Moon,
  Menu, X, Bot, Target, Check, AlertTriangle, Info,
  Lock, Crown, ArrowRight
} from 'lucide-react'

import { useThemeStore, useGlobalStore, useUserStore } from './utils/enhancedStore'
import { useSubscriptionStore } from './utils/subscriptionStore'

// Import Pages
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import EligibilityNavigator from './pages/EligibilityNavigator'
import DocumentManagement from './pages/DocumentManagement'
import FormGeneration from './pages/FormGeneration'
import AdjudicatorInsights from './pages/AdjudicatorInsights'
import CaseTracking from './pages/CaseTracking'
import InterviewPrep from './pages/InterviewPrep'
import KnowledgeBase from './pages/KnowledgeBase'
import AttorneyIntegration from './pages/AttorneyIntegration'
import PostApproval from './pages/PostApproval'
import Pricing from './pages/Pricing'

// Toast Notification Component
const ToastContainer = () => {
  const { notifications, removeNotification } = useGlobalStore()

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <Check size={18} />
      case 'error': return <X size={18} />
      case 'warning': return <AlertTriangle size={18} />
      default: return <Info size={18} />
    }
  }

  const getColors = (type) => {
    switch (type) {
      case 'success': return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', text: '#10B981' }
      case 'error': return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#EF4444' }
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#F59E0B' }
      default: return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#3B82F6' }
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '400px'
    }}>
      <AnimatePresence>
        {notifications.map((notification) => {
          const colors = getColors(notification.type)
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                {getIcon(notification.type)}
              </div>
              <div style={{ flex: 1 }}>
                {notification.title && (
                  <div style={{
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                  }}>
                    {notification.title}
                  </div>
                )}
                <div style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}>
                  {notification.message}
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const { plan } = useSubscriptionStore()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/eligibility', label: 'Eligibility Navigator', icon: Target },
    { path: '/documents', label: 'Document Management', icon: FolderOpen },
    { path: '/forms', label: 'Form Generation', icon: FormInput },
    { path: '/adjudicator', label: 'Adjudicator Insights', icon: BarChart3, premium: true },
    { path: '/cases', label: 'Case Tracking', icon: MapPin },
    { path: '/interview', label: 'Interview Prep', icon: MessageSquare },
    { path: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { path: '/attorneys', label: 'Attorney Connection', icon: Users },
    { path: '/post-approval', label: 'Post-Approval', icon: CheckCircle, premium: true }
  ]

  const isLocked = (item) => item.premium && plan === 'FREE'

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 99,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease'
        }}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Shield size={48} />
          <h1>AEGIS</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main Menu</span>
            {navItems.slice(0, 5).map(item => (
              <NavLink
                key={item.path}
                to={isLocked(item) ? '/pricing' : item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${isLocked(item) ? 'locked' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {isLocked(item) && <Lock size={14} style={{ marginLeft: 'auto', color: 'var(--color-warning)' }} />}
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Resources</span>
            {navItems.slice(5).map(item => (
              <NavLink
                key={item.path}
                to={isLocked(item) ? '/pricing' : item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${isLocked(item) ? 'locked' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {isLocked(item) && <Lock size={14} style={{ marginLeft: 'auto', color: 'var(--color-warning)' }} />}
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">Account</span>
            <NavLink
              to="/pricing"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Crown size={20} />
              <span>Upgrade to Premium</span>
            </NavLink>
          </div>
        </nav>

        <div style={{
          marginTop: 'auto',
          paddingTop: '20px',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: plan === 'FREE' ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'linear-gradient(135deg, #F59E0B, #F97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                  {plan === 'FREE' ? 'AEGIS AI' : 'Premium AI'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-success)' }}>● Online</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {plan === 'FREE' ? '9 Specialist Agents Ready' : 'Full AI Access Enabled'}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// Top Bar Component
const TopBar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { user } = useUserStore()
  const { notifications, globalSearchQuery, setGlobalSearch } = useGlobalStore()
  const { plan } = useSubscriptionStore()
  const navigate = useNavigate()

  return (
    <header className="top-bar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="top-bar-left">
        <button 
          className="icon-button mobile-menu-button" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        <div className="agent-status" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '24px'
        }}>
          <div className="agent-orb" style={{
            width: '10px',
            height: '10px',
            background: 'var(--color-success)',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {plan === 'FREE' ? 'AEGIS Navigator Active' : 'Premium AI Active'}
          </span>
        </div>
      </div>

      <div className="search-container" style={{ position: 'relative', width: '400px' }}>
        <Search size={20} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }} />
        <input
          type="text"
          className="glass-input"
          placeholder="Search forms, documents, cases..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearch(e.target.value)}
          style={{ paddingLeft: '48px' }}
        />
      </div>

      <div className="top-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Back to Home Button */}
        <button 
          className="icon-button"
          onClick={() => navigate('/')}
          title="Go to Landing Page"
        >
          <Shield size={20} />
        </button>

        {/* Premium Badge */}
        {plan !== 'FREE' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-warning)',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            <Crown size={14} />
            PREMIUM
          </div>
        )}

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="icon-button">
            <Bell size={20} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                background: 'var(--color-danger)',
                borderRadius: '50%',
                fontSize: '11px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Theme Toggle */}
        <button className="icon-button" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Avatar */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: plan === 'FREE' 
            ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' 
            : 'linear-gradient(135deg, #F59E0B, #F97316)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          color: 'white',
          cursor: 'pointer',
          border: '2px solid var(--glass-border)'
        }}>
          {user.avatar}
        </div>
      </div>
    </header>
  )
}

// Page Transition Component
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    style={{ height: '100%' }}
  >
    {children}
  </motion.div>
)

// Scroll to top component
const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return null
}

// Protected Route Component for Premium Pages
const ProtectedRoute = ({ children, requirePremium = false }) => {
  const { plan } = useSubscriptionStore()

  if (requirePremium && plan === 'FREE') {
    return <Navigate to="/pricing" replace />
  }

  return children
}

// Dashboard Layout Component
// This wraps all authenticated app pages with the sidebar and topbar
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="main-content">
        <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/dashboard" element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } />
            <Route path="/eligibility" element={
              <PageTransition>
                <EligibilityNavigator />
              </PageTransition>
            } />
            <Route path="/documents" element={
              <PageTransition>
                <DocumentManagement />
              </PageTransition>
            } />
            <Route path="/forms" element={
              <PageTransition>
                <FormGeneration />
              </PageTransition>
            } />
            <Route path="/adjudicator" element={
              <PageTransition>
                <ProtectedRoute requirePremium>
                  <AdjudicatorInsights />
                </ProtectedRoute>
              </PageTransition>
            } />
            <Route path="/cases" element={
              <PageTransition>
                <CaseTracking />
              </PageTransition>
            } />
            <Route path="/interview" element={
              <PageTransition>
                <InterviewPrep />
              </PageTransition>
            } />
            <Route path="/knowledge" element={
              <PageTransition>
                <KnowledgeBase />
              </PageTransition>
            } />
            <Route path="/attorneys" element={
              <PageTransition>
                <AttorneyIntegration />
              </PageTransition>
            } />
            <Route path="/post-approval" element={
              <PageTransition>
                <ProtectedRoute requirePremium>
                  <PostApproval />
                </ProtectedRoute>
              </PageTransition>
            } />
            <Route path="/pricing" element={
              <PageTransition>
                <Pricing />
              </PageTransition>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

// Main App Component
const App = () => {
  const { theme } = useThemeStore()
  const { setGlobalLoading } = useGlobalStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Simulate initial loading
  useEffect(() => {
    setGlobalLoading(true)
    const timer = setTimeout(() => {
      setGlobalLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [setGlobalLoading])

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Landing Page Route - No sidebar or topbar */}
        <Route path="/" element={<LandingPage />} />
        
        {/* All other routes use the Dashboard Layout */}
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  )
}

export default App
