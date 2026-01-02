import {
  Dialog,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import {
  amber,
  blue,
  blueGrey,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  orange,
  pink,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
// eslint-disable-next-line @next/next/no-img-element
export const clockOutline = (
  <img
    src="https://raw.githubusercontent.com/amcilraithwustl/rpg-tools/main/public/clock_outline.png"
    alt="clock"
    style={{
      position: "absolute",
      width: "100%",
      aspectRatio: 1,
      top: 0,
      left: 0,
      pointerEvents: "none",
    }}
  />
);

export type clockType = {
  size: number;
  filled: number;
  title: string;
  uuid: string;
  color: string;
};
export const Clock = ({
  clock: { size, filled: f, title, ...clock },
  setClock,
  deleteClock,
  moveLeft,
  insertBefore,
}: {
  clock: clockType;
  setClock: (argument: clockType) => void;
  deleteClock: () => void;
  moveLeft: () => void;
  insertBefore: () => void;
}) => {
  const filled = Math.min(size, f);
  const on = { value: 1, on: true };
  const off = { value: 1, on: false };
  const data01 = [
    ...[...new Array(size - filled)].map(() => off),
    ...[...new Array(filled)].map(() => on),
  ];
  const [open, setOpen] = useState(false);

  const radRatio = 0.86;
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const theme = useTheme();
  const clockE = (clockRadius = 80) => (
    <Grid
      item
      style={{ width: clockRadius * 2 }}
      sx={{
        margin: 1,
      }}
    >
      <div
        style={{
          height: clockRadius * 2,
          width: clockRadius * 2,
          position: "relative",
          userSelect: "none",
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          setContextMenu(
            contextMenu === null
              ? {
                  mouseX: event.clientX + 2,
                  mouseY: event.clientY - 6,
                }
              : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
          );
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ transform: "rotate(-90deg)" }}
        >
          <PieChart width={100} height={100}>
            <Pie
              data={data01}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={radRatio * clockRadius}
              isAnimationActive={false}
            >
              {data01.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.on ? clock.color : "#0000"}
                  stroke={grey[700]}
                  strokeWidth={2}
                  style={{ outline: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.bubbles = false;
                    open
                      ? setClock({
                          filled:
                            size - index === filled
                              ? size - index - 1
                              : size - index,
                          title,
                          size,
                          ...clock,
                        })
                      : setOpen(true);
                  }}
                  onDrag={(e) => console.log(e.movementX)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {clockOutline}
        <Menu
          open={contextMenu !== null}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu === null
              ? undefined
              : { top: contextMenu.mouseY, left: contextMenu.mouseX }
          }
        >
          {[3, 4, 6, 8, 12].map((n) => (
            <MenuItem
              key={n}
              onClick={() => {
                setClock({ size: n, filled, title, ...clock });
                setContextMenu(null);
              }}
            >
              {n}
            </MenuItem>
          ))}
          <Divider />
          {(
            [
              ["Gray", grey[600]],
              ["Red", red[600]],
              ["Green", green[600]],
              ["Blue", blue[600]],
              ["Yellow", yellow[600]],
              ["Orange", orange[600]],
              ["Purple", purple[600]],
              ["Pink", pink[600]],
            ] as const
          ).map(([name, color]) => (
            <MenuItem
              key={color}
              onClick={() => {
                setContextMenu(null);
                setClock({ title, size, filled, ...clock, color });
              }}
            >
              {name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem
            onClick={() => {
              moveLeft();
              setContextMenu(null);
            }}
          >
            Move Left
          </MenuItem>
          <MenuItem
            onClick={() => {
              insertBefore();
              setContextMenu(null);
            }}
          >
            Insert Left
          </MenuItem>
          <MenuItem
            onClick={() => {
              const yes = confirm(
                "Are you sure you want to delete this clock?",
              );
              if (!yes) return;
              deleteClock();
              setContextMenu(null);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>

      <TextField
        value={title}
        multiline
        placeholder={"My Clock"}
        variant="standard"
        onChange={(v) => {
          v.preventDefault();
          setClock({ size, filled, title: v.target.value, ...clock });
        }}
      />
    </Grid>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{ transform: "scale(2.5)" }}
      >
        <Paper sx={{ padding: 1 }}>{clockE()}</Paper>
      </Dialog>
      {clockE()}
    </>
  );
};
