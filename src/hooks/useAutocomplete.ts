import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type AutocompleteMode = "local" | "remote";

type FnGetData<T> = (
  params: any,
  callback: (data: T[]) => void
) => void;

type CacheEntry<T> = {
  options: T[];
  page: number;
  hasMore: boolean;
  updatedAt: number;
};

const autocompleteCache = new Map<string, CacheEntry<any>>();

export const clearAutocompleteCache = (cacheKey: string) => {
  autocompleteCache.delete(cacheKey);
};

export const clearAutocompleteCacheByPrefix = (prefix: string) => {
  Array.from(autocompleteCache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      autocompleteCache.delete(key);
    }
  });
};

type UseAutocompleteRemoteProps<T> = {
  cacheKey: string;
  mode?: AutocompleteMode;
  data?: T[];
  params?: any;
  fnGetData?: FnGetData<T>;
  pageSize?: number;
  enabled?: boolean;
  ttlMs?: number;
};

export const useAutocomplete = <T,>({
  cacheKey,
  mode = "local",
  data,
  params,
  fnGetData,
  pageSize = 10,
  enabled = true,
  ttlMs = 5 * 60 * 1000,
}: UseAutocompleteRemoteProps<T>) => {
  const [options, setOptions] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const requestIdRef = useRef(0);

  const paramsKey = useMemo(() => {
    return JSON.stringify(params ?? {});
  }, [params]);

  const finalCacheKey = useMemo(() => {
    return `${cacheKey}::${paramsKey}`;
  }, [cacheKey, paramsKey]);

  const setCache = useCallback(
    (entry: CacheEntry<T>) => {
      autocompleteCache.set(finalCacheKey, entry);
    },
    [finalCacheKey]
  );

  const loadFirstPage = useCallback(() => {
    if (!enabled) return;

    if (mode === "local") {
      const localOptions = data ?? [];
      setOptions(localOptions);
      setPage(0);
      setHasMore(false);

      setCache({
        options: localOptions,
        page: 0,
        hasMore: false,
        updatedAt: Date.now(),
      });

      return;
    }

    if (!fnGetData) return;

    const cached = autocompleteCache.get(finalCacheKey) as
      | CacheEntry<T>
      | undefined;

    const isCacheValid =
      cached && Date.now() - cached.updatedAt <= ttlMs;

    if (isCacheValid) {
      setOptions(cached.options);
      setPage(cached.page);
      setHasMore(cached.hasMore);
      return;
    }

    const requestId = ++requestIdRef.current;

    setLoading(true);

    fnGetData(
      {
        ...params,
        page: 0,
        pageSize,
      },
      (result) => {
        if (requestId !== requestIdRef.current) return;

        const nextHasMore = result.length >= pageSize;

        setOptions(result);
        setPage(0);
        setHasMore(nextHasMore);
        setLoading(false);

        setCache({
          options: result,
          page: 0,
          hasMore: nextHasMore,
          updatedAt: Date.now(),
        });
      }
    );
  }, [
    enabled,
    mode,
    data,
    fnGetData,
    finalCacheKey,
    params,
    pageSize,
    ttlMs,
    setCache,
  ]);

  const loadNextPage = useCallback(() => {
    if (!enabled) return;
    if (mode !== "remote") return;
    if (!fnGetData) return;
    if (loading) return;
    if (!hasMore) return;

    const nextPage = page + 1;
    const requestId = ++requestIdRef.current;

    setLoading(true);

    fnGetData(
      {
        ...params,
        page: nextPage,
        pageSize,
      },
      (result) => {
        if (requestId !== requestIdRef.current) return;

        setOptions((prev) => {
          const merged = [...prev, ...result];
          const nextHasMore = result.length >= pageSize;

          setCache({
            options: merged,
            page: nextPage,
            hasMore: nextHasMore,
            updatedAt: Date.now(),
          });

          return merged;
        });

        setPage(nextPage);
        setHasMore(result.length >= pageSize);
        setLoading(false);
      }
    );
  }, [
    enabled,
    mode,
    fnGetData,
    loading,
    hasMore,
    page,
    params,
    pageSize,
    setCache,
  ]);

  const resetCache = useCallback(() => {
    autocompleteCache.delete(finalCacheKey);
    setOptions([]);
    setPage(0);
    setHasMore(true);
  }, [finalCacheKey]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadFirstPage();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
      requestIdRef.current += 1;
    };
  }, [loadFirstPage]);

  return {
    options,
    loading,
    hasMore,
    loadFirstPage,
    loadNextPage,
    resetCache,
    cacheKey: finalCacheKey,
  };
};