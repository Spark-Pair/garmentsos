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
    
    // Check if token exists before making calls to avoid 403
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [configRes, optionsRes] = await Promise.all([
        api.get('/config'),
        api.get('/options')
      ]);
      
      const configData = configRes.data.data;
      setConfig(configData);
      setOptions(optionsRes.data.data);
      
      const expiryDate = new Date(configData.subscriptionExpiry);
      setIsExpired(new Date() > expiryDate);
    } catch (error) {
      // Backend says 403? Subscription expired logic here
      if (error.response?.status === 403) {
        setIsExpired(true);
        // Important: Set partial config if backend provides it even on 403
        if (error.response.data?.data) {
           setConfig(error.response.data.data);
        }
      }
      console.error('Config Load Error:', error.response?.status);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const refreshOptions = useCallback(async () => {
    try {
      const response = await api.get('/options');
      setOptions(response.data.data);
    } catch (error) {
      console.error('Failed to refresh options:', error);
    }
  }, []);

  return (
    <ConfigContext.Provider value={{ config, options, loading, isExpired, loadConfig, refreshOptions }}>
      {children}
    </ConfigContext.Provider>
  );
};