import { useState, useEffect, useCallback, useMemo } from 'react';

export type EmailFormFields = {
  recipient: string;
  subject: string;
  content: string;
  cc: string;
  bcc: string;
  showCc: boolean;
  showBcc: boolean;
  attachments: File[];
};

export type EmailComposerState = {
  id: string;
  data: EmailFormFields;
  dirtyFields: Record<string, any>;
  isMinimized: boolean;
};

export const initialEmailFormFields: EmailFormFields = {
  recipient: '',
  subject: '',
  content: '<h2>Kính gửi đối tác,</h2><p>Chúng tôi viết thư này để thông báo về việc cập nhật hệ thống của chúng tôi.</p><p>Trân trọng,<br/>Đội ngũ phát triển</p>',
  cc: '',
  bcc: '',
  showCc: false,
  showBcc: false,
  attachments: [],
};

// Module-level global cache and state
const globalEmailCache = new Map<string, EmailComposerState>();
let activeComposerId: string | null = null;
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error(e);
    }
  });
};

/**
 * Hook quản lý danh sách nhiều cửa sổ soạn thảo email (Email composer instances)
 * Sử dụng bộ nhớ đệm global cache Map độc lập thay vì Redux.
 */
export const useEmail = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Chuyển cache Map thành object Record để tương thích với code cũ
  const composers = useMemo(() => {
    const res: Record<string, EmailComposerState> = {};
    globalEmailCache.forEach((value, key) => {
      res[key] = value;
    });
    return res;
  }, [tick]);

  const activeComposer = useMemo(() => {
    if (!activeComposerId) return null;
    return globalEmailCache.get(activeComposerId) ?? null;
  }, [tick]);

  const getComposer = useCallback((id: string) => {
    return globalEmailCache.get(id) ?? null;
  }, []);

  const addComposer = useCallback((id: string, initialData?: Partial<EmailFormFields>) => {
    if (!globalEmailCache.has(id)) {
      globalEmailCache.set(id, {
        id,
        data: {
          ...initialEmailFormFields,
          ...initialData,
        },
        dirtyFields: {},
        isMinimized: false,
      });
    }
    // Chỉ set active cho các composer nổi (floating), bỏ qua home-mailbox của trang chủ
    if (id !== 'home-mailbox') {
      activeComposerId = id;
    }
    notifyListeners();
  }, []);

  const updateComposer = useCallback((id: string, updates: Partial<EmailComposerState>) => {
    const composer = globalEmailCache.get(id);
    if (composer) {
      globalEmailCache.set(id, {
        ...composer,
        ...updates,
        data: {
          ...composer.data,
          ...(updates.data ?? {}),
        },
        dirtyFields: {
          ...composer.dirtyFields,
          ...(updates.dirtyFields ?? {}),
        },
      });
      notifyListeners();
    }
  }, []);

  const removeComposer = useCallback((id: string) => {
    globalEmailCache.delete(id);
    if (activeComposerId === id) {
      // Tìm composer nổi khác để focus, không chọn home-mailbox
      const remainingIds = Array.from(globalEmailCache.keys()).filter((key) => key !== 'home-mailbox');
      activeComposerId = remainingIds.length > 0 ? remainingIds[remainingIds.length - 1] : null;
    }
    notifyListeners();
  }, []);

  const setActiveComposer = useCallback((id: string | null) => {
    if (id === 'home-mailbox') return; // Bỏ qua home-mailbox
    activeComposerId = id;
    notifyListeners();
  }, []);

  const resetEmailForm = useCallback(() => {
    globalEmailCache.clear();
    activeComposerId = null;
    notifyListeners();
  }, []);

  return {
    composers,
    activeComposerId,
    activeComposer,
    addComposer,
    updateComposer,
    removeComposer,
    setActiveComposer,
    getComposer,
    resetEmailForm,
  };
};
