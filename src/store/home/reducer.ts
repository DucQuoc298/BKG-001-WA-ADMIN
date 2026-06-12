
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormMode } from 'types';
export type HomeFormData = {
  note: string;
  formMode: IFormMode;
  product?: string | null;
  products?: string[] | null;
  date?: Date | null;
  dateRange?: [Date | null, Date | null] | null;
  number?: number;
}
export interface IHomeState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  formData: HomeFormData;
}
const initialState: IHomeState = {
  loading: false,
  saving: false,
  error: null,
  message: null,
  formData: {
    formMode: IFormMode.VIEW,
    note: '',
    product: null,
    products: null,
    date: null,
    dateRange: null,
    number: 0,
  },
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