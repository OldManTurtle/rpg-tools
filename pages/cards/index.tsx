import * as React from "react";
import {
  Container,
  Paper,
  Box,
  Toolbar,
  Grid2,
  Stack,
  Slider,
  Button,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/imports/theme";
import { useState } from "react";

const assertUnreachable = (x: never): never => {
  throw new Error("Didn't expect to get here" + x);
};

type fieldType<T extends keyof React.JSX.IntrinsicElements> =
  React.JSX.IntrinsicElements[T] extends React.SVGProps<infer P>
    ? { type: `${T}`; props: React.SVGAttributes<P> }
    : never;

type field = {
  id: string;
} & (fieldType<"ellipse"> | fieldType<"rect"> | fieldType<"image">);

type specType = {
  dimensions: [number, number];
  fields: field[];
  cards: Record<
    string,
    { value: string; overrides: Partial<field["props"]> }
  >[]; //ID/Value
};

const EditorRender = ({
  spec,
  setSpec,
}: {
  spec: specType;
  setSpec: React.Dispatch<React.SetStateAction<specType>>;
}) => {
  return (
    <Grid2>
      <Slider
        min={1}
        step={1}
        max={1000}
        valueLabelDisplay="auto"
        value={spec.dimensions[0]}
        onChange={(v, t) =>
          typeof t === "number" &&
          setSpec({ ...spec, dimensions: [t, spec.dimensions[1]] })
        }
      />
      <Slider
        min={1}
        max={1000}
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
                props: {},
              },
            ],
          })
        }
      >
        Add Field
      </Button>

      {JSON.stringify(spec, undefined, 2)}
    </Grid2>
  );
};

const SvgRender = ({ spec }: { spec: specType }) => {
  return (
    <svg
      width="100%"
      height="200px"
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
        id: "1",
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
          <Stack spacing={2}>
            <Paper>
              <SvgRender spec={spec} />
            </Paper>
            <Paper>
              <EditorRender spec={spec} setSpec={setSpec} />
            </Paper>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
