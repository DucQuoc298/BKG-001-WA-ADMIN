
import { createSelector } from 'reselect';
import { IPluginFormsState, PluginFormEntry } from './reducer';

// ============================================================
// BASE SELECTOR
// ============================================================

/** Selector gốc – chọn toàn bộ slice state của pluginForms */
const selectPluginFormsSlice = (state: { pluginForms: IPluginFormsState }) =>
  state.pluginForms;

// ============================================================
// DERIVED SELECTORS
// ============================================================

/** Chọn toàn bộ map forms */
const selectPluginFormsMap = createSelector(
  selectPluginFormsSlice,
  (slice) => slice.forms
);

/**
 * Tạo selector chọn form state của 1 plugin theo pluginId.
 * Trả về `null` nếu plugin chưa có dữ liệu.
 *
 * @example
 * const formState = useSelector(selectPluginFormById('demo-form'));
 */
const selectPluginFormById = (pluginId: string) =>
  createSelector(
    selectPluginFormsMap,
    (forms): PluginFormEntry | null => forms[pluginId] ?? null
  );

// ============================================================
// EXPORTS
// ============================================================

export {
  selectPluginFormsSlice,
  selectPluginFormsMap,
  selectPluginFormById,
};
