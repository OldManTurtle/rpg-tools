/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Button,
  ButtonBase,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
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
      <Typography
        sx={{
          zIndex: 2,
          color: (t) =>
            die === 3 ? t.palette.primary.contrastText : t.palette.primary.main,
        }}
        variant="h4"
      >
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
  const [burnout, setBurnout] = React.useState(0);
  const triscendence = successes === 3 && !modified && !rolling;
  const success = successes === 3 ? true : successes - burnout > 0;
  const chaos = Math.max(0, successes === 3 ? 0 : 6 - successes + burnout);
  const bo = <img src={"/burnout.svg"} alt={"burnout"} style={{ width: 30 }} />;
  return (
    <Paper sx={{ padding: 1, height: "100%", width: "100%" }}>
      <Stack spacing={1}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", padding: 1 }}
          spacing={1}
        >
          <Button onClick={() => setBurnout((b) => b + 1)}>+Burnout</Button>
          <Button onClick={() => setBurnout((b) => Math.max(0, b - 1))}>
            -Burnout
          </Button>
          {burnout < 5 && Array.from({ length: burnout }).map(() => bo)}
          {burnout >= 5 && bo}
          {burnout >= 5 && <Typography>x{burnout}</Typography>}
        </Stack>
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
        <Grid container justifyContent={"center"}>
          {dice.map((d, index) => (
            <ButtonBase
              key={Math.random()}
              onClick={() => {
                dice[index] = Math.max(1, (d + 1) % 5) as die;
                setDice([...dice]);
                setModified(true);
              }}
            >
              <DieDisplay die={d}></DieDisplay>
            </ButtonBase>
          ))}
        </Grid>
        <Box>
          {triscendence && (
            <Typography
              variant="h3"
              sx={{ color: (t) => t.palette.primary.main, fontWeight: "bold" }}
            >
              Triscendence!
            </Typography>
          )}
          {triscendence && (
            <img
              alt={"RULESREF"}
              src={"/triscendence.jpg"}
              style={{
                objectFit: "contain",
                width: "500px",
                mixBlendMode: "darken",
              }}
            />
          )}
        </Box>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <img
            alt={"success"}
            src={success ? "/ability - success.svg" : "/ability - failure.svg"}
            style={{ width: 40 }}
          />
          {success ? "Success" : "Failure"}
        </Stack>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <img alt={"success"} src={"/chaos.svg"} style={{ width: 40 }} />x
          {chaos}
        </Stack>
      </Stack>
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
          <Grid container>
            <Grid size={{ xs: 12, lg: 6 }} sx={{ padding: 1 }}>
              <DiceRoller />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <img
                alt={"RULESREF"}
                src={"/TARulesReference.jpg"}
                style={{ objectFit: "contain", width: "100%" }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
