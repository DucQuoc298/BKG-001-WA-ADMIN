import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import Icons, { IconName } from "assets/Icon";
import { Button } from "components/Buttons";
import { IAction, IActionAndSub } from "types";
import styles from "./styles";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { memo, useCallback, useEffect, useOptimistic, useState } from "react";

interface ButtonMenuProps {
  icon?: React.JSX.Element | null
  type?: "submit" | "reset" | "button" | undefined;
  label?: string;
  actionKey?: IAction;
  items: { key: IAction | "splitRegion"; sub?: string; label?: string, icon?: IconName; }[];
  isEditting?: boolean;
  handleActionClick?: (key: IAction | IActionAndSub) => void;
}
const ButtonMenu = ({
  icon,
  type,
  label,
  actionKey,
  items,
  handleActionClick,
}: ButtonMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [key, setKey] = useOptimistic(0);

  useEffect(() => {
    setKey(key + 1);
  }, [items])

  const handleClick = useCallback(() => {
    handleActionClick?.(actionKey as IAction | IActionAndSub);
  }, [actionKey, handleActionClick]);

  const handleClose = (key, sub?) => {
    setAnchorEl(null);
    // Small delay to allow menu to close smoothly
    setTimeout(() => {
      if (sub) handleActionClick?.({ key, sub });
      else handleActionClick?.(key);
    }, 50);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {actionKey !== IAction.MORE && (<Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={icon}
        text={label}
        type={type ?? "button"}
        sx={{...styles.buttonMenu.button}}
        
      /> )}
       <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
          sx={{ 
            ...styles.buttonMenu.iconButton,
            ...(actionKey === IAction.MORE  ? {} : { borderLeft: '1px solid rgba(255, 255, 255, 0.5)', borderEndStartRadius: 0, borderStartStartRadius: 0})
          }}
        >
          { actionKey !== IAction.MORE  ? <KeyboardArrowDownOutlined fontSize="small" /> : icon }
        </IconButton>
      <Menu
        id="basic-menu"
        key={key}
        disableRestoreFocus
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
        }}
        sx={{ mt: 1 }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
        {items.map((item) =>{
          return <MenuItem
            sx={{ mx: 1, gap: 1 }}
            key={items.length}
            onClick={() => {
              handleClose(item.key, item.sub);
            }}>
              {item.icon && Icons({ name: item.icon, size: 14 })} 
              {item.label}
          </MenuItem>
        }
          
        )}
      </Menu>
    </Box>
  )
}

export default memo(ButtonMenu);