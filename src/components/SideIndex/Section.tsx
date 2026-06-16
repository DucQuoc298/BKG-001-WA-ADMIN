import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from 'react';
interface ISection {
  id: string;
  label: string;
  children: React.ReactNode;
}

function Section({ id, label, children }: ISection) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        mb: 4,
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        scrollMarginTop: "24px", // offset khi scroll đến
      }}
    >
      <Typography variant="h6" sx={{
        fontWeight: 600
      }}>
        {label}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}

export default Section; 