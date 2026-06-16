import { IconName } from "assets/Icon";
import { IAction } from "../commom";

export interface IToolbarButton {
  key: IAction;
  type?: "submit" | "reset" | "button" | undefined;
  label?: string;
  icon?: IconName | string;
  color?: string;
  items?: { key: IAction | "splitRegion"; sub?: string; label?: string, icon?: IconName; }[];
  isEditting?: boolean;
}