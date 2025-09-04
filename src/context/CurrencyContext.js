// CurrencyContext.js - global currency config + formatting
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CurrencyContext = createContext({
  currency: 'LKR',
  setCurrency: () => {},
  rates: {},
  format: (amount) => String(amount),
  convert: (amount, from, to) => amount,
  refreshRates: async () => {},
});

export function CurrencyProvider({ children, defaultCurrency = 'LKR', apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:4000' }) {
  const [currency, setCurrency] = useState(defaultCurrency);
  const [rates, setRates] = useState({}); // base LKR

  const fetchRates = async () => {
    try {
      const res = await fetch(`${apiBase}/api/forex/rates?base=LKR`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed rates');
      const data = await res.json();
      setRates(data.rates || {});
    } catch (e) {
      // Keep previous rates if offline
      console.warn('Using cached forex rates');
    }
  };

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convert = (amount, from, to) => {
    if (!amount || typeof amount !== 'number') return 0;
    if (from === to) return amount;
    // All stored in base LKR (as per requirement)
    if (from !== 'LKR') {
      // convert to LKR first
      const toLkr = amount / (rates[from] || 1);
      return to === 'LKR' ? toLkr : toLkr * (rates[to] || 1);
    }
    return amount * (rates[to] || 1);
  };

  const format = (amount) => {
    const locale = currency === 'LKR' ? 'en-LK' : currency === 'USD' ? 'en-US' : 'en-GB';
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount ?? 0);
    } catch {
      return `${currency} ${Number(amount ?? 0).toFixed(2)}`;
    }
  };

  // Memoize context value; helper functions are static closures
  const value = useMemo(
    () => ({ currency, setCurrency, rates, format, convert, refreshRates: fetchRates }),
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}