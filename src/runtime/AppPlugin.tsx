import { AppRuntime } from 'runtime/types';
import { createGenericRuntime } from 'runtime/types/genericRuntime';

/**
 * Tạo runtime cho plugin.
 *
 * Sử dụng generic runtime duy nhất — không cần khai báo runtime riêng
 * cho từng plugin/khách hàng. pluginId được closure vào sdk.store.*
 * để mỗi plugin có scope riêng trong Redux.
 */
export const createAppRuntime = (pluginId?: string): AppRuntime => {
  return createGenericRuntime(pluginId ?? 'unknown');
};
