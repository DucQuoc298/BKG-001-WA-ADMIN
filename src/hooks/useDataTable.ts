import { useMemo, useState } from "react";
import useSWR from "swr";
import { DataTableMode } from "types";

const globalSelectionCache = new Map<string, any>();



export type FnGetTableData<T> = (
  params: Record<string, any> & { page: number; pageSize: number },
  callback: (result: T[], total?: number) => void
) => void;

export interface UseDataTableOptions<T> {
  cacheKey: string;
  mode: DataTableMode;
  data?: T[];
  params?: Record<string, any>;
  fnGetData?: FnGetTableData<T>;
  initialPageSize?: number;
  initialPage?: number;
}

export function useDataTable<T = Record<string, any>>({
  cacheKey,
  mode,
  data: staticData,
  params,
  fnGetData,
  initialPageSize = 14,
  initialPage = 0,
}: UseDataTableOptions<T>) {
  const isRemote = mode === "remote" && !!fnGetData;

  // Internal pagination state inside hook
  const [paginationModel, setPaginationModel] = useState({
    page: initialPage,
    pageSize: initialPageSize,
  });

  // Promise-based fetcher wrapping the callback-based fnGetData for SWR
  const fetcher = async ([, queryParams, page, pageSize]: [string, Record<string, any>, number, number]) => {
    return new Promise<{ data: T[]; total?: number }>((resolve) => {
      fnGetData!({ ...queryParams, page, pageSize }, (data, total) => {
        resolve({ data: data || [], total });
      });
    });
  };

  // SWR key dependencies: cacheKey, filters, page, and pageSize
  const key = isRemote ? [cacheKey, params ?? {}, paginationModel.page, paginationModel.pageSize] : null;

  const { data: resData, isLoading, isValidating, mutate } = useSWR(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  // Format rows depending on mode
  const rows = useMemo(() => {
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
    return resData?.data ?? [];
  }, [mode, staticData, params?.keyword, resData]);

  // Calculate total row count
  const rowCount = useMemo(() => {
    if (mode === "local") {
      return rows.length;
    }
    return resData?.total ?? resData?.data?.length ?? 0;
  }, [mode, rows.length, resData]);

  const handlePaginationModelChange = (model: { page: number; pageSize: number }) => {
    setPaginationModel(model);
  };

  const refreshTable = () => {
    if (isRemote) {
      mutate();
    }
  };

  // Robust global caching for selection to avoid SWR deep-equality bailout bugs
  const [rowSelectionModel, setLocalRowSelectionModel] = useState<any>(() => {
    if (cacheKey && globalSelectionCache.has(cacheKey)) {
      return globalSelectionCache.get(cacheKey);
    }
    return { type: 'include', ids: new Set() };
  });

  const setRowSelectionModel = (model: any) => {
    setLocalRowSelectionModel(model);
    if (cacheKey) {
      globalSelectionCache.set(cacheKey, model);
    }
  };

  return {
    rows,
    rowCount,
    loading: isLoading || isValidating,
    paginationModel,
    handlePaginationModelChange,
    refreshTable,
    rowSelectionModel,
    setRowSelectionModel,
  };
}
