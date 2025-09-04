import React, { Suspense, lazy, Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// i18n setup
import './i18n/index';

// Import AuthProvider to manage authentication state
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

const App = lazy(() => import('./App'));

// Simple Error Boundary component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <CurrencyProvider>
            {/* Currency context wraps the app to enable formatting and conversion */}
            <App />
          </CurrencyProvider>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);

// Report web vitals with console logging
function sendToAnalytics(metric) {
  console.log('Web Vitals:', metric);
}

reportWebVitals(sendToAnalytics);
