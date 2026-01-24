import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Home, Target, FolderOpen, FormInput,
  BarChart3, MapPin, MessageSquare, BookOpen,
  Users, CheckCircle, Crown, FileText, File,
  Briefcase, Clipboard, User, X, ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGlobalStore } from '../utils/enhancedStore'

const iconMap = {
  Home, Target, FolderOpen, FormInput, BarChart3, MapPin,
  MessageSquare, BookOpen, Users, CheckCircle, Crown,
  FileText, File, Briefcase, Clipboard, User
}

const SearchResultsDropdown = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const {
    globalSearchQuery,
    searchResults,
    isSearching,
    performGlobalSearch,
    clearSearch
  } = useGlobalStore()

  // Perform search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      performGlobalSearch(globalSearchQuery)
    }, 200)
    return () => clearTimeout(timer)
  }, [globalSearchQuery, performGlobalSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        clearSearch()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clearSearch])

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || File
    return <Icon size={16} />
  }

  const handleResultClick = (result) => {
    navigate(result.path)
    clearSearch()
  }

  if (!globalSearchQuery.trim()) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '400px',
          overflow: 'auto',
          zIndex: 1000
        }}
      >
        {/* Header */}
        <div style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '600'
          }}>
            {isSearching ? 'Searching...' : `${searchResults.length} results found`}
          </span>
          <button
            onClick={clearSearch}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px'
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        {searchResults.length > 0 ? (
          <div style={{ padding: 'var(--spacing-sm)' }}>
            {searchResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleResultClick(result)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-glass-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-secondary)',
                  flexShrink: 0
                }}>
                  {getIcon(result.icon)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {result.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {result.description}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  flexShrink: 0
                }}>
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {result.category}
                  </span>
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: 'var(--spacing-xl)',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <Search size={32} style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5 }} />
            <p style={{ fontSize: '0.875rem' }}>
              {isSearching ? 'Searching...' : 'No results found'}
            </p>
            <p style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)' }}>
              Try different keywords
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.625rem',
          color: 'var(--text-muted)'
        }}>
          <span>Press ESC to close</span>
          <span>Press Enter to search all</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SearchResultsDropdown
