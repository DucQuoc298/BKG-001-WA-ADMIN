import { Box, IconButton, Stack } from "@mui/material";
import Icons, { IconName } from "assets/Icon";
import { Button } from "components/Buttons";
import { SearchField } from "components/Inputs";
import { IAction, IActionAndSub, IToolbarButton } from "types";
import { useTranslation } from "react-i18next";
interface IActionBar {
  buttons: IToolbarButton[];
  onButtonClick?: (actionKey: IAction | IActionAndSub) => void;
  searchField?: boolean;
  filterButton?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

const ActionBar = ({
  buttons,
  onButtonClick,
  onSearchChange,
  searchValue,
}: IActionBar) => {

  const { t } = useTranslation();


  return (

    <Stack direction="row" spacing={1} sx={{ my: 1, justifyContent: 'space-between' }}>
      <Box>
        {buttons.map((button, idx) => (
          <Button
            variant="text"
            key={`${button}-${idx}`}
            text={button.label ?? t(`button.${button.key}`)}
            onClick={() => {
              onButtonClick?.(button.key);
            }}
            startIcon={
              button.icon
                ? <Icons name={button.icon} size={12} />
                : undefined
            }
            color={button.key === IAction.DELETE ? 'error' : (button.color ?? 'primary') as any}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchField value={searchValue} onSearchChange={(value) => {
          onSearchChange?.(value ?? "")
        }} />
        <IconButton onClick={() => { console.log("filter") }}>
          <Icons name={IconName.FILTER} size={16} />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default ActionBar;