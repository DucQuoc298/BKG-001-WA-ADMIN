import { useTheme } from '@mui/material';
import React from 'react';
import { 
  LuPlus, 
  LuPencil,
  LuTrash,
  LuEye,
  LuUndo2,
} from "react-icons/lu";
import { MdMoreVert } from "react-icons/md";

interface IconProps {
  name: IconName;
  size: number;
  color?: string;
}
export enum IconName {
  NEW = "new",
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
  CANCEL = "cancel",
  DEFAULT = "default",
  MORE = "more"
}
const Icons = ({ name, size, color }: IconProps) => {
  const {palette} = useTheme();
  switch (name) {
    case IconName.NEW: return <LuPlus size={size} color={color}/>;
    case IconName.EDIT: return <LuPencil size={size} color={color}/>;
    case IconName.DELETE: return <LuTrash size={size} color={color}/>;
    case IconName.VIEW: return <LuEye size={size} color={color}/>;
    case IconName.CANCEL: return <LuUndo2 size={size} color={color}/>;
    case IconName.MORE: return <MdMoreVert size={size} color={color}/>;
    default: return null;
  }
}

export default Icons;