import { combineReducers } from "redux";
import snackbar from "./snackbar/reducer";

export const RESET_APP = "RESET_APP";

const appReducer = combineReducers({
  snackbar,
});
const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_APP) {
    // Reset all slices except 'user'
    const { user, } = state || {};
    state = { user };
    return appReducer(state, action);
  }
  return appReducer(state, action);
};

export default rootReducer;