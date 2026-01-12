# AEGIS Immigration Platform

A comprehensive, AI-powered immigration case management platform built with React, Vite, and modern web technologies.

## Features

- **Dashboard** - Overview of active cases, recent activities, and AI insights
- **Eligibility Navigator** - Smart questionnaire with real-time eligibility assessment
- **Document Management** - Secure document upload, organization, and tracking
- **Form Generation** - Automated form completion with validation
- **Case Tracking** - Visual timeline and status monitoring
- **Interview Prep** - AI-powered mock interviews and practice sessions
- **Knowledge Base** - Comprehensive immigration resources and guides
- **Attorney Integration** - Connect with immigration attorneys
- **Post-Approval Guidance** - Step-by-step post-approval checklist
- **Adjudicator Insights** - Analytics and decision support

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM v6
- **State Management**: Zustand with enhanced store pattern
- **Styling**: Custom CSS with Glassmorphism design
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/aegis-platform.git
cd aegis-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment

The project can be easily deployed to:
- **Vercel** (recommended) - Connect your GitHub repository
- **Netlify** - Drag and drop the `dist` folder or connect repo
- **GitHub Pages** - Run `npm run build` and deploy the `dist` folder

## Project Structure

```
aegis-platform/
├── src/
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── EligibilityNavigator.jsx
│   │   ├── DocumentManagement.jsx
│   │   ├── FormGeneration.jsx
│   │   ├── CaseTracking.jsx
│   │   ├── InterviewPrep.jsx
│   │   ├── KnowledgeBase.jsx
│   │   ├── AttorneyIntegration.jsx
│   │   ├── PostApproval.jsx
│   │   └── AdjudicatorInsights.jsx
│   └── utils/
│       ├── enhancedStore.js # Global state management
│       └── store.js
├── public/
│   └── aegis-icon.svg
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Development Status

✅ Step 1: Visual Design - Complete  
✅ Step 2: Enhanced State Management (Core Pages) - Complete  
🔄 Step 3: Enhanced State Management (Remaining Pages) - In Progress  
📋 Step 4: Advanced Features & Integration - Planned  
📋 Step 5: Testing & Optimization - Planned

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For questions or support, please open an issue on GitHub.
