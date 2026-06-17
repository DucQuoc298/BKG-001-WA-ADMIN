import { combineReducers } from "redux";
import snackbar from "./snackbar/reducer";
import home from "./home/reducer";
import invoice from "./invoice/reducer";
import bill from "./bill/reducer";
import authentication from "./authentication/reducer"
import document from "./document/reducer"

export const RESET_APP = "RESET_APP";

const appReducer = combineReducers({
  snackbar,
  authentication,
  document,

  invoice,
  home,
  bill,
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