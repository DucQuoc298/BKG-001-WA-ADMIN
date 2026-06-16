import { Stack } from "@mui/material";
import React from "react";

// ==============================|| MAINTENANCE WRAPPER ||============================== //


export default function MaintenanceWrapper({ children }: { children: React.ReactNode }) {

  return (
    <Stack
      direction={"column"}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        gap: 1,
      }}
    >
      {children}
    </Stack>
  )
}