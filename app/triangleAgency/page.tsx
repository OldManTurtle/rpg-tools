"use client";
import { Button, Container, Typography } from "@mui/material";

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

const taColors = {
  agencyRed: "#d10017",
  agencyInk: "#10045a",
  agencyGray: "#eaebf4",
  realityYellow: "#f0ab00",
  anomalyBlue: "00047bb",
};

export const triangleTheme = createTheme({
  palette: { mode: "light" },
  typography: {
    fontFamily: [
      //Imported in globals.css
      "'Alegreya SC'",
      "sans-serif",
    ].join(","),
  },
});

export default function Dashboard() {
  return (
    <ThemeProvider theme={triangleTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.background.default
                : theme.palette.background.paper,
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography>SOME TEXT HERE!</Typography>
            <Button>PRIMAY</Button>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
