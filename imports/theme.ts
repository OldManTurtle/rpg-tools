import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: { mode: "light" },
  typography: {
    fontFamily: [
      //Imported in globals.css
      "'Alegreya SC'",
      "sans-serif",
    ].join(","),
  },
});
