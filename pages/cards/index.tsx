import * as React from "react";
import {
  Container,
  Paper,
  Box,
  Toolbar,
  Grid2,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/imports/theme";
import { useState } from "react";
import { specType } from "./constants";
import { EditorRender } from "./EditorRender";
import { SvgRender } from "./SvgRender";
const drawerWidth = 150;
export default function Dashboard() {
  const [spec, setSpec] = useState<specType>({
    dimensions: [100, 100], //mm
    fields: [],
    cards: [],
  });
  const drawer = (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItemButton>
          <ListItemText primary={"Edit Template"} />
        </ListItemButton>
        <ListItemButton>
          <ListItemText
            primary={"Add Card"}
            onClick={() =>
              setSpec({
                ...spec,
                cards: [
                  ...spec.cards,
                  { title: "New Card", copies: 1, overrides: {} },
                ],
              })
            }
          />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        {spec.cards.map((card) => (
          <ListItem key={card.title} disablePadding>
            <ListItemButton>
              <ListItemText primary={card.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {drawer}
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
      </Box>
    </ThemeProvider>
  );
}
