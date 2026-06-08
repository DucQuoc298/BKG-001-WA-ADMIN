import { HEADER_HEIGHT } from "themes/config";

export default {
  tabContainer:{
    height: HEADER_HEIGHT, 
    display: 'flex', 
    width: '100%',
    ml: 2
  },
  wrapper:{
    alignItems: 'center',
    whiteSpace: 'nowrap',  
  },
  tabButton: {
    fontSize: '12px',
    position: 'relative',
    display: 'flex',
    border: 'none',
    maxWidth: '150px',
    width: '100%',
    overflow: "hidden !important",
    flex: '1',
    padding: '6px 12px',
    height: '25px',
    borderRadius: '8px', 
    justifyContent: 'space-between',
    alignItems: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:hover .tab-close-icon': {
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'auto',
    },
  },
  activeTabButton: {
    backgroundColor: 'primary.lighter',
    color: 'primary.main',
    overflow: "hidden !important",
  },
  closeIcon: {
    ml: 1,
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    '&:hover': {
      opacity: 1,
    }
  }
}