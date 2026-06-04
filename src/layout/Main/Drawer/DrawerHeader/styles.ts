
import { useTheme } from "@mui/material/styles";
export default () => {
  const theme = useTheme();
  return {
    avatar: {
      width: 40,
      height: 40,
      color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.contrastText,
    },
    avatarImage: {
      width: '100%',
    },
    companyName: {
      fontSize: '16px',
      fontWeight: 600,
      color: theme.palette.text.primary,
    }
  };
};
