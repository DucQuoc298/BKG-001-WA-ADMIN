
import React from 'react';
import {
  LuPlus,
  LuPencil,
  LuTrash,
  LuEye,
  LuUndo2,
  LuX,
  LuFilter,
} from "react-icons/lu";
import { MdMoreVert, MdClear } from "react-icons/md";
import { IoMdCalendar, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

interface IconProps {
  name: IconName | string;
  size: number;
  color?: string;
  onClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}
export enum IconName {
  NEW = "new",
  EDIT = "edit",
  DELETE = "delete",
  VIEW = "view",
  CANCEL = "cancel",
  DEFAULT = "default",
  MORE = "more",
  CLOSE = "close",
  CALENDAR = "calendar",
  CLEAR = "clear",
  FILTER = "filter",
  DROPDOWN = "dropdown",
  DROPUP = "dropup",
}
const Icons = ({ name, size, color, onClick }: IconProps) => {
  switch (name) {
    case IconName.NEW: return <LuPlus size={size} color={color} onClick={onClick} />;
    case IconName.EDIT: return <LuPencil size={size} color={color} onClick={onClick} />;
    case IconName.DELETE: return <LuTrash size={size} color={color} onClick={onClick} />;
    case IconName.VIEW: return <LuEye size={size} color={color} onClick={onClick} />;
    case IconName.CANCEL: return <LuUndo2 size={size} color={color} onClick={onClick} />;
    case IconName.MORE: return <MdMoreVert size={size} color={color} onClick={onClick} />;
    case IconName.CLOSE: return <LuX size={size} color={color} onClick={onClick} />;
    case IconName.CALENDAR: return <IoMdCalendar size={size} color={color} onClick={onClick} />;
    case IconName.CLEAR: return <MdClear size={size} color={color} onClick={onClick} />;
    case IconName.FILTER: return <LuFilter size={size} color={color} onClick={onClick} />;
    case IconName.DROPDOWN: return <IoMdArrowDropdown size={size} color={color} onClick={onClick} />;
    case IconName.DROPUP: return <IoMdArrowDropup size={size} color={color} onClick={onClick} />;
    default: return null;
  }
}

export default Icons;
