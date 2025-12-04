"use client";
import { Box, CircularProgress, useTheme } from "@mui/material";

export interface loadingProps {
  // ...
}

const Loading: React.FC<loadingProps> = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress sx={{ color: theme.palette.primary.main }} />
    </Box>
  );
};

export default Loading;
