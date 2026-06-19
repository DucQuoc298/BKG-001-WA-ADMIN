import { Box, Typography, List, ListItemButton, ListItemText } from '@mui/material';
import MainCard from 'components/Card/MainCard';
import React from 'react';
import { ISectionTab } from 'types';

interface ISideIndex {
  activeId: string;
  onSelect: (id: string) => void;
  items: ISectionTab[];
  title?: string;
}


const SideIndex = ({ activeId, onSelect, items, title }: ISideIndex) => {
  return (
    <MainCard border
      title={title}
    >
      <List dense disablePadding>
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <ListItemButton
              key={item.id}
              selected={isActive}
              onClick={() => onSelect(item.id)}
              sx={{
                px: 2,
                py: 1,
                borderLeft: "3px solid",
                borderColor: isActive ? "primary.main" : "transparent",
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  bgcolor: "primary.50",
                  "&:hover": { bgcolor: "primary.100" },
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isActive ? "primary.main" : "action.hover",
                        color: isActive ? "primary.contrastText" : "text.secondary",
                        fontSize: 11,
                        fontWeight: 600,
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={isActive ? "primary.main" : "text.primary"}
                      sx={{ fontWeight: isActive ? 600 : 400 }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </MainCard>
  )
}
export default SideIndex;