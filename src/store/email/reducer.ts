import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EFormMode } from 'types/form';

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

export type EmailFormState = {
  data: EmailFormFields;
  dirtyFields: Record<string, any>;
  formMode: EFormMode;
  isComposerOpen: boolean;
  isMinimized: boolean;
};

export interface IEmailState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  email: {
    form: EmailFormState;
  };
}

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

export const initialEmailFormState: EmailFormState = {
  data: initialEmailFormFields,
  dirtyFields: {},
  formMode: EFormMode.FORM,
  isComposerOpen: true,
  isMinimized: false,
};

const initialState: IEmailState = {
  loading: false,
  saving: false,
  error: null,
  message: null,
  email: {
    form: initialEmailFormState,
  },
};

const emailSlice = createSlice({
  name: 'email', // Bắt buộc trùng khớp với IFormKey.EMAIL.toLowerCase() = 'email'
  initialState,
  reducers: {
    /**
     * Cập nhật một phần dữ liệu của form.
     */
    updateEmailForm: (state, action: PayloadAction<Partial<EmailFormState>>) => {
      state.email.form = {
        ...state.email.form,
        ...action.payload,
        data: {
          ...state.email.form.data,
          ...(action.payload.data ?? {}),
        },
      };
    },
    /**
     * Reset toàn bộ form về trạng thái ban đầu khi tab bị đóng.
     * TÊN BẮT BUỘC: `resetEmailForm` để hook `useFormActions` có thể tự động dispatch.
     */
    resetEmailForm: (state) => {
      state.email.form = initialState.email.form;
    },
  },
});

export const { updateEmailForm, resetEmailForm } = emailSlice.actions;
export default emailSlice.reducer;
