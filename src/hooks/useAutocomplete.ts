import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AutocompleteMode = "local" | "remote";

export type FnGetData<T> = (
  params: Record<string, any>,
  callback: (result: T[]) => void
) => void;

export interface UseAutocompleteOptions<T> {
  /** Cache key — dùng để chia sẻ cache giữa nhiều instance cùng cacheKey */
  cacheKey: string;
  mode: AutocompleteMode;
  /** Static data — dùng cho local mode */
  data?: T[];
  /** Params truyền vào fnGetData (page, pageSize, filter, keyword…) */
  params?: Record<string, any>;
  /** Hàm gọi API — bắt buộc ở remote mode */
  fnGetData?: FnGetData<T>;
  pageSize?: number;
}

export interface UseAutocompleteReturn<T> {
  options: T[];
  loading: boolean;
  /** Gọi để load trang tiếp theo (infinite scroll) */
  loadNextPage: () => void;
  /** Reset về trang đầu và fetch lại */
  loadFirstPage: () => void;
}

// ---------------------------------------------------------------------------
// Module-level cache
// Dùng Map để nhiều component cùng cacheKey chia sẻ kết quả,
// tránh gọi API trùng lặp.
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  pages: T[][];        // pages[0] = trang 0, pages[1] = trang 1, …
  hasMore: boolean;    // còn trang tiếp theo không
  params: string;      // JSON.stringify(params) — detect khi params đổi
}

const cache = new Map<string, CacheEntry<any>>();

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAutocomplete<T = Record<string, any>>({
  cacheKey,
  mode,
  data,
  params,
  fnGetData,
  pageSize = 7,
}: UseAutocompleteOptions<T>): UseAutocompleteReturn<T> {

  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  // Track page hiện tại (remote mode)
  const currentPage = useRef(0);
  // Tránh set state sau khi unmount
  const isMounted = useRef(true);
  // Tránh gọi API song song
  const isFetching = useRef(false);

  const scheduleOptionsUpdate = useCallback((next: T[]) => {
    window.setTimeout(() => {
      if (!isMounted.current) return;
      setOptions(next);
    }, 0);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (mode !== "local") return;
    if (!data) {
      scheduleOptionsUpdate([]);
      return;
    }

    const keyword = params?.keyword as string | undefined;
    if (!keyword) {
      scheduleOptionsUpdate(data);
      return;
    }

    const lower = keyword.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item as any).some((v) =>
        String(v ?? "").toLowerCase().includes(lower)
      )
    );
    scheduleOptionsUpdate(filtered);
  }, [mode, data, params?.keyword, scheduleOptionsUpdate]);

 const serialisedParams = JSON.stringify(params ?? {});

  const fetchPage = useCallback(
    (page: number, mergeWithPrevious: boolean) => {
      if (mode !== "remote" || !fnGetData) return;
      if (isFetching.current) return;

      isFetching.current = true;
      if (isMounted.current) setLoading(true);

      const callParams = { ...(params ?? {}), page, pageSize };

      fnGetData(callParams, (result: T[]) => {
        isFetching.current = false;
        if (!isMounted.current) return;

        setLoading(false);

        const entry = cache.get(cacheKey);
        const existingPages: T[][] = mergeWithPrevious && entry ? entry.pages : [];

        // Insert / replace the page slot
        const updatedPages = [...existingPages];
        updatedPages[page] = result;

        const hasMore = result.length >= pageSize;

        cache.set(cacheKey, {
          pages: updatedPages,
          hasMore,
          params: serialisedParams,
        });

        // Flatten tất cả các trang thành 1 mảng options
        setOptions(updatedPages.flat());
        currentPage.current = page;
      });
    },
    [mode, fnGetData, cacheKey, pageSize, serialisedParams, params]
  );

  useEffect(() => {
    if (mode !== "remote" || !fnGetData) return;

    const cached = cache.get(cacheKey);
    const paramsChanged = cached?.params !== serialisedParams;

    if (cached && !paramsChanged) {
      // Cache hit — dùng lại, không gọi API
      scheduleOptionsUpdate(cached.pages.flat());
      currentPage.current = cached.pages.length - 1;
      return;
    }

    // Params thay đổi hoặc chưa có cache → xoá cache cũ, fetch trang 0
    cache.delete(cacheKey);
    currentPage.current = 0;
    fetchPage(0, false);

  }, [mode, fnGetData, cacheKey, serialisedParams, fetchPage, scheduleOptionsUpdate]);
  const loadNextPage = useCallback(() => {
    if (mode !== "remote") return;

    const cached = cache.get(cacheKey);
    if (!cached?.hasMore) return;       // không còn trang tiếp
    if (isFetching.current) return;      // đang fetch rồi

    fetchPage(currentPage.current + 1, true);
  }, [mode, cacheKey, fetchPage]);

  const loadFirstPage = useCallback(() => {
    if (mode !== "remote") return;
    cache.delete(cacheKey);
    currentPage.current = 0;
    fetchPage(0, false);
  }, [mode, cacheKey, fetchPage]);

  return { options, loading, loadNextPage, loadFirstPage };
}