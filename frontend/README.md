# RoadAI Assistant Dashboard - React Version

A modern React dashboard for managing AI voice agent calls, analytics, and customer relationships. This is a complete conversion of the original HTML/CSS/JS dashboard to React 18+ with functional components and hooks.

## Features

- **Authentication**: Beautiful login and registration pages with Google OAuth support
- **Dashboard**: Overview with stats, quick actions, and setup checklist
- **Agents**: Agent management with table view, add/edit/delete functionality
- **Call History**: View and manage all customer calls with filtering
- **Analytics**: Performance metrics, charts, and insights
- **CRM**: Customer relationship management with insurance integration
- **Invoicing**: Billing management and insurance company coordination
- **Settings**: AI agent configuration and business settings
- **Team Management**: User roles, permissions, and invitations
- **Support**: Help center with FAQ and resources

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── Agents/             # Agent-related components
│   │   ├── AgentList.jsx
│   │   ├── AgentForm.jsx
│   │   ├── AgentManage.jsx
│   │   └── ... (other agent components)
│   ├── Dashboard.jsx       # Main dashboard layout
│   ├── Navbar.jsx          # Top navigation bar
│   └── Sidebar.jsx         # Sidebar navigation menu
├── pages/
│   ├── LoginPage.jsx       # Login page with Google OAuth
│   ├── RegisterPage.jsx    # Registration page with avatar upload
│   ├── DashboardPage.jsx   # Main dashboard page
│   ├── AgentsPage.jsx      # Agent management page
│   ├── CallsPage.jsx       # Call history page
│   ├── AnalyticsPage.jsx   # Analytics and metrics page
│   ├── CRMPage.jsx         # Customer management page
│   ├── InvoicingPage.jsx   # Billing and invoicing page
│   ├── SettingsPage.jsx    # AI settings page
│   ├── TeamPage.jsx        # Team management page
│   └── SupportPage.jsx     # Help and support page
├── App.jsx                 # Main app component with React Router
├── App.css                 # Global styles (converted from dashboard.css)
├── index.css               # Tailwind CSS imports
└── index.js                # React app entry point
```

## Key Features Converted

### JavaScript Functionality → React Hooks

- **Page Navigation**: Converted to React state management with `useState`
- **Search & Filtering**: Implemented with controlled components and `useState`
- **Modal Management**: State-based modal visibility with `useState`
- **Form Handling**: Controlled form inputs with `useState`
- **Settings Save**: Button state management with loading states
- **FAQ Accordion**: Collapsible sections with `useState`
- **Scroll to Top**: Automatic scrolling on page change with `useEffect`

### Interactive Elements

- All buttons show console logs and alerts (as per original functionality)
- Search inputs log search terms to console
- Filter dropdowns log filter changes to console
- Modal forms handle submission with alerts
- Settings save button shows loading and success states

## Styling

The original CSS has been preserved exactly as `App.css` with:
- All original classes and styling intact
- Responsive design maintained
- Color scheme and typography preserved
- Animations and transitions working
- No visual changes from the original

## Browser Compatibility

- Modern browsers supporting ES6+
- React 18+ features
- CSS Grid and Flexbox support required

## Development Notes

- All components are functional components using React hooks
- State management is handled locally within components
- No external state management library required
- Console logging maintained for debugging (as in original)
- Alert dialogs used for user feedback (as in original)

## Production Considerations

For production deployment, consider:
- Replacing console.log statements with proper logging
- Replacing alert() calls with proper UI notifications
- Adding error boundaries for better error handling
- Implementing proper API integration
- Adding loading states and error handling
- Implementing proper form validation

## Original Files

The original files are preserved in the project root:
- `dashboard.html` - Original HTML structure
- `dashboard.css` - Original CSS (now in `src/App.css`)
- `dashboard.js` - Original JavaScript functionality (converted to React hooks)

This React version maintains 100% visual fidelity with the original while providing modern React architecture and maintainability.
