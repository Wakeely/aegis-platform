import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FolderOpen, Upload, FileText, FileCheck, FileX, 
  Trash2, Eye, Download, Search, Filter, CheckCircle,
  Clock, AlertCircle, Image, File, FileSpreadsheet, FileType,
  Briefcase, Sparkles, Scan, Check, X, Loader2
} from 'lucide-react'
import { 
  useDocumentStore,
  useGlobalStore 
} from '../utils/enhancedStore'

const DocumentManagement = () => {
  const { 
    documents, 
    addDocument, 
    removeDocument, 
    updateUploadProgress,
    completeUpload,
    finalizeDocument,
    getStorageUsage,
    folders
  } = useDocumentStore()
  const { addNotification } = useGlobalStore()
  
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [scanningDoc, setScanningDoc] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  
  const fileInputRef = useRef(null)

  const categoryColors = {
    identity: '#3B82F6',
    relationship: '#EC4899',
    employment: '#8B5CF6',
    financial: '#14B8A6',
    medical: '#F59E0B',
    travel: '#06B6D4'
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }, [])

  const handleFiles = useCallback((files) => {
    files.forEach(file => {
      const uploadId = Date.now() + Math.random()
      
      // Add to uploading queue
      setUploadingFiles(prev => [...prev, {
        id: uploadId,
        name: file.name,
        size: formatFileSize(file.size),
        progress: 0,
        status: 'uploading'
      }])
      
      // Simulate upload progress
      simulateUpload(uploadId, file)
    })
    
    addNotification({
      type: 'success',
      title: 'Upload Started',
      message: `Processing ${files.length} file(s)...`
    })
  }, [addNotification])

  const simulateUpload = (uploadId, file) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        // Complete upload
        setUploadingFiles(prev => prev.map(f => 
          f.id === uploadId ? { ...f, progress: 100, status: 'processing' } : f
        ))
        
        // Process document
        const category = categorizeDocument(file.name)
        const extractedData = {
          pages: Math.floor(Math.random() * 5) + 1,
          textExtracted: `${file.name} - Immigration Document`,
          confidence: Math.floor(Math.random() * 15) + 85
        }
        
        addDocument({
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
          category,
          status: 'verified',
          uploadedAt: new Date().toISOString(),
          extractedData
        })
        
        // Remove from uploading
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId))
          addNotification({
            type: 'success',
            title: 'Document Processed',
            message: `${file.name} has been verified and added to your documents.`
          })
        }, 500)
      } else {
        setUploadingFiles(prev => prev.map(f => 
          f.id === uploadId ? { ...f, progress: Math.min(progress, 99) } : f
        ))
      }
    }, 150)
  }

  const categorizeDocument = (filename) => {
    const lower = filename.toLowerCase()
    if (lower.includes('passport') || lower.includes('license') || lower.includes('id') || lower.includes('birth')) return 'identity'
    if (lower.includes('marriage') || lower.includes('divorce') || lower.includes('spouse')) return 'relationship'
    if (lower.includes('employment') || lower.includes('letter') || lower.includes('pay') || lower.includes('w2')) return 'employment'
    if (lower.includes('tax') || lower.includes('bank') || lower.includes('financial') || lower.includes('statement')) return 'financial'
    if (lower.includes('medical') || lower.includes('health') || lower.includes('vaccination') || lower.includes('doctor')) return 'medical'
    if (lower.includes('travel') || lower.includes('flight') || lower.includes('ticket')) return 'travel'
    return 'identity'
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFileIcon = (filename) => {
    const lower = filename.toLowerCase()
    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) return Image
    if (lower.match(/\.(pdf)$/)) return FileText
    if (lower.match(/\.(xlsx|xls|csv)$/)) return FileSpreadsheet
    return File
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const storageUsage = getStorageUsage()

  const documentStats = {
    total: documents.length,
    verified: documents.filter(d => d.status === 'verified').length,
    pending: documents.filter(d => d.status === 'pending' || d.status === 'uploading').length,
    rejected: documents.filter(d => d.status === 'rejected').length
  }

  const requiredDocuments = [
    { item: 'Passport (Valid)', category: 'identity', required: true },
    { item: 'Birth Certificate', category: 'identity', required: true },
    { item: 'Marriage Certificate', category: 'relationship', required: true },
    { item: 'Police Certificates', category: 'identity', required: true },
    { item: 'Medical Examination', category: 'medical', required: true },
    { item: 'Tax Returns (3 years)', category: 'financial', required: true },
    { item: 'Employment Letters', category: 'employment', required: true },
    { item: 'Bank Statements', category: 'financial', required: true }
  ]

  const checkDocumentExists = (category) => {
    return documents.some(doc => doc.category === category && doc.status === 'verified')
  }

  return (
    <div className="document-management">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          AI-Augmented Document Management
        </motion.h1>
        <p>Upload, organize, and analyze your immigration documents with AI-powered verification and OCR processing.</p>
      </div>

      {/* Storage Usage */}
      <motion.div 
        className="glass"
        style={{ 
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xl)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Storage Used</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              {(storageUsage.used / (1024 * 1024)).toFixed(2)} MB / 500 MB
            </span>
          </div>
          <div style={{ 
            height: '6px', 
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
              animate={{ width: `${storageUsage.percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-lg)',
          paddingLeft: 'var(--spacing-xl)',
          borderLeft: '1px solid var(--glass-border)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-secondary)' }}>{documentStats.total}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>{documentStats.verified}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="dashboard-grid four-col" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {[
          { label: 'Total Documents', value: documentStats.total, icon: FolderOpen, color: 'var(--color-secondary)' },
          { label: 'Verified', value: documentStats.verified, icon: CheckCircle, color: 'var(--color-success)' },
          { label: 'Processing', value: documentStats.pending, icon: Loader2, color: 'var(--color-warning)' },
          { label: 'Action Required', value: documentStats.rejected, icon: AlertCircle, color: 'var(--color-danger)' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="stat-icon" style={{ background: `${stat.color}20` }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Upload Zone */}
      <motion.div 
        className={`dropzone ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ 
          marginBottom: 'var(--spacing-xl)',
          border: isDragOver ? '2px dashed var(--color-secondary)' : '2px dashed var(--glass-border)',
          background: isDragOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Upload size={64} />
        <h3>Drop files here or click to upload</h3>
        <p>Support for PDF, JPG, PNG up to 10MB each • AI will automatically categorize and verify</p>
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
      </motion.div>

      {/* Uploading Queue */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            className="glass"
            style={{ 
              padding: 'var(--spacing-lg)', 
              marginBottom: 'var(--spacing-xl)'
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <Scan size={20} style={{ color: 'var(--color-secondary)' }} />
              <h4 style={{ margin: 0 }}>Processing Documents</h4>
              <span style={{ 
                fontSize: '0.75rem',
                padding: '2px 8px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--color-secondary)'
              }}>
                AI Processing
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {uploadingFiles.map((file) => (
                <div key={file.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-sm)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>{file.name}</div>
                    <div style={{ 
                      height: '4px',
                      background: 'var(--bg-dark)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <motion.div 
                        style={{ 
                          height: '100%',
                          background: file.status === 'processing' 
                            ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)' 
                            : 'var(--color-secondary)'
                        }}
                        animate={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {Math.round(file.progress)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          <button
            className={`glass-button ${selectedCategory === 'all' ? 'primary' : ''}`}
            onClick={() => setSelectedCategory('all')}
            style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
          >
            <FolderOpen size={16} />
            All
          </button>
          {folders.map(folder => (
            <button
              key={folder.id}
              className={`glass-button ${selectedCategory === folder.id ? 'primary' : ''}`}
              onClick={() => setSelectedCategory(folder.id)}
              style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
            >
              {folder.icon === 'file-text' && <FileText size={16} />}
              {folder.icon === 'heart' && <FileCheck size={16} />}
              {folder.icon === 'briefcase' && <Briefcase size={16} />}
              {folder.icon === 'dollar-sign' && <FileSpreadsheet size={16} />}
              {folder.icon === 'activity' && <FileType size={16} />}
              {folder.icon === 'plane' && <FileType size={16} />}
              {folder.name.replace(' Documents', '')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              className="glass-input"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <button 
            className="glass-button"
            onClick={() => setShowScanner(!showScanner)}
            style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
          >
            <Sparkles size={16} />
            AI Scan
          </button>
        </div>
      </div>

      {/* Document Grid */}
      {documents.length === 0 && uploadingFiles.length === 0 ? (
        <div className="glass" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
          <FolderOpen size={64} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-lg)' }} />
          <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No Documents Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Upload your first document to get started with AI-powered analysis and verification.
          </p>
          <motion.button 
            className="glass-button primary"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload size={18} />
            Upload Documents
          </motion.button>
        </div>
      ) : (
        <motion.div 
          className="document-grid"
          style={{ 
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(240px, 1fr))' : '1fr',
            display: 'grid',
            gap: 'var(--spacing-md)'
          }}
          layout
        >
          <AnimatePresence>
            {filteredDocuments.map((doc, index) => {
              const FileIcon = getFileIcon(doc.name)
              return (
                <motion.div
                  key={doc.id}
                  className="glass document-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -4 }}
                  style={{ padding: 'var(--spacing-lg)', cursor: 'pointer' }}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div style={{ 
                    width: '64px', 
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    background: `${categoryColors[doc.category] || 'var(--color-secondary)'}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--spacing-md)',
                    color: categoryColors[doc.category] || 'var(--color-secondary)'
                  }}>
                    <FileIcon size={32} />
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 'var(--spacing-xs)',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    <span style={{ 
                      padding: '2px 8px',
                      background: `${categoryColors[doc.category] || 'var(--color-secondary)'}20`,
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: categoryColors[doc.category] || 'var(--color-secondary)',
                      textTransform: 'capitalize'
                    }}>
                      {doc.category}
                    </span>
                    {doc.status === 'verified' && (
                      <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                    )}
                  </div>

                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    marginBottom: 'var(--spacing-xs)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'center'
                  }}>
                    {doc.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
                    {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>

                  {doc.extractedData && (
                    <div style={{ 
                      marginTop: 'var(--spacing-sm)',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--color-success)',
                      textAlign: 'center'
                    }}>
                      {doc.extractedData.confidence}% confidence
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--spacing-xs)',
                    marginTop: 'var(--spacing-md)',
                    paddingTop: 'var(--spacing-md)',
                    borderTop: '1px solid var(--glass-border)'
                  }}>
                    <button 
                      className="glass-button" 
                      style={{ flex: 1, padding: 'var(--spacing-xs)' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDoc(doc)
                      }}
                    >
                      <Eye size={14} />
                    </button>
                    <button className="glass-button" style={{ flex: 1, padding: 'var(--spacing-xs)' }}>
                      <Download size={14} />
                    </button>
                    <button 
                      className="glass-button"
                      style={{ padding: 'var(--spacing-xs)', color: 'var(--color-danger)' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeDocument(doc.id)
                        addNotification({
                          type: 'info',
                          title: 'Document Removed',
                          message: `${doc.name} has been removed.`
                        })
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Required Documents Checklist */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ margin: 0 }}>Required Documents Checklist</h3>
          <div style={{ 
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            {requiredDocuments.filter(d => checkDocumentExists(d.category)).length} / {requiredDocuments.length} collected
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
          {requiredDocuments.map((doc, index) => {
            const hasDoc = checkDocumentExists(doc.category)
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-md)',
                  background: hasDoc ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${hasDoc ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'}`,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (!hasDoc) {
                    fileInputRef.current?.click()
                  }
                }}
              >
                <div style={{ 
                  width: '28px', 
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  background: hasDoc ? 'var(--color-success)' : 'var(--bg-dark)',
                  border: hasDoc ? 'none' : '2px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {hasDoc && <Check size={16} color="white" />}
                </div>
                <span style={{ 
                  fontSize: '0.875rem',
                  color: hasDoc ? 'var(--color-success)' : 'var(--text-primary)'
                }}>
                  {doc.item}
                </span>
                {!hasDoc && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Upload
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 'var(--spacing-xl)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              className="glass"
              style={{ 
                width: '100%', 
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
                padding: 'var(--spacing-xl)'
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                  <h2>{selectedDoc.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                    Uploaded {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  className="glass-button"
                  onClick={() => setSelectedDoc(null)}
                  style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {selectedDoc.extractedData && (
                <div style={{ 
                  marginBottom: 'var(--spacing-xl)',
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <h4 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Sparkles size={18} style={{ color: 'var(--color-secondary)' }} />
                    AI Analysis Results
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Confidence Score</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
                        {selectedDoc.extractedData.confidence}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pages Detected</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                        {selectedDoc.extractedData.pages}
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Extracted Text</div>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-secondary)',
                        margin: 0,
                        padding: 'var(--spacing-sm)',
                        background: 'var(--bg-dark)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        {selectedDoc.extractedData.textExtracted}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button className="glass-button primary" style={{ flex: 1 }}>
                  <Download size={18} />
                  Download
                </button>
                <button 
                  className="glass-button"
                  style={{ color: 'var(--color-danger)' }}
                  onClick={() => {
                    removeDocument(selectedDoc.id)
                    setSelectedDoc(null)
                  }}
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DocumentManagement
