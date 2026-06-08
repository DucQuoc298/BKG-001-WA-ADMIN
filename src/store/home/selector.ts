
import { createSelector } from "reselect";
import { 
  IHomeState,
} from "store/home/reducer";

const selector = (state: { home: IHomeState }) => state.home;

const homeFormData = createSelector( selector, ({formData}) => formData );


export {
  homeFormData
};