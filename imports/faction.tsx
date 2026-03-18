import React, { useState } from "react";
import { Divider, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { CollisionPriority } from "@dnd-kit/abstract";

export type factionType = {
  status: number;
  uuid: string;
  name: string;
  page: number;
};

const Faction = ({
  faction,
  setFaction,
  deleteFaction,
  index,
}: {
  faction: factionType;
  setFaction: (argument: factionType) => void;
  deleteFaction: () => void;
  index: number;
}) => {
  const { ref } = useSortable({
    id: faction.uuid,
    index,
    type: "faction",
    accept: "faction",
    group: faction.status + "",
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
            const d = prompt('Are you sure? Type "DELETE" to remove.');
            if (d === "DELETE") deleteFaction();
            setContextMenu(undefined);
          }}
        >
          Delete
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

const FactionStatusList = ({
  status,
  factions,
  deleteFaction,
  setFaction,
}: {
  status: string;
  factions: factionType[];
  setFaction: (argument: factionType) => void;
  deleteFaction: (argument: string) => void;
}) => {
  const { ref } = useDroppable({
    id: status,
    type: "status",
    collisionPriority: CollisionPriority.Low,
    accept: "faction",
  });
  return (
    <Stack
      key={status}
      ref={ref}
      sx={{ border: "1px red solid", minHeight: "100px" }}
    >
      <Typography minWidth={100}>{status}</Typography>
      {factions
        .filter((f) => f.status + "" === status)
        .map((f, index) => (
          <Faction
            setFaction={setFaction}
            key={f.uuid}
            faction={f}
            index={index}
            deleteFaction={() => deleteFaction(f.uuid)}
          />
        ))}
    </Stack>
  );
};
const statuses = [-3, -2, -1, 0, 1, 2, 3] as const;
export const FactionList = ({
  factions,
  setFaction,
  setFactions,
  deleteFaction,
}: {
  factions: factionType[];
  setFaction: (argument: factionType) => void;
  setFactions: (argument: Record<string, string[]>) => void;
  deleteFaction: (argument: string) => void;
}) => {
  const items = Object.fromEntries(
    statuses.map((status) => [
      status,
      factions.filter((s) => s.status === status).map((s) => s.uuid),
    ]),
  ) as Record<(typeof statuses)[number], string[]>;
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        event.nativeEvent?.preventDefault();
        const index = move(items, event);
        console.log("INDEX", index);
        setFactions(index);
      }}
    >
      <Stack direction={"row"}>
        {statuses.map((status) => (
          <FactionStatusList
            key={status + ""}
            factions={factions}
            status={status + ""}
            setFaction={setFaction}
            deleteFaction={deleteFaction}
          />
        ))}
      </Stack>
    </DragDropProvider>
  );
};
