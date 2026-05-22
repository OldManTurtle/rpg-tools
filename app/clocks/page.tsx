"use client";
import {
  Container,
  Pagination,
  Grid,
  Stack,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import { Clock, clockType } from "../../imports/clock";

import * as React from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { darkTheme, lightTheme } from "@/imports/theme";
import { useLocalStorage, useCopyToClipboard } from "usehooks-ts";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import { useEffect } from "react";
import { array_move, makeId } from "@/imports/helpers";

const Clocks = ({
  dark,
  setDark,
}: {
  dark: boolean;
  setDark: (argument: boolean) => void;
}) => {
  const [numbers, setNumbers] = React.useState(true);
  const [lines, setLines] = React.useState(false);
  const [fillLines, setFillLines] = React.useState(true);
  const [clocks, setClocks] = useLocalStorage<clockType[]>("clockData", [], {
    initializeWithValue: false,
  });
  // const [clocks, setClocks] = useState<clockType[]>([])
  const theme = useTheme();
  useEffect(() => {
    document.title = "Blades Clocks";
  }, []);

  const insertClock = (index: number, page: number) =>
    setClocks([
      ...clocks.slice(0, index),
      {
        filled: 0,
        size: 4,
        title: "",
        uuid: makeId(12),
        color: theme.palette.grey[600],
        page,
      },
      ...clocks.slice(index),
    ]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [, copyToClipboard] = useCopyToClipboard();
  return (
    <Box>
      <Stack sx={{ position: "absolute", left: 0, top: 0 }}>
        <Pagination
          count={Math.max(...clocks.map((c) => c.page || 1)) + 1}
          page={currentPage}
          shape="rounded"
          onChange={(_, newPage) => setCurrentPage(newPage)}
        />
        <FormControlLabel
          control={<Switch checked={dark} onChange={() => setDark(!dark)} />}
          label="Dark Mode"
        />
        <FormControlLabel
          control={
            <Switch checked={numbers} onChange={() => setNumbers(!numbers)} />
          }
          label="Numbers"
        />
        <FormControlLabel
          control={<Switch checked={lines} onChange={() => setLines(!lines)} />}
          label="Lines"
        />
        <FormControlLabel
          control={
            <Switch
              checked={fillLines}
              onChange={() => setFillLines(!fillLines)}
            />
          }
          label="Fill Lines"
        />
        <Button
          onClick={() => {
            copyToClipboard(JSON.stringify(clocks));
          }}
          variant="contained"
          sx={{ maxWidth: 100 }}
        >
          Copy Data to Clipboard
        </Button>
      </Stack>
      <Grid container spacing={3}>
        <Container>
          <Grid container>
            {clocks
              .map((c, index) => ({ ...c, index }))
              .filter((c) => (c.page || 1) === currentPage)
              .map((clock) => (
                <Clock
                  numbers={numbers}
                  lines={lines}
                  dark={dark}
                  key={clock.uuid}
                  clock={clock}
                  setClock={(newClock) => {
                    clocks[clock.index] = newClock;
                    setClocks([...clocks]);
                  }}
                  deleteClock={() =>
                    setClocks((c) =>
                      c.filter((otherClock) => otherClock.uuid !== clock.uuid),
                    )
                  }
                  moveLeft={() => {
                    const bunchedClocks = [
                      ...clocks.filter(
                        (c) => (c.page || 0) === (clock.page || 0),
                      ),
                      ...clocks.filter(
                        (c) => (c.page || 0) !== (clock.page || 0),
                      ),
                    ];
                    const index = bunchedClocks.findIndex(
                      (c) => c.uuid === clock.uuid,
                    );
                    return index && setClocks(array_move(bunchedClocks, index));
                  }}
                  insertBefore={() => insertClock(clock.index, currentPage)}
                  fillLines={fillLines}
                />
              ))}
            <Grid
              display="flex"
              justifyContent={"center"}
              alignItems={"flex-end"}
            >
              <IconButton
                size={"large"}
                onClick={() =>
                  setClocks([
                    ...clocks,
                    {
                      filled: 0,
                      size: 4,
                      title: "",
                      uuid: makeId(12),
                      page: currentPage,
                      color: theme.palette.grey[600],
                    },
                  ])
                }
              >
                <MoreTimeIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Box>
  );
};

export default function Dashboard() {
  const [dark, setDark] = React.useState(true);
  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
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
            <Clocks dark={dark} setDark={setDark} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
