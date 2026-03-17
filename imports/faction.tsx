import React, { useState } from "react";
import { Divider, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/react/sortable";

export type factionType = {
  status: number;
  uuid: string;
  name: string;
  page: number;
};

const Faction = ({
  faction,
  setFaction,
  index,
}: {
  faction: factionType;
  setFaction: (argument: factionType) => void;
  index: number;
}) => {
  const { ref } = useSortable({
    id: faction.uuid,
    index,
  });
  const [contextMenu, setContextMenu] = useState<
    | {
        mouseX: number;
        mouseY: number;
      }
    | undefined
  >(undefined);
  return (
    <Stack
      direction="row"
      ref={ref}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu(
          contextMenu
            ? undefined
            : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
              // Other native context menus might behave different.
              // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
              {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
              },
        );
      }}
    >
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(undefined)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu === undefined
            ? undefined
            : { top: contextMenu.mouseY, left: contextMenu.mouseX }
        }
      >
        <MenuItem
          onClick={() => {
            setContextMenu(undefined);
            const name = prompt("New Name?");
            setFaction({ ...faction, name: name ?? faction.name });
          }}
        >
          Set Name
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setContextMenu(undefined);
          }}
        >
          Insert Left
        </MenuItem>
        <MenuItem
          onClick={() => {
            const yes = confirm("Are you sure you want to delete this clock?");
            if (!yes) return;
            setContextMenu(undefined);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <Typography>{faction.name}</Typography>
    </Stack>
  );
};

export const FactionList = ({ factions }: { factions: factionType[] }) => {
  return (
    <Stack direction={"row"}>
      {[-3, -2, -1, 0, 1, 2, 3].map((status) => (
        <Stack key={status}>
          <Typography minWidth={100}>{status}</Typography>
          {factions
            .filter((f) => f.status === status)
            .map((f, index) => (
              <Faction
                setFaction={() => {}}
                key={f.uuid}
                faction={f}
                index={index}
              />
            ))}
        </Stack>
      ))}
    </Stack>
  );
};
