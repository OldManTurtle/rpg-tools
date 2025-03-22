import { Container, Paper } from "@mui/material";
import { Clock, clockType } from "../../imports/clock";

import * as React from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { theme } from "@/imports/theme";
import { useLocalStorage } from "usehooks-ts";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import { useEffect } from "react";

const makeId = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const array_move = (array: unknown[], old_index: number, new_index: number) => {
  if (new_index >= array.length) {
    let k = new_index - array.length + 1;
    while (k--) {
      array.push(undefined);
    }
  }
  array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  return array; // for testing
};

const Clocks = () => {
  const [clocks, setClocks] = useLocalStorage<clockType[]>("clockData", [], {
    initializeWithValue: false,
  });
  // const [clocks, setClocks] = useState<clockType[]>([])
  const theme = useTheme();
  useEffect(() => {
    document.title = "Blades Clocks";
  }, []);

  return (
    <Container>
      <Grid container>
        {clocks.map((clock, index) => (
          <Clock
            key={clock.uuid}
            clock={clock}
            setClock={(newClock) => {
              clocks[index] = newClock;
              setClocks([...clocks]);
            }}
            deleteClock={() =>
              setClocks((c) => c.filter((index_) => index_.uuid !== clock.uuid))
            }
            moveLeft={() =>
              setClocks((c) => index && array_move(c, index, index - 1))
            }
          />
        ))}
        <Grid
          item
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
                  uuid: makeid(12),
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
  );
};

export default function Dashboard() {
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper>
              <Grid container spacing={3}>
                <Clocks />
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
