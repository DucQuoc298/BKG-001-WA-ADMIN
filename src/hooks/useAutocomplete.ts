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

// Bộ nhớ đệm (Cache) ở cấp độ module (Module-level).
// Vì nằm ngoài hook, cache này tồn tại độc lập với vòng đời của các component.
// Tất cả các component Autocomplete sử dụng chung một `cacheKey` sẽ dùng chung vùng nhớ cache này.
// CẢNH BÁO: Cache này không tự dọn dẹp (no TTL/LRU), sẽ tích tụ trong RAM cho đến khi reload trang.
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

  // useRef dùng để lưu chỉ số trang hiện tại mà không kích hoạt re-render component khi thay đổi
  const currentPage = useRef(0);
  
  // Cờ hiệu để theo dõi vòng đời component. Khi component bị unmount, isMounted.current = false
  // giúp ngăn chặn việc gọi setOptions/setLoading sau khi component đã chết, tránh lỗi rò rỉ bộ nhớ (Memory Leak).
  const isMounted = useRef(true);
  
  // ID định danh của request bất đồng bộ cuối cùng. 
  // Dùng để chống lỗi Race Condition (cạnh tranh luồng) khi người dùng nhập từ khóa tìm kiếm rất nhanh.
  const requestIdRef = useRef(0);

  // Đẩy việc cập nhật options vào macro-task queue để tránh lỗi cập nhật state khi đang render (Concurrent rendering warning).
  // Đồng thời kiểm tra component còn mount hay không trước khi thực thi setOptions.
  const scheduleOptionsUpdate = useCallback((next: T[]) => {
    window.setTimeout(() => {
      if (!isMounted.current) return;
      setOptions(next);
    }, 0);
  }, []);

  // Thiết lập trạng thái mount/unmount của component
  useEffect(() => {
    isMounted.current = true;
    return () => { 
      isMounted.current = false; // Cleanup: Component unmount -> gán cờ thành false
    };
  }, []);

  // LOCAL MODE: Xử lý tìm kiếm và lọc dữ liệu cục bộ phía client
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
    // Lọc không phân biệt chữ hoa/thường trên mọi trường giá trị của đối tượng (multi-field search)
    const filtered = data.filter((item) =>
      Object.values(item as any).some((v) =>
        String(v ?? "").toLowerCase().includes(lower)
      )
    );
    scheduleOptionsUpdate(filtered);
  }, [mode, data, params?.keyword, scheduleOptionsUpdate]);

 const serialisedParams = JSON.stringify(params ?? {});

  // Hàm tải dữ liệu của một trang cụ thể (dành cho REMOTE MODE)
  const fetchPage = useCallback(
    (page: number, mergeWithPrevious: boolean) => {
      if (mode !== "remote" || !fnGetData) return;
      if (isMounted.current) setLoading(true);
      
      // Tạo requestId mới cho đợt gọi API này
      const requestId = ++requestIdRef.current;

      const callParams = { ...(params ?? {}), page, pageSize };

      // Gọi hàm lấy dữ liệu bất đồng bộ
      fnGetData(callParams, (result: T[]) => {
        // KIỂM TRA AN TOÀN: 
        // 1. Component còn mount không? Nếu không, bỏ qua.
        // 2. RequestId có phải là mới nhất không? Nếu có request khác đè lên, bỏ qua (chống Race Condition).
        if (!isMounted.current) return;
        if (requestId !== requestIdRef.current) return;

        setLoading(false);

        const entry = cache.get(cacheKey);
        // Nếu merge với trang cũ (cuộn tải thêm), lấy mảng trang cũ từ cache, ngược lại khởi tạo mảng rỗng
        const existingPages: T[][] = mergeWithPrevious && entry ? entry.pages : [];

        // Ghi nhận dữ liệu của trang hiện tại vào mảng 2 chiều
        const updatedPages = [...existingPages];
        updatedPages[page] = result;

        // Nếu số lượng kết quả trả về bằng hoặc vượt quá pageSize, giả định là vẫn còn dữ liệu ở trang tiếp theo
        const hasMore = result.length >= pageSize;

        // Ghi đè hoặc lưu mới dữ liệu vào cache ở module-level
        cache.set(cacheKey, {
          pages: updatedPages,
          hasMore,
          params: serialisedParams,
        });

        // Trải phẳng (flat) mảng 2 chiều các trang thành mảng 1 chiều để cập nhật danh sách hiển thị
        setOptions(updatedPages.flat());
        currentPage.current = page;
      });
    },
    [mode, fnGetData, cacheKey, pageSize, serialisedParams, params]
  );

  // REMOTE MODE: Đồng bộ cache hoặc gọi API tải trang đầu tiên khi params thay đổi
  useEffect(() => {
    if (mode !== "remote" || !fnGetData) return;

    const cached = cache.get(cacheKey);
    // So sánh chuỗi JSON của params hiện tại với params đã lưu trong cache của key đó
    const paramsChanged = cached?.params !== serialisedParams;

    if (cached && !paramsChanged) {
      // CACHE HIT: Bộ lọc và key trùng khớp -> Khôi phục dữ liệu từ cache mà không gọi API mạng
      scheduleOptionsUpdate(cached.pages.flat());
      // Thiết lập con trỏ trang hiện tại về trang cuối cùng đã lưu trong cache
      currentPage.current = cached.pages.length - 1;
      return;
    }

    // CACHE MISS: Dữ liệu chưa từng được tải hoặc tham số lọc/từ khóa đã thay đổi
    // Xóa cache cũ của key này, đặt lại con trỏ trang và gọi API trang đầu tiên (page: 0)
    cache.delete(cacheKey);
    currentPage.current = 0;
    fetchPage(0, false);

  }, [mode, fnGetData, cacheKey, serialisedParams, fetchPage, scheduleOptionsUpdate]);
  const loadNextPage = useCallback(() => {
    if (mode !== "remote") return;

    const cached = cache.get(cacheKey);
    if (!cached?.hasMore) return;       // không còn trang tiếp
    if (loading) return;                 // đang fetch rồi

    fetchPage(currentPage.current + 1, true);
  }, [mode, cacheKey, fetchPage, loading]);

  const loadFirstPage = useCallback(() => {
    if (mode !== "remote") return;
    cache.delete(cacheKey);
    currentPage.current = 0;
    fetchPage(0, false);
  }, [mode, cacheKey, fetchPage]);

  return { options, loading, loadNextPage, loadFirstPage };
}