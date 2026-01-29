import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ConfigContext = createContext(null);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  const loadConfig = useCallback(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const [configRes, optionsRes] = await Promise.all([
      api.get('/config'),
      api.get('/options')
    ]);
    
    setConfig(configRes.data.data);
    setOptions(optionsRes.data.data);
    
    const expiryDate = new Date(configRes.data.data.subscriptionExpiry);
    if (new Date() > expiryDate) setIsExpired(true);

  } catch (error) {
    // Console mein error dikhega (Red color mein), wo normal hai.
    // Hum sirf data extract karenge.
    if (error.response?.status === 403) {
      setIsExpired(true);
      
      // Backend se jo 403 wala response aaya wo yahan error.response.data mein hai
      const expiredData = error.response.data;
      
      if (expiredData && (expiredData.data || expiredData.expiredOn)) {
        setConfig({
          subscriptionExpiry: expiredData.data?.subscriptionExpiry || expiredData.expiredOn,
          companyName: expiredData.data?.companyName || 'Your System'
        });
      }
    }
    console.warn("System in Lockdown Mode: Subscription Expired.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { loadConfig(); }, [loadConfig]);

  return (
    <ConfigContext.Provider value={{ config, options, loading, isExpired, loadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};