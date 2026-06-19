
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * Dữ liệu form của 1 plugin, lưu dưới dạng generic Record.
 * Mỗi plugin tự quyết định shape data của mình — host không cần biết.
 */
export interface PluginFormEntry {
  data: Record<string, any>;
  dirtyFields: Record<string, any>;
}

/**
 * State tổng hợp cho tất cả plugin forms.
 * Key là pluginId (ví dụ: 'demo-form', 'customer-form').
 * Entry được tạo tự động khi plugin ghi dữ liệu lần đầu.
 */
export interface IPluginFormsState {
  forms: Record<string, PluginFormEntry>;
}

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: IPluginFormsState = {
  forms: {},
};

// ============================================================
// SLICE
// ============================================================

const pluginFormsSlice = createSlice({
  name: 'pluginForms',
  initialState,
  reducers: {
    /**
     * Cập nhật (merge) dữ liệu form của 1 plugin.
     * Nếu plugin chưa có entry → tự động tạo mới.
     */
    updatePluginForm(
      state,
      action: PayloadAction<{ pluginId: string; data: Partial<PluginFormEntry> }>
    ) {
      const { pluginId, data } = action.payload;
      const existing = state.forms[pluginId] ?? { data: {}, dirtyFields: {} };
      state.forms[pluginId] = {
        ...existing,
        ...data,
      };
    },

    /**
     * Xóa toàn bộ state của 1 plugin (reset form về trạng thái chưa có dữ liệu).
     */
    resetPluginForm(state, action: PayloadAction<string>) {
      delete state.forms[action.payload];
    },

    /**
     * Reset tất cả plugin forms (dùng khi logout hoặc reset app).
     */
    resetAllPluginForms() {
      return initialState;
    },
  },
});

export const { updatePluginForm, resetPluginForm, resetAllPluginForms } =
  pluginFormsSlice.actions;

export default pluginFormsSlice.reducer;
