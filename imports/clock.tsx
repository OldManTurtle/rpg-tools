import {
  Dialog,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import React from "react";
import {
  blue,
  green,
  grey,
  orange,
  pink,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// eslint-disable-next-line @next/next/no-img-element
export const clockOutline = (darkMode: boolean) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/clock_outline.png"
    alt="clock"
    style={{
      position: "absolute",
      width: "100%",
      aspectRatio: 1,
      top: 0,
      left: 0,
      pointerEvents: "none",
      filter: darkMode ? "invert()" : undefined,
    }}
  />
);

export type clockType = {
  size: number;
  filled: number;
  title: string;
  uuid: string;
  color: string;
  page?: number;
};
export const Clock = ({
  clock: { size, filled: f, title, ...clock },
  setClock,
  deleteClock,
  moveLeft,
  insertBefore,
  dark,
}: {
  clock: clockType;
  dark: boolean;
  setClock: (argument: clockType) => void;
  deleteClock: () => void;
  moveLeft: () => void;
  insertBefore: () => void;
}) => {
  const filled = Math.min(size, f);
  const on = { value: 1, on: true };
  const off = { value: 1, on: false };
  const data01 = [
    ...Array.from({ length: size - filled }).map(() => off),
    ...Array.from({ length: filled }).map(() => on),
  ];
  const [open, setOpen] = useState(false);

  const radRatio = 0.86;
  const [contextMenu, setContextMenu] = useState<
    | {
        mouseX: number;
        mouseY: number;
      }
    | undefined
  >(undefined);
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
                  stroke={dark ? clock.color : grey[700]}
                  strokeWidth={dark ? 1 : 2}
                  style={{ outline: "none" }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.bubbles = false;
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
                  onDrag={(event) => console.log(event.movementX)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {clockOutline(dark)}
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
          {[3, 4, 6, 8, 12].map((n) => (
            <MenuItem
              key={n}
              onClick={() => {
                setClock({ size: n, filled, title, ...clock });
                setContextMenu(undefined);
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
                setContextMenu(undefined);
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
              setContextMenu(undefined);
            }}
          >
            Move Left
          </MenuItem>
          <MenuItem
            onClick={() => {
              insertBefore();
              setContextMenu(undefined);
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
              setContextMenu(undefined);
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
