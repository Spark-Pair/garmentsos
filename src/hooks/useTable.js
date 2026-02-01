// hooks/useTable.js
import { useState, useCallback, useMemo } from 'react';

export const useTable = (initialFilters = {}, initialSort = { sortBy: 'created_at', order: 'desc' }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });

  // Sorting Handler
  const handleSort = useCallback((columnKey) => {
    setSort(prev => ({
      sortBy: columnKey,
      order: prev.sortBy === columnKey && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Filter Handlers
  const applyFilters = useCallback(() => {
    setFilters({ ...tempFilters });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [tempFilters]);

  const resetFilters = useCallback(() => {
    setTempFilters(initialFilters);
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [initialFilters]);

  const activeFilterCount = useMemo(() => 
    Object.values(filters).filter(v => v !== '' && v !== null).length, 
  [filters]);

  return {
    filters, tempFilters, setTempFilters,
    sort, handleSort,
    pagination, setPagination,
    applyFilters, resetFilters,
    activeFilterCount
  };
};