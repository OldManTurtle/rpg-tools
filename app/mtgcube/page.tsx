/* eslint-disable react/no-unknown-property */
import { lightTheme } from "@/imports/theme";
import { ThemeProvider } from "@emotion/react";
import * as Icons from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Toolbar,
  Container,
  Select,
  MenuItem,
  ImageList,
  ImageListItem,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState } from "react";
import * as scryfall from "scryfall-api";


const cardSizes = {}
const CardDisplay = ({ card }: { card: scryfall.Card }) => {
  const uri =
    card.card_faces?.at(0)?.image_uris?.art_crop || card.image_uris?.art_crop;
  return (
    <Stack
      style={{
        border: "black solid 2px",
        height: "100%",
        background: "black",
        color: "white",
      }}
    >
      <Stack direction="row" width="100%" justifyContent={"space-between"}>
        <Typography>{card.name}</Typography>
        <IconButton color="error">
          <Icons.Delete />
        </IconButton>
      </Stack>
      <div
        style={{
          position: "relative",
          height: "50%",
          width: "100%",
        }}
      >
        {uri && (
          <Image
            sizes="(max-width: 400px) 100vw, (max-width: 800px) 50vw, 33vw"
            alt={card.name}
            src={uri}
            key={card.id}
            fill={true}
            style={{ objectFit: "contain", height: "100%", width: "100%" }}
          />
        )}
      </div>
      <Stack direction="row" width="100%" justifyContent={"space-between"}>
        <Typography>${card.prices.usd}</Typography>
      </Stack>
    </Stack>
  );
};

export default function Cube() {
  const [sets, setSets] = useState<scryfall.Set[] | undefined>(undefined);
  const [chosenSet, setChosenSet] = useState<string | undefined>();
  useEffect(() => {
    scryfall.Sets.all()
      .then((result) => setSets(result))
      .catch(() => setSets([]));
  }, []);
  const [cards, setCards] = useState<scryfall.Card[]>([]);
  useEffect(() => {
    if (chosenSet)
      scryfall.Cards.search('set:"' + chosenSet + '"')
        .all()
        .then((response) => setCards(response))
        .catch(() => setCards([]));
  }, [chosenSet]);
  return (
    <ThemeProvider theme={lightTheme}>
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
            <Select
              label="Starting Set"
              value={chosenSet || ""}
              onChange={(event) => setChosenSet(event.target.value + "")}
            >
              <MenuItem value="" disabled>
                Select a Set
              </MenuItem>
              {sets
                ?.toSorted(
                  (a, b) =>
                    (b.released_at?.valueOf() ?? 0) -
                    (a.released_at?.valueOf() ?? 0),
                )
                .filter(
                  (c) =>
                    ![
                      "token",
                      "promo",
                      "memorabilia",
                      "duel_deck",
                      "alchemy",
                      "minigame",
                      "box",
                    ].includes(c.set_type),
                )
                .map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {c.name} ({c.code}) ({c.set_type})
                  </MenuItem>
                ))}
            </Select>
            <ImageList variant="quilted" cols={4} rowHeight={200}>
              {cards.map((card) => (
                <ImageListItem key={card.id}>
                  <CardDisplay card={card} />
                </ImageListItem>
              ))}
            </ImageList>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
