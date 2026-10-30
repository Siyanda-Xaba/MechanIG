import { useCallback, useEffect, useState } from 'react';

/**
 * Custom React hook for handling asynchronous requests in Super Admin screens.
 * 
 * @param {Function} asyncFn - The asynchronous function to execute
 * @param {boolean} immediate - Whether to execute immediately on mount (default true)
 * @returns {{ data: any, setData: Function, loading: boolean, error: string|null, reload: Function, execute: Function }}
 */
export default function useAsync(asyncFn, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFn(...args);
      setData(response);
      return response;
    } catch (err) {
      const message = err?.message || 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate && typeof asyncFn === 'function') {
      execute();
    }
  }, [execute, immediate, asyncFn]);

  return {
    data,
    setData,
    loading,
    error,
    reload: execute,
    execute,
  };
}