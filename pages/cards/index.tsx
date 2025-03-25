import * as React from "react";
import { Container, Paper, Box, Toolbar, Grid2 } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/imports/theme";
import { useState } from "react";
import { specType } from "./constants";
import { EditorRender } from "./EditorRender";
import { SvgRender } from "./SvgRender";

export default function Dashboard() {
  const [spec, setSpec] = useState<specType>({
    dimensions: [100, 100], //mm
    fields: [],
    cards: [],
  });
  return (
    <ThemeProvider theme={theme}>
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
          <Grid2 container spacing={2}>
            <Grid2
              component={Paper}
              flex={1}
              sx={{ overflowY: "auto", maxHeight: "80vh" }}
            >
              <EditorRender spec={spec} setSpec={setSpec} />
            </Grid2>
            <Grid2 component={Paper}>
              <SvgRender spec={spec} />
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
