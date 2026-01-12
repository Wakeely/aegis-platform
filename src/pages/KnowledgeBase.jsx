import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Search, ChevronDown, ChevronUp, FileText,
  Clock, ExternalLink, Star, Filter, ThumbsUp, ThumbsDown,
  HelpCircle, MessageCircle
} from 'lucide-react'

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedArticle, setExpandedArticle] = useState(null)
  const [feedbackGiven, setFeedbackGiven] = useState(null)

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen, count: 24 },
    { id: 'visas', label: 'Visa Types', icon: FileText, count: 8 },
    { id: 'green-card', label: 'Green Card', icon: FileText, count: 6 },
    { id: 'citizenship', label: 'Citizenship', icon: Star, count: 5 },
    { id: 'forms', label: 'Forms & Fees', icon: FileText, count: 5 }
  ]

  const articles = [
    {
      id: 1,
      category: 'green-card',
      title: 'Complete Guide to I-485 Adjustment of Status',
      excerpt: 'Learn everything about filing Form I-485 to adjust your status to permanent resident, including requirements, processing times, and documentation.',
      content: `Form I-485, Application to Register Permanent Residence or Adjust Status, is the primary form used to apply for a green card from within the United States.

## Who Can File?

You may be eligible to file Form I-485 if you are:
- Currently in the U.S. on a valid nonimmigrant visa
- The immediate relative of a U.S. citizen or green card holder
- A refugee or asylee adjusting status
- A special immigrant (religious workers, VAWA self-petitioners, etc.)

## Required Documentation

The following documents are typically required:
1. Proof of identity (passport, birth certificate)
2. Police certificates from all places of residence
3. Medical examination (must be by approved physician)
4. Proof of immigration status
5. Birth certificate
6. Marriage certificate (if applicable)
7. Financial evidence (tax returns, bank statements)

## Filing Fees

The filing fee for Form I-485 is $1,140 plus an $85 biometric services fee. Some categories may be exempt from fees.`,
      lastUpdated: '2024-12-15',
      views: 15420,
      helpful: 892,
      notHelpful: 23
    },
    {
      id: 2,
      category: 'citizenship',
      title: 'Naturalization Requirements: 5-Year vs 3-Year Rule',
      excerpt: 'Understanding the continuous residence requirements for U.S. citizenship and how marriage affects your naturalization timeline.',
      content: `U.S. citizenship through naturalization is available to green card holders who meet certain requirements. The standard rule requires 5 years of continuous residence, but there are important exceptions.

## Standard 5-Year Rule

To qualify under the standard rule, you must:
- Have held a green card for at least 5 years
- Have continuously resided in the U.S. for at least 5 years
- Be physically present in the U.S. for at least 30 months
- Be able to read, write, and speak basic English
- Pass a civics test
- Have good moral character

## 3-Year Rule for Married Couples

If you are married to a U.S. citizen, you may qualify for naturalization after only 3 years if:
- Your spouse has been a U.S. citizen for the entire 3-year period
- You have been married to the same U.S. citizen for at least 3 years
- You have continuously resided in the U.S. as a green card holder for at least 3 years
- You meet all other naturalization requirements`,
      lastUpdated: '2024-12-10',
      views: 23150,
      helpful: 1456,
      notHelpful: 34
    },
    {
      id: 3,
      category: 'visas',
      title: 'H-1B Visa: Everything You Need to Know',
      excerpt: 'Comprehensive overview of the H-1B specialty occupation visa, including the lottery process, cap exemptions, and extension requirements.',
      content: `The H-1B visa is a non-immigrant visa that allows U.S. companies to employ foreign workers in specialty occupations that require theoretical or technical expertise.

## H-1B Requirements

To qualify for an H-1B visa:
- You must have a bachelor's degree or higher (or equivalent experience)
- The position must be a specialty occupation
- The employer must pay the prevailing wage
- There must be a genuine employer-employee relationship

## Annual Cap

There is an annual cap of 65,000 H-1B visas, with 6,800 reserved for citizens of Chile and Singapore under the free trade agreement. Additionally, 20,000 H-1Bs are reserved for those with a U.S. master's degree or higher.

## The H-1B Lottery

Due to high demand, USCIS conducts a lottery when more applications are received than available slots. The lottery is random and does not consider qualifications or salary level.`,
      lastUpdated: '2024-12-08',
      views: 31200,
      helpful: 2103,
      notHelpful: 56
    },
    {
      id: 4,
      category: 'forms',
      title: 'Understanding Immigration Filing Fees',
      excerpt: 'A complete breakdown of all immigration filing fees, including discounts, waivers, and payment methods.',
      content: `Immigration filing fees vary significantly depending on the form and your circumstances. Here's what you need to know about current fees.

## Fee Schedule (2024)

- Form I-485: $1,225 ($1,140 filing + $85 biometrics)
- Form I-130: $535 (per petition)
- Form I-131: $630 (for travel document)
- Form I-765: $520 (work authorization)
- Form N-400: $640 (naturalization)

## Fee Waivers

Fee waivers are available for those who demonstrate inability to pay. You may qualify if you receive means-tested benefits or can show financial hardship.

## Payment Methods

USCIS accepts:
- Credit cards (Form G-1450)
- Checks and money orders
- Cash at ASC locations (limited)`,
      lastUpdated: '2024-12-05',
      views: 18900,
      helpful: 1234,
      notHelpful: 45
    },
    {
      id: 5,
      category: 'green-card',
      title: 'Marriage Green Card Timeline: What to Expect',
      excerpt: 'Step-by-step timeline for marriage-based green card applications, from filing to approval.',
      content: `The marriage-based green card process involves several steps and can take varying amounts of time depending on your specific circumstances.

## Typical Timeline

1. **File I-130 Petition** (2-4 months for receipt notice)
2. **I-130 Processing** (6-12 months typically)
3. **File I-485 Application** (if concurrent filing, same time as I-130)
4. **Biometrics Appointment** (1-2 months after filing)
5. **Interview** (6-12 months after filing, may vary by field office)
6. **Decision** (Same day as interview or 2-4 weeks after)

## Factors Affecting Timeline

- Field office workload
- Completeness of application
- Need for Request for Evidence (RFE)
- Background check processing
- Interview scheduling availability`,
      lastUpdated: '2024-12-01',
      views: 25600,
      helpful: 1789,
      notHelpful: 67
    },
    {
      id: 6,
      category: 'citizenship',
      title: 'Civics Test Study Guide: 2024 Updated Questions',
      excerpt: 'Practice the 100 civics questions that may be asked during your naturalization interview.',
      content: `The naturalization civics test covers important U.S. history and government concepts. Here are the key topics to study.

## Key Topics

### American Government
- Principles of American democracy
- System of government
- Rights and responsibilities of citizens

### American History
- Colonial period and independence
- 1800s (Civil War and expansion)
- Recent American history and other important historical information

### Integrated Civics
- Geography
- Symbols
- Holidays

## Test Format

The test consists of up to 10 questions from a pool of 100. You must answer at least 6 correctly to pass. The officer will ask 10 questions during the interview.`,
      lastUpdated: '2024-11-28',
      views: 42100,
      helpful: 3245,
      notHelpful: 89
    }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleFeedback = (articleId, helpful) => {
    setFeedbackGiven({ articleId, helpful })
  }

  const quickChips = [
    'Green card processing time',
    'H-1B extension',
    'Citizenship interview',
    'Marriage certificate',
    'Travel outside US',
    'Name change'
  ]

  return (
    <div className="knowledge-base">
      <div className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Dynamic Knowledge Base
        </motion.h1>
        <p>Access AI-curated immigration resources, guides, and frequently asked questions.</p>
      </div>

      {/* Search */}
      <div className="kb-search">
        <Search size={24} />
        <input 
          type="text"
          className="glass-input"
          placeholder="Search for immigration topics, forms, or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Chips */}
      <div className="quick-chips">
        {quickChips.map((chip, index) => (
          <button
            key={index}
            className="chip"
            onClick={() => setSearchQuery(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`glass-button ${selectedCategory === cat.id ? 'primary' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
          >
            <cat.icon size={16} />
            {cat.label}
            <span style={{ 
              marginLeft: 'var(--spacing-xs)',
              padding: '2px 6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem'
            }}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            className={`glass kb-article ${expandedArticle === article.id ? 'expanded' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
              <span style={{ 
                fontSize: '0.75rem',
                padding: '4px 8px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-secondary)',
                textTransform: 'capitalize'
              }}>
                {article.category.replace('-', ' ')}
              </span>
              {expandedArticle === article.id ? (
                <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} />
              ) : (
                <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>

            <h3>{article.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
              {article.excerpt}
            </p>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '0.875rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  {new Date(article.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={14} />
                  {article.views.toLocaleString()} views
                </span>
              </div>
            </div>

            <AnimatePresence>
              {expandedArticle === article.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ 
                    marginTop: 'var(--spacing-lg)',
                    paddingTop: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--glass-border)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                    fontSize: '0.9rem'
                  }}>
                    {article.content}
                  </div>

                  {/* Feedback */}
                  <div style={{ 
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Was this article helpful?
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button 
                        className={`glass-button ${feedbackGiven?.articleId === article.id && feedbackGiven.helpful ? 'primary' : ''}`}
                        style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFeedback(article.id, true)
                        }}
                      >
                        <ThumbsUp size={14} />
                        {article.helpful}
                      </button>
                      <button 
                        className="glass-button"
                        style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFeedback(article.id, false)
                        }}
                      >
                        <ThumbsDown size={14} />
                        {article.notHelpful}
                      </button>
                    </div>
                  </div>

                  {/* Related Topics */}
                  <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>Related Topics</h4>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                      {['Green Card', 'Documentation', 'USCIS', 'Processing'].map(topic => (
                        <span 
                          key={topic}
                          className="chip"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="glass" style={{ padding: 'var(--spacing-xl)', marginTop: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <HelpCircle size={20} style={{ color: 'var(--color-secondary)' }} />
          Frequently Asked Questions
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
          {[
            { q: 'How long does it take to get a green card?', a: 'Processing times vary by category, but typically range from 6 months to 2+ years depending on the specific path and current workload.' },
            { q: 'Can I travel while my I-485 is pending?', a: 'Generally yes, but you may need an Advance Parole document. Consult with an attorney before any international travel.' },
            { q: 'What happens if my I-485 is denied?', a: 'You will receive a written explanation. You may appeal the decision or file a motion to reopen/reconsider within 30 days.' },
            { q: 'Do I need a lawyer to file for immigration?', a: 'No, you can file on your own (pro se). However, complex cases benefit from legal representation.' }
          ].map((faq, index) => (
            <div 
              key={index}
              style={{ 
                padding: 'var(--spacing-md)',
                background: 'var(--bg-glass)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>{faq.q}</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat CTA */}
      <div style={{ 
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-xl)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xl)'
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <MessageCircle size={40} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Can't find what you're looking for?</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Chat with AEGIS AI for personalized answers to your immigration questions.
          </p>
        </div>
        <button className="glass-button primary" style={{ padding: 'var(--spacing-md) var(--spacing-xl)' }}>
          Start Chat
        </button>
      </div>
    </div>
  )
}

export default KnowledgeBase
