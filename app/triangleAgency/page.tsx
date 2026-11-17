"use client";
import { Button, Container, Paper, Typography } from "@mui/material";

import * as React from "react";
import {
  createTheme,
  SxProps,
  Theme,
  ThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Property } from "csstype";

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

const Triangle = ({
  size,
  color,
  borderWidth,
  borderColor,
}: {
  size: number;
  borderWidth: number;
  color: Property.BorderColor;
  borderColor: Property.BorderColor;
}) => {
  return (
    <Box
      sx={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${(size / 2) * Math.sqrt(3)}px solid ` + color,
      }}
    />
  );
};
const DieDisplay = ({ die }: { die: die }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: 100,
        height: (100 * Math.sqrt(3)) / 2,
      }}
    >
      {die}
      <Box
        sx={{
          position: "absolute",
          minWidth: 100,
          top: 0,
          left: 0,
        }}
      >
        <Triangle size={100} color={taColors.agencyRed} />
      </Box>
    </Box>
  );
};

const DiceRoller = () => {
  const [dice, setDice] = React.useState(rawRollDice());
  return (
    <Paper>
      <Button variant="contained" onClick={() => setDice(rawRollDice)}>
        Roll!
      </Button>
      {dice.map((d) => (
        <DieDisplay key={Math.random()} die={d}></DieDisplay>
      ))}
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
            <DiceRoller />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
