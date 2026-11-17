"use client";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";

import * as React from "react";
import {
  createTheme,
  SxProps,
  Theme,
  ThemeProvider,
} from "@mui/material/styles";
import Image from "next/image";
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
  borderColor?: Property.BorderColor;
}) => {
  const borderSize = size - 2 * borderWidth;
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: (size * Math.sqrt(3)) / 2,
        width: size,
      }}
    >
      <Box
        sx={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom:
            `${(size / 2) * Math.sqrt(3)}px solid ` + (borderColor ?? color),
        }}
      ></Box>
      {borderWidth && borderColor ? (
        <Box
          sx={{
            position: "absolute",
            bottom: borderWidth / 2,
            width: 0,
            height: 0,
            borderLeft: `${borderSize / 2}px solid transparent`,
            borderRight: `${borderSize / 2}px solid transparent`,
            borderBottom: `${(borderSize / 2) * Math.sqrt(3)}px solid ` + color,
          }}
        ></Box>
      ) : undefined}
    </Box>
  );
};
const DieDisplay = ({ die }: { die: die }) => {
  return (
    <Grid
      sx={{
        position: "relative",
        width: 100,
        height: (100 * Math.sqrt(3)) / 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          minWidth: 100,
          top: 0,
          left: 0,
        }}
      >
        <Triangle
          size={100}
          color={die === 3 ? taColors.agencyRed : taColors.agencyGray}
          borderWidth={5}
          borderColor={die === 3 ? undefined : taColors.agencyRed}
        />
      </Box>
      <Typography sx={{ zIndex: 2 }} variant="h4">
        {die}
      </Typography>
    </Grid>
  );
};

const DiceRoller = () => {
  const [dice, setDice] = React.useState(rawRollDice());
  const [rolling, setRolling] = React.useState(false);
  const [modified, setModified] = React.useState(false);
  const successes = dice.filter((f) => f === 3).length;
  return (
    <Paper>
      <Button
        disabled={rolling}
        variant="contained"
        onClick={() => {
          setModified(false);
          setDice(rawRollDice);
          setRolling(true);
          const intervals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
            (v) => Math.exp(v / 3) * 60,
          );
          for (const index of intervals) {
            setTimeout(() => setDice(rawRollDice()), index);
          }
          setTimeout(() => setRolling(false), intervals.at(-1));
        }}
      >
        Roll!
      </Button>
      <Grid container>
        {dice.map((d) => (
          <DieDisplay key={Math.random()} die={d}></DieDisplay>
        ))}
      </Grid>
      {successes}
      <Box sx={{ width: 500 }}>
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={"RULESREF"}
            src={"/TARulesReference.jpg"}
            style={{ objectFit: "contain", width: "100%" }}
          />
        }
      </Box>
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
