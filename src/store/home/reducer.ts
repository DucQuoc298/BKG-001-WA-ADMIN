
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EFormMode } from 'types/form';
export type HomeFormData = {
  note: string;
  formMode: EFormMode;
  product?: string | null;
  products?: string[] | null;
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
    formMode: EFormMode.VIEW,
    note: '',
    product: null,
    products: null,
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