import { createSelector } from "reselect";
import { RootState } from "store/createStore";

const selectEmailSlice = (state: RootState) => state.email;

const selectEmailModule = createSelector(
  selectEmailSlice,
  ({ email }) => email
);

export const selectEmailFormState = createSelector(
  selectEmailModule,
  ({ form }) => form
);

export const selectEmailFormData = createSelector(
  selectEmailFormState,
  ({ data }) => data
);

export const selectEmailFormDirtyFields = createSelector(
  selectEmailFormState,
  ({ dirtyFields }) => dirtyFields
);

export const selectEmailComposerOpen = createSelector(
  selectEmailFormState,
  ({ isComposerOpen }) => isComposerOpen
);

export const selectEmailMinimized = createSelector(
  selectEmailFormState,
  ({ isMinimized }) => isMinimized
);
