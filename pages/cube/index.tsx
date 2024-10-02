import { theme } from "@/imports/theme";
import { ThemeProvider } from "@emotion/react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import * as React from "react";
import Clocks from "../clocks";

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
