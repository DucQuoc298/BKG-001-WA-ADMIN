import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";

export type AutocompleteMode = "local" | "remote";

export type FnGetData<T> = (
  params: Record<string, any>,
  callback: (result: T[]) => void
) => void;

export interface UseAutocompleteOptions<T> {
  cacheKey: string;
  mode: AutocompleteMode;
  data?: T[];
  params?: Record<string, any>;
  fnGetData?: FnGetData<T>;
  pageSize?: number;
}

export function useAutocomplete<T = Record<string, any>>({
  cacheKey,
  mode,
  data: staticData,
  params,
  fnGetData,
  pageSize = 7,
}: UseAutocompleteOptions<T>) {

  const isRemote = mode === "remote" && !!fnGetData;

  // 1. Chuyển đổi callback-based fnGetData thành Promise-based fetcher cho SWR
  const fetcher = async ([, queryParams, page]: [string, Record<string, any>, number]) => {
    return new Promise<T[]>((resolve) => {
      fnGetData!({ ...queryParams, page, pageSize }, (result) => {
        resolve(result || []);
      });
    });
  };

  // 2. Định nghĩa Key Generator cho từng trang (SWR Infinite yêu cầu hàm này)
  const getKey = (pageIndex: number, previousPageData: T[] | null) => {
    if (!isRemote) return null;

    // Nếu trang trước đó trống hoặc số lượng item ít hơn pageSize -> đã hết dữ liệu, dừng fetch tiếp
    if (previousPageData && previousPageData.length < pageSize) return null;

    // Key của SWR là một mảng giúp phân biệt Cache key, bộ lọc params và chỉ số trang
    return [cacheKey, params ?? {}, pageIndex];
  };

  // 3. Sử dụng useSWRInfinite
  const {
    data: remotePages,
    // size,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<T[]>(getKey, fetcher, {
    revalidateFirstPage: false, // Không revalidate trang đầu tiên khi mount
    revalidateOnFocus: false,    // Không tải lại khi user focus vào tab trình duyệt
    revalidateIfStale: false,    // Không tải lại nếu dữ liệu đã lưu trong cache
    revalidateOnReconnect: false,// Không tải lại khi khôi phục mạng internet
    persistSize: true,           // Giữ số lượng trang đã tải
  });

  // 4. Xử lý dữ liệu hiển thị (Local vs Remote)
  const options = useMemo(() => {
    if (mode === "local") {
      if (!staticData) return [];
      const keyword = params?.keyword as string | undefined;
      if (!keyword) return staticData;

      const lower = keyword.toLowerCase();
      return staticData.filter((item) =>
        Object.values(item as any).some((v) =>
          String(v ?? "").toLowerCase().includes(lower)
        )
      );
    }

    // Remote mode: remotePages có cấu trúc là mảng 2 chiều [ [trang 0], [trang 1], ... ]
    // Ta sử dụng flat() để trải phẳng thành mảng 1 chiều hiển thị trên dropdown
    return remotePages ? remotePages.flat() : [];
  }, [mode, staticData, params?.keyword, remotePages]);

  // 5. Kiểm tra xem có thể tải thêm trang tiếp theo không
  const hasMore = useMemo(() => {
    if (!isRemote || !remotePages) return false;
    const lastPage = remotePages[remotePages.length - 1];
    return lastPage && lastPage.length >= pageSize;
  }, [isRemote, remotePages, pageSize]);

  // 6. Định nghĩa các hàm điều khiển
  const loadNextPage = () => {
    if (!isRemote || isValidating || !hasMore) return;
    setSize((prevSize) => prevSize + 1); // Tăng size lên 1 để SWR tải thêm trang tiếp theo
  };

  const loadFirstPage = () => {
    if (!isRemote) return;
    mutate(); // Kích hoạt làm mới cache và tải lại trang 0
  };

  return {
    options,
    loading: isLoading || isValidating,
    loadNextPage,
    loadFirstPage,
  };
}
