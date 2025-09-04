import React, { useEffect, useMemo, useState } from 'react';
import './Settings.css';
import i18n from 'i18next';

// Utility functions for validation and confirmation
const showConfirmation = (message) => {
  return window.confirm(message);
};

const showAlert = (message) => {
  window.alert(message);
};

const validateNumberInput = (value, min, max, fieldName) => {
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    showAlert(`${fieldName} must be a valid number.`);
    return false;
  }
  if (num < min || num > max) {
    showAlert(`${fieldName} must be between ${min} and ${max}.`);
    return false;
  }
  return true;
};

const validateTimeInput = (value, fieldName) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(value)) {
    showAlert(`${fieldName} must be in HH:MM format.`);
    return false;
  }
  return true;
};

// Key used for localStorage persistence
const STORAGE_KEY = 'appSettings';

const defaultSettings = {
  theme: 'light',
  appearance: {
    fontSize: 'medium',
    layoutDensity: 'comfortable',
  },
  userPreferences: {
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    currency: 'LKR',
    timezone: 'Asia/Colombo',
    itemsPerPage: 10,
    numberFormat: '1,234.56',
  },
  company: {
    name: 'WELL VISION',
    address: 'Kalawewa Junction, Galewela',
    phones: '+94 664336709 / +94 777 136 79',
    email: 'wellvision.lk@gmail.com',
    logoUrl: '/logo.png',
    website: 'https://wellvision.lk',
    taxNumber: '123456789',
  },
  invoice: {
    tagline: 'THE PATH TO CLEAR VISION',
    brNumber: 'BR.No. PV00281194',
    servicesText:
      'Specialized eye channelling + Investigation, theater, glaucoma diagnosis + Treatment, computerized eye testing + optical paradise, Spectacle Frames, Lenses, Contact Lenses + Colour Contact Lenses, Sun Glasses',
    cityLabel: 'Galewela',
    signatureLabel: 'Signature',
    defaultDueDays: 30,
    taxRate: 0,
    includeTax: false,
  },
  appointments: {
    defaultDuration: 30,
    reminderTime: 15,
    allowOnlineBooking: true,
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
  },
  inventory: {
    lowStockThreshold: 5,
    autoReorder: false,
    reorderPoint: 10,
    defaultSupplier: '',
  },
  notifications: {
    invoiceSavedToast: true,
    lowStockAlerts: true,
    appointmentReminders: true,
    emailNotifications: true,
    smsNotifications: false,
    notificationTone: 'default',
  },
  security: {
    sessionTimeout: 60,
    passwordExpiry: 90,
    twoFactorAuth: false,
    loginAttempts: 5,
    loginHistory: [],
    activeSessions: [],
  },
  system: {
    defaultReceiptPrinter: '',
    keyboardShortcuts: {
      printReceipt: 'Ctrl+P',
      newInvoice: 'Ctrl+N',
      saveInvoice: 'Ctrl+S',
    },
  },
  privacy: {
    dataVisibility: 'private',
    allowDataExport: true,
  },
  reports: {
    defaultPeriod: 'monthly',
    autoGenerate: false,
    exportFormat: 'pdf',
    includeCharts: true,
  },
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed,
      appearance: { ...defaultSettings.appearance, ...(parsed.appearance || {}) },
      userPreferences: { ...defaultSettings.userPreferences, ...(parsed.userPreferences || {}) },
      company: { ...defaultSettings.company, ...(parsed.company || {}) },
      invoice: { ...defaultSettings.invoice, ...(parsed.invoice || {}) },
      appointments: { ...defaultSettings.appointments, ...(parsed.appointments || {}) },
      inventory: { ...defaultSettings.inventory, ...(parsed.inventory || {}) },
      notifications: { ...defaultSettings.notifications, ...(parsed.notifications || {}) },
      security: { ...defaultSettings.security, ...(parsed.security || {}) },
      system: { ...defaultSettings.system, ...(parsed.system || {}) },
      privacy: { ...defaultSettings.privacy, ...(parsed.privacy || {}) },
      reports: { ...defaultSettings.reports, ...(parsed.reports || {}) },
    };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-light', 'theme-dark');
  body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
}

