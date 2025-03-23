import * as React from "react";
import {
  Container,
  Paper,
  Box,
  Toolbar,
  Grid2,
  Slider,
  Button,
  ButtonGroup,
  TextField,
  AccordionActions,
  Accordion,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/imports/theme";
import { useState } from "react";
import { array_move } from "@/imports/helpers";

const assertUnreachable = (x: never): never => {
  throw new Error("Didn't expect to get here" + x);
};

type fieldElementType<T extends keyof React.JSX.IntrinsicElements> =
  React.JSX.IntrinsicElements[T] extends React.SVGProps<infer P>
    ? { type: `${T}`; props: React.SVGAttributes<P> }
    : never;

type fieldType = {
  id: string;
  title: string;
} & (
  | fieldElementType<"ellipse">
  | fieldElementType<"rect">
  | fieldElementType<"image">
);

type specType = {
  dimensions: [number, number];
  fields: fieldType[];
  cards: Record<
    string,
    { value: string; overrides: Partial<fieldType["props"]> }
  >[]; //ID/Value
};

const FieldEditor = ({
  field,
  setField,
  moveUp,
  deleteThis,
  spec,
}: {
  moveUp: () => void;
  field: fieldType;
  // eslint-disable-next-line no-unused-vars
  setField: (t: fieldType) => void;
  deleteThis: () => void;
  spec: specType;
}) => {
  const wrap = (stuff: (keyof fieldType["props"])[]) => (
    <Grid2 container>
      <Grid2>
        <Button
          onClick={(event) => {
            event.bubbles = false;
            moveUp();
          }}
        >
          Move Up
        </Button>
      </Grid2>

      <Grid2 flex={1}>
        <Accordion>
          <AccordionSummary>
            <Typography>
              {field.title || "Untitled"} ({field.type})
            </Typography>
          </AccordionSummary>
          <AccordionActions>
            <Grid2 container spacing={1}>
              <TextField
                label={"Title"}
                value={field.title}
                onChange={(v) => {
                  setField({
                    ...field,
                    title: v.target.value,
                  });
                }}
              />
              <ButtonGroup>
                {(["ellipse", "rect", "image"] as const).map((type) => (
                  <Button
                    key={type}
                    onClick={() => setField({ ...field, type, props: {} })}
                    variant={type === field.type ? "contained" : undefined}
                  >
                    {type}
                  </Button>
                ))}
              </ButtonGroup>
              {stuff.map((key) => (
                <Grid2 key={key}>
                  <TextField
                    label={key}
                    value={field.props[key]}
                    id={key}
                    onChange={(v) => {
                      console.log(key, v.target.value);

                      //@ts-expect-error This doesn't type nice
                      setField({
                        ...field,
                        props: { ...field.props, [key]: v.target.value },
                      });
                    }}
                  />
                </Grid2>
              ))}
              <Grid2 size={{ xs: 12 }}>
                <Button
                  onClick={(event) => {
                    event.bubbles = false;
                    deleteThis();
                  }}
                  color="error"
                  variant="contained"
                >
                  Delete
                </Button>
              </Grid2>
            </Grid2>
          </AccordionActions>
        </Accordion>
      </Grid2>
    </Grid2>
  );
  switch (field.type) {
    case "ellipse": {
      return wrap(["color", "cx", "cy", "rx", "ry"]);
    }
    case "rect": {
      return wrap([
        "width",
        "height",
        "x",
        "y",
        "fill",
        "stroke",
        "strokeWidth",
      ]);
    }
    case "image": {
      return wrap([]);
    }
    default: {
      assertUnreachable(field);
    }
  }
  return <div>How the hell did this render?</div>;
};

const EditorRender = ({
  spec,
  setSpec,
}: {
  spec: specType;
  setSpec: React.Dispatch<React.SetStateAction<specType>>;
}) => {
  const commonCards: Record<string, [number, number]> = {
    Poker: [63, 88],
    Bridge: [57, 88],
    Mini: [44, 68],
    "Large Tarot": [70, 120],
    "Small Tarot": [70, 108],
    "Large Square": [70, 70],
    "Small Square": [63, 63],
  };
  return (
    <Grid2 container spacing={1}>
      <ButtonGroup>
        {Object.entries(commonCards).map(([n, m]) => (
          <Button
            key={n}
            onClick={() => setSpec({ ...spec, dimensions: m })}
            variant={
              spec.dimensions[0] === m[0] && spec.dimensions[1] === m[1]
                ? "contained"
                : undefined
            }
          >
            {n}
          </Button>
        ))}
      </ButtonGroup>
      <Slider
        min={1}
        step={1}
        max={200}
        valueLabelDisplay="auto"
        value={spec.dimensions[0]}
        onChange={(v, t) =>
          typeof t === "number" &&
          setSpec({ ...spec, dimensions: [t, spec.dimensions[1]] })
        }
      />
      <Slider
        min={1}
        max={200}
        step={0.1}
        valueLabelDisplay="auto"
        value={spec.dimensions[1]}
        onChange={(v, t) =>
          typeof t === "number" &&
          setSpec({ ...spec, dimensions: [spec.dimensions[0], t] })
        }
      />

      <Button
        onClick={() =>
          setSpec({
            ...spec,
            fields: [
              ...spec.fields,
              {
                id: Math.floor(Math.random() * 10_000) + "",
                type: "rect",
                title: "",
                props: {},
              },
            ],
          })
        }
      >
        Add Field
      </Button>
      {spec.fields.map((field, index) => (
        <FieldEditor
          setField={(n) => {
            spec.fields[index] = n;
            setSpec({ ...spec, fields: [...spec.fields] });
          }}
          field={field}
          spec={spec}
          key={field.id + index}
          moveUp={() => {
            if (index)
              setSpec({
                ...spec,
                fields: array_move(spec.fields, index),
              });
          }}
          deleteThis={function (): void {
            const yes = confirm(
              `Are you sure you want to delete ${field.title}? This cannot be undone.`,
            );
            if (!yes) return;
            spec.fields.splice(index, 1);
            setSpec({ ...spec, fields: [...spec.fields] });
          }}
        />
      ))}
    </Grid2>
  );
};

const SvgRender = ({ spec }: { spec: specType }) => {
  return (
    <svg
      width={Math.min(spec.dimensions[0] * 2, 300) * 2 + "px"}
      height={Math.min(spec.dimensions[1] * 2, 300) * 2 + "px"}
      fill="currentColor"
      viewBox={`0 0 ${spec.dimensions[0]} ${spec.dimensions[1]}`}
    >
      {spec.fields.map((field) => {
        switch (field.type) {
          case "ellipse": {
            return <ellipse key={field.id} {...field.props} />;
          }
          case "rect": {
            return <rect key={field.id} {...field.props} />;
          }
          case "image": {
            return <image key={field.id} {...field.props} />;
          }

          default: {
            assertUnreachable(field);
          }
        }
      })}
      <rect
        width={spec.dimensions[0]}
        height={spec.dimensions[1]}
        x={0}
        y={0}
        fill="none"
        stroke="red"
        strokeWidth={2}
      />
    </svg>
  );
};

export default function Dashboard() {
  const [spec, setSpec] = useState<specType>({
    dimensions: [100, 100], //mm
    fields: [
      {
        title: "Ellipse",
        id: "0",
        type: "ellipse",
        props: {
          color: "blue",
          cx: 10,
          cy: 10,
          rx: 50,
          ry: 5,
        },
      },
      {
        title: "Ellipse",
        id: "1",
        type: "rect",
        props: {
          color: "green",
          width: 10,
          height: 10,
          x: 1,
        },
      },
      {
        title: "Ellipse",
        id: "2",
        type: "rect",
        props: {
          color: "green",
          width: 10,
          height: 10,
          x: 1,
        },
      },
    ],
    cards: [],
  });
  return (
    <ThemeProvider theme={theme}>
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
          <Grid2 container spacing={2}>
            <Grid2 component={Paper}>
              <SvgRender spec={spec} />
            </Grid2>
            <Grid2
              component={Paper}
              flex={1}
              sx={{ overflowY: "auto", maxHeight: "80vh" }}
            >
              <EditorRender spec={spec} setSpec={setSpec} />
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
