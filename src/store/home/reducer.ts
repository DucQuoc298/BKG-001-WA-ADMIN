
import { PickerValue } from '@mui/x-date-pickers/internals';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EFormMode } from 'types/form';
export type HomeFormData = {
  note: string;
  formMode: EFormMode;
  product?: string | null;
  products?: string[] | null;
  date?: PickerValue | null;

  dirtyFields?: Record<string, any>;
  dateRange?: [Date | null, Date | null] | null;
}
export interface IHomeState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  formData: HomeFormData;
}
export const initialHomeForm: HomeFormData = {
  dirtyFields: {},
  formMode: EFormMode.VIEW,
  note: '',
  product: null,
  products: null,
  date: null,
  dateRange: null,
};

const initialState: IHomeState = {
  loading: false,
  saving: false,
  error: null,
  message: null,
  formData: initialHomeForm,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    updateHomeForm: (state, action: PayloadAction<Partial<HomeFormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    resetHomeForm: (state) => {
      state.formData = initialState.formData;
    },
  }
});

export const { updateHomeForm, resetHomeForm } = homeSlice.actions;
export default homeSlice.reducer;