import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Upload, X, Scan, Check, FileText, 
  RotateCcw, Crop, ArrowLeft, ArrowRight,
  Loader2, Zap, Image as ImageIcon, Download
} from 'lucide-react'
import { useGlobalStore } from '../utils/enhancedStore'

const DocumentScanner = () => {
  const { addNotification } = useGlobalStore()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [activeTab, setActiveTab] = useState('camera')
  const [isScanning, setIsScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [processedResult, setProcessedResult] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [scanProgress, setScanProgress] = useState(0)

  // Initialize camera
  useEffect(() => {
    if (activeTab === 'camera' && !capturedImage && !processedResult) {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [activeTab])

  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setCameraError('Unable to access camera. Please ensure camera permissions are granted or use upload mode.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      const imageData = canvas.toDataURL('image/png')
      setCapturedImage(imageData)
      stopCamera()
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target.result)
        setActiveTab('preview')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setProcessedResult(null)
    setScanProgress(0)
    if (activeTab === 'camera') {
      startCamera()
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setScanProgress(0)
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          processDocument()
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const processDocument = () => {
    setIsProcessing(true)
    
    // Simulate OCR processing with realistic extracted text
    setTimeout(() => {
      const extractedText = {
        documentType: 'Passport',
        confidence: 98.7,
        extractedData: {
          documentNumber: 'A12345678',
          surname: 'JOHNSON',
          givenNames: 'MICHAEL ROBERT',
          nationality: 'UNITED STATES OF AMERICA',
          dateOfBirth: '15 MAR 1985',
          sex: 'M',
          dateOfIssue: '10 JAN 2023',
          dateOfExpiration: '09 JAN 2033',
          mrzLine1: 'P<USAJOHNSON<<MICHAEL<ROBERT<<<<<<<<<<<<<<<',
          mrzLine2: 'A12345678<4USA8503159M2901099<<<<<<<<<<<<<<<08'
        },
        extractedText: `PASSPORT
Document Number: A12345678
Surname: JOHNSON
Given Names: MICHAEL ROBERT
Nationality: UNITED STATES OF AMERICA
Date of Birth: 15 MAR 1985
Sex: M
Date of Issue: 10 JAN 2023
Date of Expiration: 09 JAN 2033

Machine Readable Zone (MRZ):
P<USAJOHNSON<<MICHAEL<ROBERT<<<<<<<<<<<<<<<
A12345678<4USA8503159M2901099<<<<<<<<<<<<<<<08`
      }
      
      setProcessedResult(extractedText)
      setIsProcessing(false)
      addNotification({
        type: 'success',
        title: 'Document Scanned',
        message: 'Passport successfully scanned and data extracted.'
      })
    }, 2500)
  }

  const handleSaveToDocuments = () => {
    addNotification({
      type: 'success',
      title: 'Document Saved',
      message: 'Scanned document has been added to your document library.'
    })
  }

  return (
    <div className="document-scanner-page">
      <div className="scanner-header">
        <h1>Document Scanner</h1>
        <p>Capture or upload documents for AI-powered data extraction</p>
      </div>

      <div className="scanner-container">
        {/* Mode Selection Tabs */}
        {!capturedImage && !processedResult && (
          <div className="scanner-tabs">
            <button 
              className={`scanner-tab ${activeTab === 'camera' ? 'active' : ''}`}
              onClick={() => setActiveTab('camera')}
            >
              <Camera size={20} />
              <span>Camera</span>
            </button>
            <button 
              className={`scanner-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={20} />
              <span>Upload</span>
            </button>
          </div>
        )}

        {/* Camera View */}
        <AnimatePresence mode="wait">
          {activeTab === 'camera' && !capturedImage && !processedResult && (
            <motion.div 
              className="camera-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {cameraError ? (
                <div className="camera-error">
                  <Camera size={48} />
                  <p>{cameraError}</p>
                  <button className="glass-button" onClick={startCamera}>
                    Retry Camera Access
                  </button>
                </div>
              ) : (
                <>
                  <div className="camera-frame">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                    />
                    <div className="document-frame-overlay">
                      <div className="corner-marker top-left"></div>
                      <div className="corner-marker top-right"></div>
                      <div className="corner-marker bottom-left"></div>
                      <div className="corner-marker bottom-right"></div>
                      <div className="frame-label">Place document within frame</div>
                    </div>
                  </div>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="camera-controls">
                    <button className="capture-button" onClick={handleCapture}>
                      <div className="capture-ring"></div>
                    </button>
                  </div>
                  <div className="camera-switch">
                    <button className="glass-button" onClick={() => setActiveTab('upload')}>
                      <Upload size={18} />
                      Upload Instead
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Mode */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' && !capturedImage && !processedResult && (
            <motion.div 
              className="upload-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="dropzone scanner-dropzone">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                />
                <div className="dropzone-content">
                  <div className="upload-icon">
                    <ImageIcon size={48} />
                  </div>
                  <h3>Drop document here or click to upload</h3>
                  <p>Supports PNG, JPG, PDF (max 10MB)</p>
                  <button className="glass-button primary">
                    <Upload size={18} />
                    Browse Files
                  </button>
                </div>
              </div>
              <div className="upload-options">
                <span>Or use camera:</span>
                <button className="glass-button" onClick={() => setActiveTab('camera')}>
                  <Camera size={18} />
                  Switch to Camera
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Captured Image Preview */}
        <AnimatePresence>
          {capturedImage && !processedResult && (
            <motion.div 
              className="preview-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="preview-header">
                <button className="glass-button" onClick={handleRetake}>
                  <RotateCcw size={18} />
                  Retake
                </button>
                <h3>Document Preview</h3>
                <button className="glass-button primary" onClick={startScanning} disabled={isScanning}>
                  <Scan size={18} />
                  {isScanning ? 'Scanning...' : 'Start Scan'}
                </button>
              </div>

              <div className="preview-container">
                <div className="preview-image-wrapper">
                  <img src={capturedImage} alt="Captured document" />
                  
                  {/* Scanning Animation Overlay */}
                  {isScanning && (
                    <div className="scanning-overlay">
                      <div className="scan-line"></div>
                      <div className="scan-effects">
                        <div className="scan-glow"></div>
                        <div className="scan-particles"></div>
                      </div>
                      <div className="scan-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">Analyzing document... {scanProgress}%</span>
                      </div>
                    </div>
                  )}

                  {/* Crop markers */}
                  <div className="crop-overlay">
                    <div className="crop-handle top-left"></div>
                    <div className="crop-handle top-right"></div>
                    <div className="crop-handle bottom-left"></div>
                    <div className="crop-handle bottom-right"></div>
                  </div>
                </div>

                <div className="preview-actions">
                  <button className="glass-button">
                    <Crop size={18} />
                    Adjust Crop
                  </button>
                  <button className="glass-button">
                    <RotateCcw size={18} />
                    Rotate
                  </button>
                </div>
              </div>

              {isProcessing && (
                <div className="processing-overlay">
                  <div className="processing-content">
                    <Loader2 size={48} className="processing-spinner" />
                    <h3>Extracting Document Data</h3>
                    <p>AI is analyzing and extracting information from your document...</p>
                    <div className="processing-steps">
                      <div className="processing-step active">
                        <Check size={16} />
                        <span>Document detected</span>
                      </div>
                      <div className="processing-step active">
                        <Check size={16} />
                        <span>Image quality verified</span>
                      </div>
                      <div className="processing-step active">
                        <Check size={16} />
                        <span>Text regions identified</span>
                      </div>
                      <div className="processing-step">
                        <Loader2 size={16} className="step-spinner" />
                        <span>Extracting data...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processed Results */}
        <AnimatePresence>
          {processedResult && (
            <motion.div 
              className="results-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="results-header">
                <button className="glass-button" onClick={handleRetake}>
                  <ArrowLeft size={18} />
                  Scan Another
                </button>
                <div className="results-title">
                  <Check size={24} className="success-icon" />
                  <h3>Scan Complete</h3>
                </div>
                <button className="glass-button primary" onClick={handleSaveToDocuments}>
                  <Download size={18} />
                  Save to Library
                </button>
              </div>

              <div className="results-container">
                <div className="results-sidebar">
                  <div className="document-thumbnail">
                    <img src={capturedImage} alt="Scanned document" />
                    <div className="document-type-badge">
                      <FileText size={14} />
                      {processedResult.documentType}
                    </div>
                  </div>
                  <div className="confidence-score">
                    <div className="score-header">
                      <span>Confidence</span>
                      <span className="score-value">{processedResult.confidence}%</span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${processedResult.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="results-content">
                  <div className="results-tabs">
                    <button className="result-tab active">Extracted Data</button>
                    <button className="result-tab">Raw Text</button>
                    <button className="result-tab">MRZ Data</button>
                  </div>

                  <div className="results-data">
                    <div className="data-grid">
                      {Object.entries(processedResult.extractedData).map(([key, value]) => (
                        key !== 'mrzLine1' && key !== 'mrzLine2' && (
                          <div key={key} className="data-item">
                            <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <span className="data-value">{value}</span>
                          </div>
                        )
                      ))}
                    </div>

                    <div className="extracted-text">
                      <h4>Full Extracted Text</h4>
                      <pre>{processedResult.extractedText}</pre>
                    </div>
                  </div>

                  <div className="results-actions">
                    <button className="glass-button">
                      <FileText size={18} />
                      Export as JSON
                    </button>
                    <button className="glass-button">
                      <Download size={18} />
                      Download Image
                    </button>
                    <button className="glass-button primary">
                      <Zap size={18} />
                      Use for Application
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scanner Info Cards */}
      {!capturedImage && !processedResult && (
        <div className="scanner-info">
          <div className="info-card">
            <div className="info-icon">
              <Zap size={24} />
            </div>
            <h4>AI-Powered Extraction</h4>
            <p>Advanced OCR technology extracts text with 99% accuracy</p>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <Scan size={24} />
            </div>
            <h4>Smart Document Detection</h4>
            <p>Automatically detects document boundaries and perspective</p>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <FileText size={24} />
            </div>
            <h4>Multiple Formats</h4>
            <p>Supports passports, IDs, driver's licenses, and more</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentScanner
