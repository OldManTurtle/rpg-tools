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
          <Link href="/cube">Rubik&apos;s Cube</Link>
        </ListItem>
        <ListItem>
          <Link href="/mtgcube">Mtg Cube</Link>
        </ListItem>
        <ListItem>
          <Link href="/fileshare">File Sharing</Link>
        </ListItem>
      </List>
    </div>
  );
}
