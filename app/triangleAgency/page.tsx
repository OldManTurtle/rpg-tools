"use client";
import { Button, Container, Paper, Typography } from "@mui/material";

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
  anomalyBlue: "#0047bb",
};

export const triangleTheme = createTheme({
  palette: {
    primary: {
      main: taColors.agencyRed,
    },
    mode: "light",
    secondary: {
      main: taColors.realityYellow,
    },
    text: {
      primary: taColors.agencyInk,
    },
    info: {
      main: taColors.anomalyBlue,
    },
    background: {
      paper: taColors.agencyGray,
    },
  },
  typography: {
    fontFamily: "Poppins",
    h1: {
      fontFamily: "Poppins",
      fontWeight: "bold",
      color: taColors.agencyRed,
    },
    h2: {
      fontFamily: "Poppins",
    },
  },
  shape: {
    borderRadius: 19,
  },

  shadows: [
    "none",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
});

type die = 1 | 2 | 3 | 4;
type dice = [die, die, die, die, die, die];
const rawRollDie = () => (Math.floor(Math.random() * 4) + 1) as die;
const rawRollDice = () =>
  [
    rawRollDie(),
    rawRollDie(),
    rawRollDie(),
    rawRollDie(),
    rawRollDie(),
    rawRollDie(),
  ] as dice;

const DiceRoller = () => {
  const [dice, setDice] = React.useState(rawRollDice());
  return (
    <Paper>
      <Button onClick={() => setDice(rawRollDice)}>Roll!</Button>
      {dice}
    </Paper>
  );
};
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
            <Typography variant="h1">Triangle Agency</Typography>
            <Button variant="contained" color="primary">
              PRIMARY
            </Button>
            <DiceRoller />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
