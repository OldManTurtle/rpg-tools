import React from "react";
import Link from "next/link";
import { List, ListItem } from "@mui/material";

export default function Home() {
  return (
    <div>
      <List>
        <ListItem>
          <Link href="/">Home</Link>
        </ListItem>
        <ListItem>
          <Link href="/clocks">Clocks</Link>
        </ListItem>
        <ListItem>
          <Link href="/cube">Cube</Link>
        </ListItem>
        <ListItem>
          <Link href="/cards">Cards</Link>
        </ListItem>
      </List>
    </div>
  );
}
