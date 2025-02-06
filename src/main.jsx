import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Make sure we're using the correct environment variable
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file");
}

const appearance = {
  layout: {
    socialButtonsVariant: "iconButton",
    socialButtonsPlacement: "bottom",
    termsPageUrl: "https://clerk.com/terms"
  },
  variables: {
    colorPrimary: '#ef4444',
    colorBackground: '#171717',
    colorText: '#ffffff',
    colorInputText: '#ffffff',
    colorInputBackground: '#262626',
    colorTextSecondary: '#a3a3a3',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  elements: {
    rootBox: "mx-auto",
    card: "bg-neutral-800 border border-neutral-700 shadow-xl",
    formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white",
    formFieldInput: "bg-neutral-700 border-neutral-600",
    footerActionLink: "text-red-500 hover:text-red-400",
    formFieldLabel: "text-neutral-300",
    dividerLine: "bg-neutral-700",
    dividerText: "text-neutral-400",
    formFieldHintText: "text-neutral-400",
    identityPreviewText: "text-neutral-300",
    identityPreviewEditButton: "text-red-500 hover:text-red-400",
    headerTitle: "text-neutral-100",
    headerSubtitle: "text-neutral-400",
    socialButtonsBlockButton: "border-neutral-700 bg-neutral-800 hover:bg-neutral-700",
    socialButtonsBlockButtonText: "text-neutral-300",
    formFieldSuccessText: "text-green-500",
    formFieldErrorText: "text-red-500"
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={appearance}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
