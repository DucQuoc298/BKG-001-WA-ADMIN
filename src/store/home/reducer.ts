
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFormKey } from 'types';
export type HomeFormData = {
  note: string;
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