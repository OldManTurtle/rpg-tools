/* eslint-disable react/no-unknown-property */
import { theme } from "@/imports/theme";
import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, Toolbar, Container } from "@mui/material";
import * as React from "react";
import scryfall from "scryfall-api";

export default function Cube() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}></Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
