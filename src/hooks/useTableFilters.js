import { useState, useCallback } from 'react';

export const useTableFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setFilterDrawerOpen(false);
  };

  const clearFilters = () => {
    setTempFilters(initialFilters);
    setFilters(initialFilters);
    setFilterDrawerOpen(false);
  };

  const updateTempFilter = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    tempFilters,
    filterDrawerOpen,
    setFilterDrawerOpen,
    applyFilters,
    clearFilters,
    updateTempFilter,
    activeFilterCount: Object.values(filters).filter(v => v !== '').length
  };
};