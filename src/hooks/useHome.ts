import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HomeFormData, updateHomeForm } from "store/home/reducer";
import { homeFormData } from "store/home/selector";

export const useHome = () => {
  const dispatch = useDispatch();
  const homeForm = useSelector(homeFormData);

    const update = useCallback(
      (data: Partial<HomeFormData>) => {
        dispatch(updateHomeForm(data));
      },
      [dispatch]
    );

    return { homeForm, update };
}