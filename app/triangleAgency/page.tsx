"use client";
import {
  Button,
  ButtonBase,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import * as React from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { Property } from "csstype";
import Image from "next/image";
import rulesReferenceJpg from "../../public/TARulesReference.jpg";
import askAgencyJpg from "../../public/AskAgencyReference.jpg";
import burnoutSvg from "../../public/burnout.svg";
import successSvg from "../../public/ability - success.svg";
import failureSvg from "../../public/ability - failure.svg";
import chaosSvg from "../../public/chaos.svg";
import triscendenceJpg from "../../public/triscendence.jpg";

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
  const size = 70;
  return (
    <Grid
      sx={{
        position: "relative",
        width: size,
        height: (size * Math.sqrt(3)) / 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          minWidth: size,
          top: 0,
          left: 0,
        }}
      >
        <Triangle
          size={size}
          color={die === 3 ? taColors.agencyRed : taColors.agencyGray}
          borderWidth={5}
          borderColor={die === 3 ? undefined : taColors.agencyRed}
        />
      </Box>
      <Typography
        sx={{
          fontWeight: "bold",
          paddingTop: 2,
          zIndex: 2,
          color: (t) =>
            die === 3 ? t.palette.primary.contrastText : t.palette.primary.main,
        }}
        variant="h5"
      >
        {die}
      </Typography>
    </Grid>
  );
};

const DiceRoller = () => {
  const [dice, setDice] = React.useState<dice>([1, 1, 1, 1, 1, 1]);
  const [rolling, setRolling] = React.useState(false);
  const [modified, setModified] = React.useState(false);
  const successes = dice.filter((f) => f === 3).length;
  const [burnout, setBurnout] = React.useState(0);
  const triscendence = successes === 3 && !modified;
  const t = useTheme();
  const disabledOpacity = t.palette.action.disabledOpacity;
  const success = successes === 3 ? true : successes - burnout > 0;
  const chaos = Math.max(0, successes === 3 ? 0 : 6 - successes + burnout);
  const boZone = (
    <Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          padding: 1,
          width: "100%",
          justifyContent: "center",
        }}
        spacing={1}
      >
        <IconButton
          onClick={() => setBurnout((b) => Math.max(0, b - 1))}
          color="primary"
        >
          <Icons.Remove />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight={"bold"}
          sx={{
            opacity: burnout === 0 ? disabledOpacity : undefined,
            color: (t) => t.palette.primary.main,
            width: 15,
          }}
        >
          {burnout}
        </Typography>

        <Image
          src={burnoutSvg}
          alt={"burnout"}
          style={{
            width: 30,
            height: "auto",
            opacity: burnout === 0 ? disabledOpacity : undefined,
          }}
        />
        <IconButton onClick={() => setBurnout((b) => b + 1)} color="primary">
          <Icons.Add />
        </IconButton>
      </Stack>
    </Stack>
  );
  const rollZone = (
    <Stack
      sx={{
        flex: 1,
      }}
      spacing={1}
    >
      <Button
        sx={{ width: "100%" }}
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
      <Stack
        spacing={1}
        sx={{ width: "100%", justifyContent: "center" }}
        direction="row"
      >
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
      </Stack>
    </Stack>
  );
  const results = (
    <Stack>
      <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
        <Image
          alt={"success"}
          src={success ? successSvg : failureSvg}
          style={{
            width: 40,

            height: "auto",
          }}
        />
        <Typography
          variant={"h5"}
          fontWeight={"bold"}
          sx={{
            color: (t) =>
              success ? t.palette.info.main : t.palette.primary.main,
            width: 15,
          }}
        >
          {success ? "Success" : "Failure"}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography
          variant="h5"
          fontWeight={"bold"}
          sx={{
            opacity: chaos === 0 ? disabledOpacity : undefined,
            color: (t) => t.palette.info.main,
            width: 15,
          }}
        >
          {chaos}
        </Typography>

        <Image
          src={chaosSvg}
          alt={"burnout"}
          style={{
            height: "auto",
            width: 30,
            opacity: chaos === 0 ? disabledOpacity : undefined,
          }}
        />
      </Stack>
      <Stack alignItems={"center"}>
        {triscendence && (
          <Typography
            variant="h3"
            sx={{
              color: (t) => t.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Triscendence!
          </Typography>
        )}
        {triscendence && (
          <Image
            alt={"RULESREF"}
            src={triscendenceJpg}
            style={{
              height: "auto",
              width: "500px",
              mixBlendMode: "darken",
            }}
          />
        )}
      </Stack>
    </Stack>
  );
  return (
    <Paper sx={{ padding: 1, height: "100%", width: "100%" }}>
      <Stack
        spacing={3}
        sx={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row">
          {rollZone}
          {boZone}
        </Stack>
        <Divider />
        {rolling ? undefined : results}
      </Stack>
    </Paper>
  );
};
export default function Dashboard() {
  const [rollPopover, setRollPopover] = React.useState(false);
  const [askPopover, setAskPopover] = React.useState(false);
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
          <Container maxWidth="lg">
            <Grid container>
              <Grid size={{ xs: 12, md: 10 }} sx={{ padding: 1 }}>
                <DiceRoller />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Stack spacing={1} sx={{ padding: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setRollPopover(true)}
                  >
                    Rolling Rules
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setAskPopover(true)}
                  >
                    Ask the Agency
                  </Button>
                </Stack>
              </Grid>
              <Dialog
                open={rollPopover}
                fullWidth
                maxWidth="lg"
                onClose={() => setRollPopover(false)}
              >
                <Image
                  alt={"RULESREF"}
                  src={rulesReferenceJpg}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Dialog>
              <Dialog
                open={askPopover}
                fullWidth
                maxWidth="lg"
                onClose={() => setAskPopover(false)}
              >
                <Image
                  alt={"RULESREF"}
                  src={askAgencyJpg}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </Dialog>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
