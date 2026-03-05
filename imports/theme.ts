import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: { mode: "light" },
  typography: {
    fontFamily: [
      //Imported in globals.css
      "'Alegreya SC'",
      "sans-serif",
    ].join(","),
  },
});
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000", paper: "#000" },
  },
  typography: {
    fontFamily: [
      //Imported in globals.css
      "'Alegreya SC'",
      "sans-serif",
    ].join(","),
  },
});