function applyAppearance(appearance) {
  const body = document.body;
  // Font size
  body.classList.remove('font-small', 'font-medium', 'font-large');
  const size = appearance?.fontSize || 'medium';
  body.classList.add(`font-${size}`);
  // Density
  body.classList.remove('density-comfortable', 'density-compact', 'density-cosy');
  const density = appearance?.layoutDensity || 'comfortable';
  body.classList.add(`density-${density}`);
}

// Backend API base (configurable via env)
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

async function fetchServerSettings() {
  try {
    const res = await fetch(`${API_BASE}/api/user/settings`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.settings || null;
  } catch (e) {
    return null;
  }
}

async function saveSettingsToServer(settings) {
  const res = await fetch(`${API_BASE}/api/user/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}

export default function Settings() {
  const initial = useMemo(loadSettings, []);
  const [settings, setSettings] = useState(initial);
  const [savedMsg, setSavedMsg] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Hydrate from server on mount (fallback to localStorage if no server data)
  useEffect(() => {
    (async () => {
      const server = await fetchServerSettings();
      if (server && Object.keys(server).length > 0) {
        // Merge with defaults to ensure missing keys are filled
        const merged = {
          ...defaultSettings,
          ...server,
          appearance: { ...defaultSettings.appearance, ...(server.appearance || {}) },
          userPreferences: { ...defaultSettings.userPreferences, ...(server.userPreferences || {}) },
          company: { ...defaultSettings.company, ...(server.company || {}) },
          invoice: { ...defaultSettings.invoice, ...(server.invoice || {}) },
          appointments: { ...defaultSettings.appointments, ...(server.appointments || {}) },
          inventory: { ...defaultSettings.inventory, ...(server.inventory || {}) },
          notifications: { ...defaultSettings.notifications, ...(server.notifications || {}) },
          security: { ...defaultSettings.security, ...(server.security || {}) },
          system: { ...defaultSettings.system, ...(server.system || {}) },
          privacy: { ...defaultSettings.privacy, ...(server.privacy || {}) },
          reports: { ...defaultSettings.reports, ...(server.reports || {}) },
        };
        setSettings(merged);
        saveSettings(merged); // keep local cache in sync
      }
    })();
  }, []);

  // Apply theme on mount and when changed
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Apply appearance (font size + density) globally
  useEffect(() => {
    applyAppearance(settings.appearance);
  }, [settings.appearance]);

  // Apply language immediately when changed and on initial load
  useEffect(() => {
    const lang = settings.userPreferences?.language || 'en';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      try { localStorage.setItem('i18nextLng', lang); } catch {}
    }
  }, [settings.userPreferences?.language]);

  // Helper to set nested keys like "workingHours.start"
  const setNested = (obj, path, val) => {
    const parts = path.split('.');
    const last = parts.pop();
    let cur = obj;
    for (const p of parts) {
      if (!cur[p]) cur[p] = {};
      cur = cur[p];
    }
    cur[last] = val;
  };

  const onChange = (section, key) => (e) => {
    const raw = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const value = e.target.type === 'number' ? Number(raw) : raw;

    // Validation for specific fields
    if (section === 'userPreferences' && key === 'itemsPerPage') {
      if (!validateNumberInput(value, 5, 100, 'Items Per Page')) return;
    }
    if (section === 'security' && ['sessionTimeout', 'passwordExpiry', 'loginAttempts'].includes(key)) {
      const limits = {
        sessionTimeout: [15, 480],
        passwordExpiry: [30, 365],
        loginAttempts: [3, 10]
      };
      const [min, max] = limits[key];
      if (!validateNumberInput(value, min, max, key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))) return;
    }
    if (section === 'appointments' && ['defaultDuration', 'reminderTime'].includes(key)) {
      const limits = {
        defaultDuration: [15, 120],
        reminderTime: [0, 60]
      };
      const [min, max] = limits[key];
      if (!validateNumberInput(value, min, max, key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))) return;
    }
    if (section === 'inventory' && ['lowStockThreshold', 'reorderPoint'].includes(key)) {
      const limits = {
        lowStockThreshold: [1, 50],
        reorderPoint: [1, 100]
      };
      const [min, max] = limits[key];
      if (!validateNumberInput(value, min, max, key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))) return;
    }
    if (section === 'appointments' && ['workingHours.start', 'workingHours.end'].includes(key)) {
      const fieldName = key === 'workingHours.start' ? 'Working Hours Start' : 'Working Hours End';
      if (!validateTimeInput(value, fieldName)) return;
    }

    setSettings((prev) => {
      const next = { ...prev, [section]: { ...prev[section] } };
      if (key.includes('.')) {
        // nested key update
        setNested(next[section], key, value);
      } else {
        next[section][key] = value;
      }
      return next;
    });
    setSavedMsg('');
  };

  const saveAll = async () => {
    try {
      // Save to server first
      await saveSettingsToServer(settings);
      // Cache locally
      saveSettings(settings);
      setSavedMsg('Settings saved.');
    } catch (e) {
      setSavedMsg('Failed to save to server. Your changes are saved locally.');
      // still cache locally as fallback
      saveSettings(settings);
    }
  };

  const resetDefaults = () => {
    if (showConfirmation('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      setSettings(defaultSettings);
      saveSettings(defaultSettings);
      applyTheme(defaultSettings.theme);
      setSavedMsg('Reset to defaults.');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'wellvision-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (showConfirmation('Are you sure you want to import settings from this file? This will overwrite your current settings.')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target.result);
            setSettings({ ...defaultSettings, ...importedSettings });
            setSavedMsg('Settings imported successfully.');
          } catch (error) {
            setSavedMsg('Error importing settings. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const clearCache = () => {
    if (showConfirmation('Are you sure you want to clear all cached data? This will log you out and reset all unsaved changes.')) {
      localStorage.clear();
      setSavedMsg('Cache cleared. Please refresh the page.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'system', label: 'System', icon: '💻' },
    { id: 'advanced', label: 'Advanced', icon: '🔧' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-grid">
            {/* Company */}
            <section className="settings-card">
              <h3>Company Information</h3>
              <div className="form-row">
                <label>Company Name</label>
                <div className="read-only-field">{settings.company.name}</div>
              </div>
              <div className="form-row">
                <label>Address</label>
                <div className="read-only-field">{settings.company.address}</div>
              </div>
              <div className="form-row">
                <label>Phones</label>
                <div className="read-only-field">{settings.company.phones}</div>
              </div>
              <div className="form-row">
                <label>Email</label>
                <div className="read-only-field">{settings.company.email}</div>
              </div>
              <p className="hint">Company information is read-only and used in invoice header and dashboard branding.</p>
            </section>

            {/* User Preferences */}
            <section className="settings-card">
              <h3>User Preferences</h3>
              <div className="form-row">
                <label>Language</label>
                <select
                  value={settings.userPreferences.language}
                  onChange={(e) => {
                    onChange('userPreferences', 'language')(e);
                    try { localStorage.setItem('i18nextLng', e.target.value); } catch {}
                    // No reload needed; components read i18n directly where used
                  }}
                >
                  <option value="en">English</option>
                  <option value="si">Sinhala</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
              <div className="form-row">
                <label>Date Format</label>
                <select
                  value={settings.userPreferences.dateFormat}
                  onChange={onChange('userPreferences', 'dateFormat')}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="form-row">
                <label>Currency</label>
                <select
                  value={settings.userPreferences.currency}
                  onChange={(e) => {
                    onChange('userPreferences', 'currency')(e);
                    try { localStorage.setItem('preferredCurrency', e.target.value); } catch {}
                  }}
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <small className="hint">You can add more currencies in future updates.</small>
              </div>
              <div className="form-row">
                <label>Items Per Page</label>
                <input
                  type="number"
                  value={settings.userPreferences.itemsPerPage}
                  onChange={onChange('userPreferences', 'itemsPerPage')}
                  min="5"
                  max="100"
                />
              </div>
              <p className="hint">Personalize your dashboard experience.</p>
            </section>

            {/* Invoice */}
            <section className="settings-card">
              <h3>Invoice Preferences</h3>
              <div className="form-row">
                <label>Tagline</label>
                <input value={settings.invoice.tagline} onChange={onChange('invoice', 'tagline')} placeholder="THE PATH TO CLEAR VISION" />
              </div>
              <div className="form-row">
                <label>Business Reg. Number</label>
                <input value={settings.invoice.brNumber} onChange={onChange('invoice', 'brNumber')} placeholder="BR.No. ..." />
              </div>
              <div className="form-row">
                <label>Services Text</label>
                <textarea value={settings.invoice.servicesText} onChange={onChange('invoice', 'servicesText')} rows={4} />
              </div>
              <div className="form-row">
                <label>City Label</label>
                <input value={settings.invoice.cityLabel} onChange={onChange('invoice', 'cityLabel')} placeholder="Galewela" />
              </div>
              <div className="form-row">
                <label>Signature Label</label>
                <input value={settings.invoice.signatureLabel} onChange={onChange('invoice', 'signatureLabel')} placeholder="Signature" />
              </div>
              <p className="hint">Applied in the invoice page if present.</p>
            </section>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-grid">
            {/* Theme & Appearance */}
            <section className="settings-card">
              <h3>Theme & Appearance</h3>
              <div className="form-row">
                <label htmlFor="theme-select">Theme</label>
                <select id="theme-select" value={settings.theme} onChange={(e) => setSettings((p) => ({ ...p, theme: e.target.value }))}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="form-row">
                <label>Font Size</label>
                <select value={settings.appearance.fontSize} onChange={onChange('appearance', 'fontSize')}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="form-row">
                <label>Layout Density</label>
                <select value={settings.appearance.layoutDensity} onChange={onChange('appearance', 'layoutDensity')}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </div>
              <p className="hint">Customize the visual appearance of the application.</p>
            </section>
          </div>
        );

      case 'security':
        return (
          <div className="settings-grid">
            {/* Security */}
            <section className="settings-card">
              <h3>Security Settings</h3>
              <div className="form-row">
                <label>Session Timeout (minutes)</label>
                <input type="number" value={settings.security.sessionTimeout} onChange={onChange('security', 'sessionTimeout')} min="15" max="480" />
              </div>
              <div className="form-row">
                <label>Password Expiry (days)</label>
                <input type="number" value={settings.security.passwordExpiry} onChange={onChange('security', 'passwordExpiry')} min="30" max="365" />
              </div>
              <div className="form-row">
                <label>Max Login Attempts</label>
                <input type="number" value={settings.security.loginAttempts} onChange={onChange('security', 'loginAttempts')} min="3" max="10" />
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => setSettings((p) => ({ ...p, security: { ...p.security, twoFactorAuth: e.target.checked } }))}
                  />
                  Enable two-factor authentication
                </label>
              </div>
              <p className="hint">Configure security and access control settings.</p>
            </section>

            {/* Login History */}
            <section className="settings-card">
              <h3>Login History</h3>
              <div className="form-row">
                <label>Last Login</label>
                <div className="read-only-field">2024-01-15 09:30 AM - Chrome on Windows</div>
              </div>
              <div className="form-row">
                <label>IP Address</label>
                <div className="read-only-field">192.168.1.100</div>
              </div>
              <p className="hint">View your recent login activity.</p>
            </section>

            {/* Active Sessions */}
            <section className="settings-card">
              <h3>Active Sessions</h3>
              <div className="form-row">
                <label>Current Session</label>
                <div className="read-only-field">Chrome on Windows - Active now</div>
              </div>
              <div className="form-row">
                <button className="secondary" style={{ marginTop: '10px' }}>Log out from all other devices</button>
              </div>
              <p className="hint">Manage your active sessions across devices.</p>
            </section>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-grid">
            {/* Notifications */}
            <section className="settings-card">
              <h3>Notification Preferences</h3>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.invoiceSavedToast}
                    onChange={(e) => setSettings((p) => ({ ...p, notifications: { ...p.notifications, invoiceSavedToast: e.target.checked } }))}
                  />
                  Show toast when invoice is saved
                </label>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowStockAlerts}
                    onChange={(e) => setSettings((p) => ({ ...p, notifications: { ...p.notifications, lowStockAlerts: e.target.checked } }))}
                  />
                  Enable low stock alerts
                </label>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.appointmentReminders}
                    onChange={(e) => setSettings((p) => ({ ...p, notifications: { ...p.notifications, appointmentReminders: e.target.checked } }))}
                  />
                  Enable appointment reminders
                </label>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => setSettings((p) => ({ ...p, notifications: { ...p.notifications, emailNotifications: e.target.checked } }))}
                  />
                  Enable email notifications
                </label>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => setSettings((p) => ({ ...p, notifications: { ...p.notifications, smsNotifications: e.target.checked } }))}
                  />
                  Enable SMS notifications
                </label>
              </div>
              <div className="form-row">
                <label>Notification Tone</label>
                <select value={settings.notifications.notificationTone} onChange={onChange('notifications', 'notificationTone')}>
                  <option value="default">Default</option>
                  <option value="bell">Bell</option>
                  <option value="chime">Chime</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="form-row">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE}/api/notifications/test/email`, { method: 'POST', credentials: 'include' });
                      const data = await res.json();
                      setSavedMsg(data.success ? 'Test email sent.' : (data.message || 'Failed to send test email'));
                    } catch (e) {
                      setSavedMsg('Failed to send test email');
                    }
                  }}
                  style={{ marginRight: 8 }}
                >
                  Send test email
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={async () => {
                    try {
                      const phone = prompt('Enter phone number with country code (e.g., +94xxxxxxxxx):');
                      const res = await fetch(`${API_BASE}/api/notifications/test/sms`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ phone })
                      });
                      const data = await res.json();
                      setSavedMsg(data.success ? 'Test SMS sent' : (data.message || 'Failed to send test SMS'));
                    } catch (e) {
                      setSavedMsg('Failed to invoke SMS test');
                    }
                  }}
                >
                  Send test SMS
                </button>
              </div>
              <p className="hint">Choose which notifications you want to receive.</p>
            </section>
          </div>
        );

      case 'system':
        return (
          <div className="settings-grid">
            {/* Appointments */}
            <section className="settings-card">
              <h3>Appointment Settings</h3>
              <div className="form-row">
                <label>Default Duration (minutes)</label>
                <input type="number" value={settings.appointments.defaultDuration} onChange={onChange('appointments', 'defaultDuration')} min="15" max="120" />
              </div>
              <div className="form-row">
                <label>Reminder Time (minutes)</label>
                <input type="number" value={settings.appointments.reminderTime} onChange={onChange('appointments', 'reminderTime')} min="0" max="60" />
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.appointments.allowOnlineBooking}
                    onChange={(e) => setSettings((p) => ({ ...p, appointments: { ...p.appointments, allowOnlineBooking: e.target.checked } }))}
                  />
                  Allow online booking
                </label>
              </div>
              <div className="form-row">
                <label>Working Hours Start</label>
                <input type="time" value={settings.appointments.workingHours.start} onChange={onChange('appointments', 'workingHours.start')} />
              </div>
              <div className="form-row">
                <label>Working Hours End</label>
                <input type="time" value={settings.appointments.workingHours.end} onChange={onChange('appointments', 'workingHours.end')} />
              </div>
              <p className="hint">Configure appointment scheduling preferences.</p>
            </section>

            {/* Inventory */}
            <section className="settings-card">
              <h3>Inventory Management</h3>
              <div className="form-row">
                <label>Low Stock Threshold</label>
                <input type="number" value={settings.inventory.lowStockThreshold} onChange={onChange('inventory', 'lowStockThreshold')} min="1" max="50" />
              </div>
              <div className="form-row">
                <label>Reorder Point</label>
                <input type="number" value={settings.inventory.reorderPoint} onChange={onChange('inventory', 'reorderPoint')} min="1" max="100" />
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.inventory.autoReorder}
                    onChange={(e) => setSettings((p) => ({ ...p, inventory: { ...p.inventory, autoReorder: e.target.checked } }))}
                  />
                  Enable auto-reorder
                </label>
              </div>
              <div className="form-row">
                <label>Default Supplier</label>
                <input value={settings.inventory.defaultSupplier} onChange={onChange('inventory', 'defaultSupplier')} placeholder="Supplier name" />
              </div>
              <p className="hint">Manage inventory alerts and reordering.</p>
            </section>

            {/* Reports */}
            <section className="settings-card">
              <h3>Report Settings</h3>
              <div className="form-row">
                <label>Default Report Period</label>
                <select value={settings.reports.defaultPeriod} onChange={onChange('reports', 'defaultPeriod')}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-row">
                <label>Export Format</label>
                <select value={settings.reports.exportFormat} onChange={onChange('reports', 'exportFormat')}>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.reports.autoGenerate}
                    onChange={(e) => setSettings((p) => ({ ...p, reports: { ...p.reports, autoGenerate: e.target.checked } }))}
                  />
                  Auto-generate reports
                </label>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.reports.includeCharts}
                    onChange={(e) => setSettings((p) => ({ ...p, reports: { ...p.reports, includeCharts: e.target.checked } }))}
                  />
                  Include charts in reports
                </label>
              </div>
              <p className="hint">Configure report generation and export preferences.</p>
            </section>
          </div>
        );

      case 'advanced':
        return (
          <div className="settings-grid">
            {/* Keyboard Shortcuts */}
            <section className="settings-card">
              <h3>Keyboard Shortcuts</h3>
              <div className="form-row">
                <label>Print Receipt</label>
                <input value={settings.system.keyboardShortcuts.printReceipt} onChange={(e) => setSettings((p) => ({ ...p, system: { ...p.system, keyboardShortcuts: { ...p.system.keyboardShortcuts, printReceipt: e.target.value } } }))} placeholder="Ctrl+P" />
              </div>
              <div className="form-row">
                <label>New Invoice</label>
                <input value={settings.system.keyboardShortcuts.newInvoice} onChange={(e) => setSettings((p) => ({ ...p, system: { ...p.system, keyboardShortcuts: { ...p.system.keyboardShortcuts, newInvoice: e.target.value } } }))} placeholder="Ctrl+N" />
              </div>
              <div className="form-row">
                <label>Save Invoice</label>
                <input value={settings.system.keyboardShortcuts.saveInvoice} onChange={(e) => setSettings((p) => ({ ...p, system: { ...p.system, keyboardShortcuts: { ...p.system.keyboardShortcuts, saveInvoice: e.target.value } } }))} placeholder="Ctrl+S" />
              </div>
              <p className="hint">Customize keyboard shortcuts for quick actions.</p>
            </section>

            {/* System Preferences */}
            <section className="settings-card">
              <h3>System Preferences</h3>
              <div className="form-row">
                <label>Default Receipt Printer</label>
                <input value={settings.system.defaultReceiptPrinter} onChange={onChange('system', 'defaultReceiptPrinter')} placeholder="Select printer" />
              </div>
              <div className="form-row">
                <label>Number Format</label>
                <select value={settings.userPreferences.numberFormat} onChange={onChange('userPreferences', 'numberFormat')}>
                  <option value="1,234.56">1,234.56</option>
                  <option value="1 234,56">1 234,56</option>
                  <option value="1234.56">1234.56</option>
                </select>
              </div>
              <div className="form-row">
                <label>Timezone</label>
                <select value={settings.userPreferences.timezone} onChange={onChange('userPreferences', 'timezone')}>
                  <option value="Asia/Colombo">Asia/Colombo (UTC+5:30)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                </select>
              </div>
              <p className="hint">Configure system-wide preferences.</p>
            </section>

            {/* Data & Privacy */}
            <section className="settings-card">
              <h3>Data & Privacy</h3>
              <div className="form-row">
                <label>Data Visibility</label>
                <select value={settings.privacy.dataVisibility} onChange={onChange('privacy', 'dataVisibility')}>
                  <option value="private">Private</option>
                  <option value="team">Team Only</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <div className="form-row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.privacy.allowDataExport}
                    onChange={(e) => setSettings((p) => ({ ...p, privacy: { ...p.privacy, allowDataExport: e.target.checked } }))}
                  />
                  Allow data export
                </label>
              </div>
              <div className="form-row">
                <button onClick={exportSettings} style={{ marginTop: '10px' }}>Export Settings</button>
              </div>
              <div className="form-row">
                <label htmlFor="import-file">Import Settings</label>
                <input type="file" id="import-file" accept=".json" onChange={importSettings} style={{ marginTop: '5px' }} />
              </div>
              <div className="form-row">
                <button className="secondary" onClick={clearCache} style={{ marginTop: '10px' }}>Clear Cache</button>
              </div>
              <p className="hint">Manage your data and privacy settings.</p>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        <div className="settings-actions">
          <button onClick={saveAll}>Save</button>
          <button className="secondary" onClick={resetDefaults}>Reset</button>
        </div>
      </div>

      {savedMsg && <p className="settings-message">{savedMsg}</p>}

      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}
