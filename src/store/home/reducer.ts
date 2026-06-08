
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormKey, IFormMode } from 'types';
export type HomeFormData = {
  note: string;
  formMode: IFormMode;
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
  },
};

const homeSlice = createSlice({
  name: IFormKey.HOME.toLowerCase(),
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