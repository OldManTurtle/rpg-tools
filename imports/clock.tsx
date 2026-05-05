import {
  Box,
  Dialog,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useMemo } from "react";
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
  burned?: number;
  breaks?: number[];
  uuid: string;
  color: string;
  page?: number;
};
const on = { value: 1, on: true };
const off = { value: 1, on: false };
export const Clock = ({
  clock: { size, filled: f, title, ...clock },
  setClock,
  numbers,
  lines,
  fillLines,
  deleteClock,
  moveLeft,
  insertBefore,
  dark,
}: {
  numbers: boolean;
  clock: clockType;
  dark: boolean;
  fillLines: boolean;
  lines: boolean;
  setClock: (argument: clockType) => void;
  deleteClock: () => void;
  moveLeft: () => void;
  insertBefore: () => void;
}) => {
  const innerRadius = 0.3;
  const filled = Math.min(size, f);
  const data01 = useMemo(
    () => [
      ...Array.from({ length: size - filled }).map(() => off),
      ...Array.from({ length: filled }).map(() => on),
    ],
    [filled, size],
  );
  const [open, setOpen] = useState(false);

  const radRatio = 0.86;
  const [contextMenu, setContextMenu] = useState<
    | {
        mouseX: number;
        mouseY: number;
      }
    | undefined
  >(undefined);
  const [contextMenu2, setContextMenu2] = useState<
    | {
        mouseX: number;
        mouseY: number;
      }
    | undefined
  >(undefined);
  const clockRadius = 80;
  const menu = (
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
          setContextMenu2(contextMenu);
          setContextMenu(undefined);
        }}
      >
        Other Menu
      </MenuItem>
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
          const yes = confirm("Are you sure you want to delete this clock?");
          if (!yes) return;
          deleteClock();
          setContextMenu(undefined);
        }}
      >
        Delete
      </MenuItem>
    </Menu>
  );
  const menu2 = (
    <Menu
      open={!!contextMenu2}
      onClose={() => setContextMenu2(undefined)}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu2 === undefined
          ? undefined
          : { top: contextMenu2.mouseY, left: contextMenu2.mouseX }
      }
    >
      {Array.from({ length: size + 1 })
        .map((_, index) => index)
        .filter((index) => index !== clock.burned)
        .map((index) => (
          <MenuItem
            key={index + "b"}
            onClick={() =>
              setClock({
                ...clock,
                filled: f,
                title,
                size,
                burned: index,
              })
            }
          >
            Burn {(clock.burned || 0) < index ? "+" : ""}
            {index - (clock.burned || 0)}
          </MenuItem>
        ))}
    </Menu>
  );
  const roundClock = (
    <Grid
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
                  stroke={dark ? clock.color : clock.color}
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
        {menu}
        {menu2}
        <Zoom in={numbers}>
          <Box
            sx={{
              pointerEvents: "none",
              position: "absolute",
              left: clockRadius * (1 - innerRadius),
              top: clockRadius * (1 - innerRadius),
              backgroundColor: (t) => t.palette.background.default,
              borderRadius: clockRadius,
              borderColor: () => clock.color,
              borderStyle: "solid",
              borderWidth: dark ? 2 : 2.5,
              width: clockRadius * innerRadius * 2,
              height: clockRadius * innerRadius * 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography fontSize={20}>
              {filled}/{size}
            </Typography>
          </Box>
        </Zoom>
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

  const lineClock = (
    <Grid
      sx={{
        margin: 1,
        width: size * 30,
      }}
    >
      <div
        style={{
          position: "relative",
          userSelect: "none",
          height: 10,
          paddingBottom: 15,
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
        <Stack
          direction="row"
          alignItems={"center"}
          onClick={(event) => {
            if (open) return;
            event.preventDefault();
            event.stopPropagation();
            event.bubbles = false;
            setOpen(true);
          }}
        >
          {data01
            .toReversed()
            .map((data, index) => (
              <Box
                onClick={(event) => {
                  if (!open) return;
                  event.preventDefault();
                  event.stopPropagation();
                  event.bubbles = false;
                  console.log(
                    index,
                    filled,
                    index + 1 === filled ? index : index + 1,
                  );
                  setClock({
                    filled: index + 1 === filled ? index : index + 1,
                    title,
                    size,
                    ...clock,
                  });
                }}
                key={data.value}
                sx={{
                  position: "relative",
                  border: "2px solid",
                  borderColor: clock.color,
                  borderRadius: 100,
                  width: 15,
                  height: 15,
                  backgroundColor:
                    fillLines && data.on ? clock.color : undefined,
                }}
              >
                {(!fillLines && data.on) ||
                (fillLines &&
                  clock.burned &&
                  clock.burned > index &&
                  !data.on) ? (
                  <Box
                    sx={{
                      backgroundColor: clock.color,
                      width: 2,
                      marginLeft: 0.5,
                      marginRight: 0.5,
                      height: 13,
                      transform: "rotate(45deg)translate(.2px, -1px)",
                    }}
                  />
                ) : undefined}
                {fillLines &&
                clock.burned &&
                clock.burned > index &&
                data.on ? (
                  <Box
                    sx={{
                      backgroundColor: "black",
                      width: 3,
                      marginLeft: 0.5,
                      marginRight: 0.5,
                      height: 17,
                      transform: "rotate(45deg)translate(-1.3px, -2px)",
                    }}
                  />
                ) : undefined}
                {!fillLines && clock.burned && clock.burned > index ? (
                  <Box
                    sx={{
                      position: "absolute",
                      backgroundColor: clock.color,
                      width: 2,
                      marginLeft: 0.5,
                      marginRight: 0.5,
                      height: 13,
                      top: 0,
                      transform: "rotate(-45deg)translate(.8px, 0.5px)",
                    }}
                  />
                ) : undefined}
              </Box>
            ))
            .flatMap((element, index) =>
              index === 0
                ? [element]
                : [
                    <Box
                      key={index + "SPACER"}
                      sx={{
                        border: "1px  solid",
                        borderColor: clock.color,
                        borderRadius: 0,
                        width: 5,
                        height: 0,
                      }}
                    />,
                    element,
                  ],
            )}
        </Stack>
      </div>
      {menu}
      {menu2}
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
        <Paper sx={{ padding: 1 }}>{lines ? lineClock : roundClock}</Paper>
      </Dialog>
      {lines ? lineClock : roundClock}
    </>
  );
};
