import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, AlertTriangle, CheckCircle, HelpCircle,
  ChevronRight, ChevronDown, Sparkles, Shield,
  Clock, Eye, EyeOff, Copy, RefreshCw, Save,
  BookOpen, Lightbulb, Target, Info,
  ArrowRight, ArrowLeft, Building, User, Calendar
} from 'lucide-react'
import {
  useFormStore,
  useGlobalStore
} from '../utils/enhancedStore'

// Form field configurations with plain-language guidance
const formFieldGuides = {
  'I-485': {
    name: 'I-485',
    fullName: 'Application to Register Permanent Residence or Adjust Status',
    description: 'The main application to get your green card while already in the US',
    estimatedTime: '2-3 hours',
    difficulty: 'High',
    fields: {
      'fullName': {
        question: 'Full Legal Name',
        legalLanguage: 'Applicant\'s Full Legal Name',
        plainLanguage: 'Your name as it appears on official documents (birth certificate, passport)',
        exampleAnswers: ['John Michael Smith', 'Maria Garcia Rodriguez'],
        commonMistakes: [
          'Using nickname instead of legal name',
          'Missing middle name or using initial',
          'Name order confusion (Western vs. Asian naming conventions)'
        ],
        validation: {
          minLength: 2,
          pattern: /^[a-zA-Z\s\-\']+$/,
          error: 'Name must contain only letters, spaces, hyphens, and apostrophes'
        },
        whatHappensIfWrong: 'Your application may be rejected or delayed while they verify your identity. This can add 3-6 months to processing time.',
        contextTips: [
          'If your name has changed, you\'ll need to explain in Part 2, Item 5',
          'Use the same name as on your birth certificate or passport'
        ]
      },
      'dateOfBirth': {
        question: 'Date of Birth',
        legalLanguage: 'Date of Birth (mm/dd/yyyy)',
        plainLanguage: 'When you were born - use the date from your birth certificate',
        exampleAnswers: ['01/15/1990', '15/01/1990'],
        commonMistakes: [
          'Using the wrong calendar (some countries use day/month/year)',
          'Transposing month and day numbers',
          'Using estimated dates when exact is required'
        ],
        validation: {
          required: true,
          pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/,
          error: 'Please use mm/dd/yyyy format (e.g., 01/15/1990)'
        },
        whatHappensIfWrong: 'USCIS will compare this with your birth certificate. Mismatches cause automatic RFE (Request for Evidence) and 2-4 month delays.',
        contextTips: [
          'If you don\'t know your exact birth date, you must provide an affidavit explaining why',
          'Use the Gregorian calendar even if your country uses a different system'
        ]
      },
      'countryOfBirth': {
        question: 'Country of Birth',
        legalLanguage: 'Country of Birth',
        plainLanguage: 'The country where you were born - use the current name of the country',
        exampleAnswers: ['Mexico', 'India', 'South Korea', 'United Kingdom'],
        commonMistakes: [
          'Using old country names (e.g., "Persia" instead of "Iran")',
          'Using province/region instead of country',
          'Confusing birthplace with nationality'
        ],
        validation: {
          required: true,
          error: 'Country of birth is required'
        },
        whatHappensIfWrong: 'This is used for background checks. Wrong information can cause delays while they verify your records.',
        contextTips: [
          'If your country has changed names, use the name at the time of your birth',
          'Be specific: "Korea, Republic of" not just "Korea"'
        ]
      },
      'alienNumber': {
        question: 'Alien Registration Number (A-Number)',
        legalLanguage: 'Alien Registration Number (A-Number)',
        plainLanguage: 'Your A-Number from the I-94 card or previous immigration documents (starts with A-)',
        exampleAnswers: ['A123-456-789', 'A012345678'],
        commonMistakes: [
          'Confusing A-Number with I-94 number',
          'Missing the leading "A"',
          'Using Social Security Number instead'
        ],
        validation: {
          pattern: /^A\d{7,9}$/,
          error: 'A-Number should start with A followed by 7-9 digits'
        },
        whatHappensIfWrong: 'If you omit or incorrectly enter your A-Number, you may lose your priority date or face processing delays of 6+ months.',
        contextTips: [
          'Find it on: I-94, green card, work permit, or immigration approval notices',
          'If you\'ve never had one, write "N/A" in the field',
          'This is different from your Social Security Number'
        ]
      },
      'ssn': {
        question: 'Social Security Number (if any)',
        legalLanguage: 'Social Security Number (if any)',
        plainLanguage: 'Your SSN if you\'ve been authorized to work in the US',
        exampleAnswers: ['123-45-6789', 'N/A'],
        commonMistakes: [
          'Providing SSN before you\'re authorized to work',
          'Using ITIN instead of SSN',
          'Leaving blank when you actually have one'
        ],
        validation: {
          pattern: /^\d{3}-\d{2}-\d{4}$/,
          error: 'Please use format: 123-45-6789 or write N/A'
        },
        whatHappensIfWrong: 'Providing incorrect SSN information won\'t cause denial but may cause unnecessary RFE requests.',
        contextTips: [
          'Only provide if you\'ve been issued a valid SSN',
          'If you\'re on a visa that allows work, you should have one',
          'If you\'ve never worked in US, write "N/A"'
        ]
      },
      'maritalStatus': {
        question: 'Current Marital Status',
        legalLanguage: 'Current Marital Status',
        plainLanguage: 'Your relationship status right now',
        options: [
          { value: 'single', label: 'Never Married', description: 'Never been married' },
          { value: 'married', label: 'Married', description: 'Currently legally married' },
          { value: 'divorced', label: 'Divorced', description: 'Legally divorced from previous marriage' },
          { value: 'widowed', label: 'Widowed', description: 'Spouse passed away' },
          { value: 'annulled', label: 'Annulled', description: 'Marriage declared invalid by court' },
          { value: 'separated', label: 'Legally Separated', description: 'Still married but legally separated' }
        ],
        commonMistakes: [
          'Choosing "Separated" instead of "Married" (they want Married)',
          'Forgetting to disclose previous marriages',
          'Not understanding that "Common Law" marriage isn\'t recognized by federal law'
        ],
        validation: {
          required: true,
          error: 'Please select your current marital status'
        },
        whatHappensIfWrong: 'If you\'re actually married but check "Single," your application will be denied for fraud concerns. This is taken very seriously.',
        contextTips: [
          'If you\'re in the process of divorce, you\'re still "Married"',
          'Common law marriages are NOT recognized by immigration unless from specific states',
          'You MUST list ALL previous marriages for both you and your parents'
        ]
      },
      'spouseName': {
        question: 'Spouse\'s Full Legal Name',
        legalLanguage: 'Spouse\'s Full Legal Name',
        plainLanguage: 'Your current spouse\'s name exactly as it appears on their documents',
        exampleAnswers: ['Jennifer Marie Smith', 'Wei Zhang'],
        commonMistakes: [
          'Using married name before legally changing it',
          'Inconsistent name spelling with marriage certificate',
          'Missing spouse if married but separated'
        ],
        validation: {
          requiredIf: 'maritalStatus === "married"',
          pattern: /^[a-zA-Z\s\-\']+$/,
          error: 'Please enter spouse\'s full legal name'
        },
        whatHappensIfWrong: 'Missing spouse information when married will cause automatic RFE and questions about the legitimacy of your marriage.',
        contextTips: [
          'If spouse is also applying, their name must match exactly',
          'If spouse is a US citizen, this affects your filing strategy'
        ]
      },
      'currentAddress': {
        question: 'Current Physical Address',
        legalLanguage: 'Physical Address (Street Number and Name)',
        plainLanguage: 'Where you actually live right now - not a P.O. box or mail forwarding address',
        exampleAnswers: ['123 Main Street, Apt 4B', '456 Oak Avenue, Unit 12'],
        commonMistakes: [
          'Using work address instead of home address',
          'Using P.O. Box or mail forwarding service address',
          'Abbreviating street names (St instead of Street)'
        ],
        validation: {
          required: true,
          minLength: 10,
          error: 'Please provide your complete street address'
        },
        whatHappensIfWrong: 'USCIS will send important documents to this address. Using a mail service can result in missed deadlines and case denial.',
        contextTips: [
          'If you move, you MUST file Form AR-11 to update your address',
          'USCIS can reject applications with invalid addresses',
          'Rural routes should use street names, not box numbers'
        ]
      },
      'travelHistory': {
        question: 'International Travel History',
        legalLanguage: 'List all international trips taken in the past 5 years',
        plainLanguage: 'Every time you left the US in the last 5 years - including day trips',
        exampleAnswers: [
          'Trip 1: 03/15/2020 - 03/20/2020, Mexico City, Mexico, Tourism - Passport used',
          'Trip 2: 07/01/2020 - 07/10/2020, Toronto, Canada, Business - Visa used'
        ],
        commonMistakes: [
          'Forgetting short trips (weekend to Mexico/Canada)',
          'Not listing countries visited multiple times',
          'Estimating dates instead of using passport stamps'
        ],
        validation: {
          required: true,
          error: 'You must provide complete travel history for the past 5 years'
        },
        whatHappensIfWrong: 'Missing trips can be seen as fraud. This is one of the most common reasons for denial. If you\'re not sure, check your passport stamps.',
        contextTips: [
          'Even a day trip to Mexico or Canada counts',
          'Check your passport for entry/exit stamps as reference',
          'If you don\'t remember exact dates, estimate and explain',
          'Visa overstays or illegal entries must be disclosed'
        ]
      },
      'employmentHistory': {
        question: 'Employment History for Last 5 Years',
        legalLanguage: 'Employment History (past 5 years)',
        plainLanguage: 'Every job you\'ve had in the last 5 years, including periods of unemployment',
        exampleAnswers: [
          '01/2019 - Present: Software Engineer, Tech Innovations Inc., San Francisco, CA',
          '03/2017 - 12/2018: Unemployed, Homemaker, San Francisco, CA',
          '06/2015 - 02/2017: Marketing Coordinator, ABC Corp, New York, NY'
        ],
        commonMistakes: [
          'Gaps in employment without explanation',
          'Using present address for past employers',
          'Not listing self-employment or gig work',
          'Forgetting to list periods of unemployment'
        ],
        validation: {
          required: true,
          error: 'You must account for all time in the past 5 years'
        },
        whatHappensIfWrong: 'Gaps without explanation raise red flags about your legal status during that time. May trigger RFE for additional evidence.',
        contextTips: [
          'List ALL employment gaps - unemployment, schooling, caregiving, etc.',
          'Self-employment must be listed with business name and address',
          'Use month and year (mm/yyyy) format',
          'If never employed, explain what you were doing'
        ]
      }
    }
  },
  'I-130': {
    name: 'I-130',
    fullName: 'Petition for Alien Relative',
    description: 'The form to establish that you have a genuine relationship with your relative',
    estimatedTime: '1-2 hours',
    difficulty: 'Medium',
    fields: {
      'petitionerName': {
        question: 'Your Full Legal Name (US Citizen/LPR Sponsor)',
        legalLanguage: 'Petitioner\'s Full Legal Name',
        plainLanguage: 'Your name as the person sponsoring the family member',
        exampleAnswers: ['Robert James Wilson'],
        commonMistakes: [
          'Using married name instead of legal name',
          'Not matching name on citizenship documents'
        ],
        validation: {
          required: true,
          minLength: 2,
          pattern: /^[a-zA-Z\s\-\']+$/,
          error: 'Please enter your full legal name'
        },
        whatHappensIfWrong: 'Name must match your citizenship or green card documents exactly, or the petition will be rejected.',
        contextTips: [
          'This is the sponsor who is US citizen or green card holder',
          'Name must match naturalization certificate or passport exactly'
        ]
      },
      'petitionerAddress': {
        question: 'Your Current Address',
        legalLanguage: 'Petitioner\'s Current Address',
        plainLanguage: 'Where you live right now - this is where all correspondence will be sent',
        exampleAnswers: ['789 Oak Street, San Francisco, CA 94102'],
        commonMistakes: [
          'Using old address',
          'Not updating after move'
        ],
        validation: {
          required: true,
          minLength: 10,
          error: 'Please provide your complete current address'
        },
        whatHappensIfWrong: 'USCIS will send approvals and requests to this address. If wrong, you may miss important deadlines.',
        contextTips: [
          'This address must match what\'s on your ID documents',
          'If you move, you need to file AR-11 and notify FOIA office'
        ]
      },
      'beneficiaryName': {
        question: 'Family Member\'s Full Legal Name',
        legalLanguage: 'Beneficiary\'s Full Legal Name',
        plainLanguage: 'The person you\'re sponsoring - their name exactly as in their passport',
        exampleAnswers: ['Li Ming Chen'],
        commonMistakes: [
          'Name order confusion (family name vs given name)',
          'Not using proper accent marks'
        ],
        validation: {
          required: true,
          error: 'Please enter the beneficiary\'s full legal name'
        },
        whatHappensIfWrong: 'Name should match beneficiary\'s passport exactly. Wrong names cause delays in visa processing.',
        contextTips: [
          'In many Asian cultures, family name comes first - use as shown in passport',
          'Include all given names, not just first and last'
        ]
      },
      'beneficiaryAddress': {
        question: 'Family Member\'s Current Address',
        legalLanguage: 'Beneficiary\'s Current Address',
        plainLanguage: 'Where the family member lives right now',
        exampleAnswers: ['456 Wang Fang Road, Apt 12B, Shanghai, China 200000'],
        commonMistakes: [
          'Incomplete international addresses',
          'Not including postal codes'
        ],
        validation: {
          required: true,
          error: 'Please provide the beneficiary\'s complete address'
        },
        whatHappensIfWrong: 'This helps DHS locate your family member. Incomplete addresses delay the petition.',
        contextTips: [
          'Include country and postal code',
          'Use English translation of street address if possible'
        ]
      },
      'relationship': {
        question: 'Your Relationship to the Person',
        legalLanguage: 'Relationship to Beneficiary',
        plainLanguage: 'How you\'re related to the family member you\'re sponsoring',
        options: [
          { value: 'spouse', label: 'Spouse', description: 'Legally married husband/wife' },
          { value: 'parent', label: 'Parent', description: 'Mother or father' },
          { value: 'child', label: 'Child', description: 'Son or daughter (any age)' },
          { value: 'sibling', label: 'Sibling', description: 'Brother or sister' },
          { value: 'fiance', label: 'Fiancé(e)', description: 'Engaged to be married' }
        ],
        commonMistakes: [
          'Confusing "step" relationships (need marriage certificate showing adoption)',
          'Not understanding "child" age limits (over 21 unmarried = different process)',
          'Fiancé relationship requires additional I-129F'
        ],
        validation: {
          required: true,
          error: 'Please specify your relationship'
        },
        whatHappensIfWrong: 'The wrong relationship category means wrong filing fee, wrong process, and likely denial.',
        contextTips: [
          'Step-relationships require marriage certificate showing step-parent adopted child',
          'Unmarried children over 21 need F-2A category, not immediate relative',
          'Same-sex marriages are legally recognized'
        ]
      }
    }
  },
  'N-400': {
    name: 'N-400',
    fullName: 'Application for Naturalization',
    description: 'The application to become a US citizen',
    estimatedTime: '2-3 hours',
    difficulty: 'Medium-High',
    fields: {
      'naturalizationFullName': {
        question: 'Full Name as it Appears on Green Card',
        legalLanguage: 'Full Name as it Appears on Permanent Resident Card',
        plainLanguage: 'Your name exactly as it\'s printed on your green card',
        exampleAnswers: ['CHEN WEI'],
        commonMistakes: [
          'Using different case than on green card',
          'Adding middle name not on green card',
          'Using married name not updated on green card'
        ],
        validation: {
          required: true,
          error: 'Name must match your green card exactly'
        },
        whatHappensIfWrong: 'Name must match green card exactly or you\'ll receive an RFE. This can delay citizenship by 3-6 months.',
        contextTips: [
          'Green cards often use ALL CAPS - copy it exactly',
          'If your name has changed, you need to explain in Part 2',
          'Women should use name as it appears, even if married name'
        ]
      },
      'aNumber': {
        question: 'Alien Registration Number (A-Number)',
        legalLanguage: 'Alien Registration Number (A-Number)',
        plainLanguage: 'Your A-Number starting with A- followed by 7-9 digits',
        exampleAnswers: ['A987-654-321'],
        commonMistakes: [
          'Missing the "A-" prefix',
          'Using green card number instead',
          'Using receipt number'
        ],
        validation: {
          pattern: /^A\d{7,9}$/,
          error: 'A-Number should start with A followed by 7-9 digits'
        },
        whatHappensIfWrong: 'Wrong A-Number causes processing delays and potential rejection. This is how they track your file.',
        contextTips: [
          'Found on green card (back), on I-94, and on approval notices',
          'If lost, check FOIA request for your immigration file'
        ]
      },
      'uscisAccountNumber': {
        question: 'USCIS Online Account Number (if any)',
        legalLanguage: 'USCIS Online Account Number',
        plainLanguage: 'Only if you\'ve created an account at uscis.gov - found in your profile',
        exampleAnswers: ['USCID123456789', 'N/A'],
        commonMistakes: [
          'Confusing with A-Number or receipt number',
          'Providing when you don\'t have one'
        ],
        validation: {
          pattern: /^USCID\d{9}$/,
          error: 'If you have a USCIS online account, enter the 12-digit number from your profile'
        },
        whatHappensIfWrong: 'This helps link your application to your online account. Incorrect number just means you won\'t see status updates online.',
        contextTips: [
          'If you\'ve filed online before, you have one',
          'Found in your uscis.gov account settings',
          'If never filed online, enter "N/A"'
        ]
      },
      'residenceHistory': {
        question: 'Address History Where You Lived for Last 5 Years',
        legalLanguage: 'Physical Addresses Where You Lived (past 5 years)',
        plainLanguage: 'Every place you\'ve lived in the last 5 years, starting with where you live now',
        exampleAnswers: [
          '01/2020 - Present: 123 Main St, Apt 4B, San Francisco, CA 94102',
          '06/2017 - 12/2019: 456 Oak Ave, Unit 12, New York, NY 10001'
        ],
        commonMistakes: [
          'Missing moves within same city',
          'Not using full street addresses',
          'Forgetting to list current address first'
        ],
        validation: {
          required: true,
          error: 'You must list all addresses for the past 5 years'
        },
        whatHappensIfWrong: 'Missing addresses raise questions about continuous residence. This can delay interview and trigger detailed background check.',
        contextTips: [
          'Start with CURRENT address',
          'Use month/year format',
          'Include apartment numbers and zip codes',
          'Even moves within same building count'
        ]
      },
      'employmentHistory': {
        question: 'Employment, Self-Employment, and Unemployment (past 5 years)',
        legalLanguage: 'Employment History (past 5 years)',
        plainLanguage: 'Every job you\'ve had, plus any periods without work',
        exampleAnswers: [
          '03/2020 - Present: Software Engineer, Google, Mountain View, CA',
          '01/2018 - 02/2020: Unemployed, Seeking Employment, San Francisco, CA'
        ],
        commonMistakes: [
          'Leaving gaps unaccounted for',
          'Not listing self-employment',
          'Using business address instead of employment dates'
        ],
        validation: {
          required: true,
          error: 'You must account for all time in the past 5 years'
        },
        whatHappensIfWrong: 'Gaps without explanation can delay your interview and require additional documentation proving your continuous residence.',
        contextTips: [
          'Unemployment is acceptable - just list it',
          'Self-employment needs employer name and address',
          'Include month/year for each period',
          'Start with most recent'
        ]
      },
      'travelOutsideUS': {
        question: 'Trips Outside the United States (past 5 years)',
        legalLanguage: 'Trips Outside the United States (past 5 years)',
        plainLanguage: 'Every time you left the US - even for a day - including destinations and dates',
        exampleAnswers: [
          '07/15/2022 - 07/20/2022, 6 days, Tokyo, Japan, Tourism',
          '12/20/2021 - 01/05/2022, 17 days, Shanghai, China, Visit Family'
        ],
        commonMistakes: [
          'Forgetting short trips (especially to Canada/Mexico)',
          'Not listing exact dates',
          'Leaving out return dates'
        ],
        validation: {
          required: true,
          error: 'You must list ALL trips outside the US in the past 5 years'
        },
        whatHappensIfWrong: 'Missing trips is seen as concealment of material facts - grounds for denial. Always include even short trips.',
        contextTips: [
          'Check passport stamps for dates',
          'Even a day trip to Tijuana counts',
          'Long trips (6+ months) may break continuous residence',
          'List each trip separately with exact dates'
        ]
      },
      'moralCharacter': {
        question: 'Criminal History and Other Circumstances',
        legalLanguage: 'Criminal, Detention, and Other Circumstances',
        plainLanguage: 'Answer honestly - this asks about arrests, tickets, and other legal issues',
        exampleAnswers: [
          'No, I have never been arrested, cited, detained, or charged with any crime.',
          'Yes, I received a traffic citation in 2018 which was paid and closed.'
        ],
        commonMistakes: [
          'Not reporting minor traffic tickets',
          'Forgetting arrests that were dismissed',
          'Thinking that being found not guilty means you don\'t report it'
        ],
        validation: {
          required: true,
          error: 'You must answer this question'
        },
        whatHappensIfWrong: 'Failing to report arrests, even minor ones or ones that were dismissed, is seen as lack of good moral character and can lead to denial.',
        contextTips: [
          'You MUST report arrests, even if charges were dropped',
          'Minor traffic violations (parking tickets) usually don\'t need to be reported',
          'DUI, domestic violence, and fraud are serious issues',
          'If in doubt, disclose and explain'
        ]
      },
      'oathAllegiance': {
        question: 'Oath of Allegiance',
        legalLanguage: ' Oath of Renunciation and Allegiance',
        plainLanguage: 'Do you promise to support and defend the US and give up loyalty to other countries?',
        exampleAnswers: ['Yes, I absolutely swear that this is true and complete.'],
        commonMistakes: [
          'Answering "Yes" without understanding the oath',
          'Not understanding what you\'re renouncing'
        ],
        validation: {
          required: true,
          error: 'You must take the Oath to become a citizen'
        },
        whatHappensIfWrong: 'You can refuse to take the Oath at the ceremony and reschedule, but you cannot become a citizen without it.',
        contextTips: [
          'You renounce allegiance to all foreign rulers and countries',
          'You promise to support and defend the US Constitution',
          'If you have religious objections, there\'s an alternative ceremony',
          'This is the final step before citizenship'
        ]
      }
    }
  }
}

const FormCompletionAssistant = () => {
  const { addNotification } = useGlobalStore()
  const [selectedForm, setSelectedForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [currentField, setCurrentField] = useState(null)
  const [showPlainLanguage, setShowPlainLanguage] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [completedFields, setCompletedFields] = useState({})
  const [showTips, setShowTips] = useState({})

  const form = selectedForm ? formFieldGuides[selectedForm] : null

  // Update currentField when formData changes to handle conditional fields
  useEffect(() => {
    if (form && form.fields && currentField && !form.fields[currentField]) {
      const fieldKeys = Object.keys(form.fields)
      if (fieldKeys.length > 0) {
        setCurrentField(fieldKeys[0])
      }
    }
  }, [form, formData, currentField])

  // Helper to check if field should be shown based on conditions
  const shouldShowField = useCallback((fieldKey) => {
    if (!form || !form.fields[fieldKey]) return true
    
    const field = form.fields[fieldKey]
    if (!field.validation?.requiredIf) return true
    
    try {
      const condition = field.validation.requiredIf
      const match = condition.match(/(\w+)\s*===\s*['"](.+)/)
      if (match) {
        const [_, fieldName, value] = match
        return formData[fieldName] === value
      }
      return true
    } catch (e) {
      return true
    }
  }, [form, formData])

  // Validate a single field
  const validateField = useCallback((fieldKey, value) => {
    if (!form || !form.fields[fieldKey]) return null
    
    const field = form.fields[fieldKey]
    if (!field.validation) return null
    
    if (field.validation.required && !value) {
      return field.validation.error || 'This field is required'
    }
    
    if (field.validation.requiredIf) {
      const condition = field.validation.requiredIf
      const match = condition.match(/(\w+)\s*===\s*['"](.+)/)
      if (match) {
        const [_, checkField, checkValue] = match
        if (formData[checkField] === checkValue && !value) {
          return field.validation.error || 'This field is required'
        }
      }
    }
    
    if (field.validation.pattern && value) {
      if (!field.validation.pattern.test(value)) {
        return field.validation.error
      }
    }
    
    if (field.validation.minLength && value && value.length < field.validation.minLength) {
      return field.validation.error || `Minimum ${field.validation.minLength} characters required`
    }
    
    return null
  }, [form, formData])

  // Handle field value change
  const handleFieldChange = useCallback((fieldKey, value) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }))
    
    // Validate field
    const error = validateField(fieldKey, value)
    setValidationErrors(prev => ({
      ...prev,
      [fieldKey]: error
    }))
    
    // Mark as completed if valid
    if (!error && value) {
      setCompletedFields(prev => ({ ...prev, [fieldKey]: true }))
    } else {
      setCompletedFields(prev => ({ ...prev, [fieldKey]: false }))
    }
  }, [validateField])

  // Get progress percentage
  const getProgress = useCallback(() => {
    if (!form) return 0
    const fields = Object.keys(form.fields).filter(shouldShowField)
    if (fields.length === 0) return 100
    
    const completed = fields.filter(f => completedFields[f]).length
    return Math.round((completed / fields.length) * 100)
  }, [form, completedFields, shouldShowField])

  // Select a form to work on
  const handleSelectForm = (formId) => {
    setSelectedForm(formId)
    setFormData({})
    setCompletedFields({})
    setValidationErrors({})
    setCurrentField(Object.keys(formFieldGuides[formId].fields)[0])
  }

  // Copy example answer
  const copyExample = (example) => {
    navigator.clipboard.writeText(example)
    addNotification({
      type: 'success',
      title: 'Copied!',
      message: 'Example answer copied to clipboard'
    })
  }

  return (
    <div className="form-completion-assistant">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}
        >
          <FileText size={32} style={{ color: 'var(--color-secondary)' }} />
          Form Completion Assistant
        </motion.h1>
        <p>Complete immigration forms with confidence. Get plain-language explanations, real examples, and error prevention.</p>
      </div>

      {/* Form Selection */}
      {!selectedForm && (
        <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Select a Form to Complete</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {Object.values(formFieldGuides).map((formOption, index) => (
              <motion.div
                key={formOption.name}
                style={{
                  padding: 'var(--spacing-lg)',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, borderColor: 'var(--color-secondary)' }}
                onClick={() => handleSelectForm(formOption.name)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--color-secondary)' }}>{formOption.name}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {formOption.fullName}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-success)',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {formOption.difficulty}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
                  {formOption.description}
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {formOption.estimatedTime}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={12} /> {Object.keys(formOption.fields).length} questions
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Form Completion Interface */}
      {selectedForm && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
          {/* Main Form Area */}
          <div className="glass" style={{ padding: 'var(--spacing-xl)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
              <div>
                <button
                  className="glass-button"
                  onClick={() => { setSelectedForm(null); setCurrentField(null); }}
                  style={{ marginBottom: 'var(--spacing-sm)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                >
                  <ArrowLeft size={16} style={{ marginRight: '4px' }} />
                  Back to Forms
                </button>
                <h2 style={{ margin: 0 }}>{form.name}: {form.fullName}</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {form.description}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-secondary)' }}>
                  {getProgress()}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              height: '6px',
              background: 'var(--bg-dark)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--spacing-xl)',
              overflow: 'hidden'
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)'
                }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Field Navigation */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
              {Object.entries(form.fields)
                .filter(([key]) => shouldShowField(key))
                .map(([key, field]) => (
                  <button
                    key={key}
                    className={`glass-button ${currentField === key ? 'primary' : ''}`}
                    onClick={() => setCurrentField(key)}
                    style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.75rem' }}
                  >
                    {completedFields[key] ? (
                      <CheckCircle size={12} style={{ marginRight: '4px', color: 'var(--color-success)' }} />
                    ) : (
                      <span style={{ marginRight: '4px' }}>○</span>
                    )}
                    {field.question.split(' ')[0]}
                  </button>
                ))}
            </div>

            {/* Current Field */}
            {currentField && form.fields[currentField] && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentField}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {(() => {
                    const field = form.fields[currentField]
                    const error = validationErrors[currentField]
                    const value = formData[currentField] || ''

                    return (
                      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {/* Question */}
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                            <HelpCircle size={16} style={{ color: 'var(--color-secondary)' }} />
                            <h3 style={{ margin: 0 }}>{field.question}</h3>
                          </div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            padding: 'var(--spacing-sm)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: '3px solid var(--color-secondary)'
                          }}>
                            {field.legalLanguage}
                          </p>
                        </div>

                        {/* Input Field */}
                        {field.options ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                            {field.options.map((option) => (
                              <button
                                key={option.value}
                                className={`glass-button ${value === option.value ? 'primary' : ''}`}
                                onClick={() => handleFieldChange(currentField, option.value)}
                                style={{
                                  padding: 'var(--spacing-md)',
                                  textAlign: 'left',
                                  border: value === option.value ? '1px solid var(--color-secondary)' : '1px solid var(--glass-border)'
                                }}
                              >
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{option.label}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{option.description}</div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <input
                              type="text"
                              className="glass-input"
                              placeholder={`Enter ${field.question.toLowerCase()}...`}
                              value={value}
                              onChange={(e) => handleFieldChange(currentField, e.target.value)}
                              style={{ width: '100%', fontSize: '1rem', padding: 'var(--spacing-md)' }}
                            />
                            {error && (
                              <div style={{
                                marginTop: 'var(--spacing-sm)',
                                padding: 'var(--spacing-sm)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-danger)',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)'
                              }}>
                                <AlertTriangle size={16} />
                                {error}
                              </div>
                            )}
                          </div>
                        )}

                        {/* What Happens If Wrong */}
                        {field.whatHappensIfWrong && (
                          <div style={{
                            marginBottom: 'var(--spacing-lg)',
                            padding: 'var(--spacing-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-md)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)', color: 'var(--color-danger)', fontWeight: '600' }}>
                              <AlertTriangle size={16} />
                              What Happens If You Get This Wrong
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {field.whatHappensIfWrong}
                            </p>
                          </div>
                        )}

                        {/* Context Tips */}
                        {field.contextTips && (
                          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <button
                              className="glass-button"
                              onClick={() => setShowTips(prev => ({ ...prev, [currentField]: !prev[currentField] }))}
                              style={{ width: '100%', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <Lightbulb size={16} style={{ color: 'var(--color-warning)' }} />
                                Tips & Context
                              </span>
                              {showTips[currentField] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            <AnimatePresence>
                              {showTips[currentField] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    borderRadius: 'var(--radius-md)'
                                  }}
                                >
                                  <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                                    {field.contextTips.map((tip, i) => (
                                      <li key={i} style={{ marginBottom: '4px', fontSize: '0.875rem' }}>{tip}</li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* Example Answers */}
                        {field.exampleAnswers && (
                          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <button
                              className="glass-button"
                              onClick={() => setShowExamples(!showExamples)}
                              style={{ width: '100%', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <Eye size={16} style={{ color: 'var(--color-success)' }} />
                                Example Answers
                              </span>
                              {showExamples ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            <AnimatePresence>
                              {showExamples && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--spacing-sm)'
                                  }}
                                >
                                  {field.exampleAnswers.map((example, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        position: 'relative'
                                      }}
                                    >
                                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', paddingRight: '40px' }}>
                                        {example}
                                      </p>
                                      <button
                                        onClick={() => copyExample(example)}
                                        style={{
                                          position: 'absolute',
                                          top: 'var(--spacing-sm)',
                                          right: 'var(--spacing-sm)',
                                          background: 'transparent',
                                          border: 'none',
                                          cursor: 'pointer',
                                          color: 'var(--color-secondary)'
                                        }}
                                        title="Copy to clipboard"
                                      >
                                        <Copy size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* Common Mistakes */}
                        {field.commonMistakes && (
                          <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-warning)', fontWeight: '600' }}>
                              <AlertTriangle size={16} />
                              Common Mistakes to Avoid
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                              {field.commonMistakes.map((mistake, i) => (
                                <li key={i} style={{ marginBottom: '4px', fontSize: '0.875rem' }}>{mistake}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-xl)' }}>
                          <button
                            className="glass-button"
                            onClick={() => {
                              const keys = Object.entries(form.fields).filter(([key]) => shouldShowField(key)).map(([k]) => k)
                              const currentIndex = keys.indexOf(currentField)
                              if (currentIndex > 0) setCurrentField(keys[currentIndex - 1])
                            }}
                          >
                            <ArrowLeft size={16} style={{ marginRight: '4px' }} />
                            Previous
                          </button>
                          <button
                            className="glass-button primary"
                            onClick={() => {
                              const keys = Object.entries(form.fields).filter(([key]) => shouldShowField(key)).map(([k]) => k)
                              const currentIndex = keys.indexOf(currentField)
                              if (currentIndex < keys.length - 1) setCurrentField(keys[currentIndex + 1])
                            }}
                          >
                            Next
                            <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar - Help */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {/* Plain Language Guide */}
            <div className="glass" style={{ padding: 'var(--spacing-lg)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-md) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <BookOpen size={18} style={{ color: 'var(--color-secondary)' }} />
                How This Works
              </h4>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>1. Plain Language</strong><br />
                  Each question is translated from legalese to plain English you can understand.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>2. Context Tips</strong><br />
                  Click to see tips specific to your situation and common pitfalls.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>3. Examples</strong><br />
                  See real example answers that match what's accepted.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>4. Error Prevention</strong><br />
                  Real-time validation catches mistakes before you submit.
                </p>
              </div>
            </div>

            {/* Completion Status */}
            <div className="glass" style={{ padding: 'var(--spacing-lg)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-md) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Target size={18} style={{ color: 'var(--color-success)' }} />
                Your Progress
              </h4>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Fields Complete</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                    {Object.keys(form.fields).filter(shouldShowField).filter(k => completedFields[k]).length} / {Object.keys(form.fields).filter(shouldShowField).length}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${getProgress()}%`,
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {getProgress() === 100 ? '✓ Form ready for review!' : 'Continue filling out fields to complete the form.'}
              </div>
            </div>

            {/* Need Help */}
            <div className="glass" style={{ padding: 'var(--spacing-lg)', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <h4 style={{ margin: '0 0 var(--spacing-md) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--color-secondary)' }}>
                <HelpCircle size={18} />
                Need More Help?
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                If you have complex circumstances or this form is causing confusion, consider speaking with an immigration attorney.
              </p>
              <button className="glass-button primary" style={{ width: '100%' }}>
                <Users size={16} style={{ marginRight: '4px' }} />
                Find an Attorney
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormCompletionAssistant
