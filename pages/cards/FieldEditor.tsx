import * as React from "react";
import {
  Grid as Grid2,
  Button,
  ButtonGroup,
  TextField,
  AccordionActions,
  Accordion,
  AccordionSummary,
  Typography,
  InputAdornment,
  FilledInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { assertUnreachable } from "@/imports/helpers";
import { PopoverPicker } from "./PopoverPicker";
import { fieldType } from "./constants";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const FieldEditor = ({
  field,
  setField,
  moveUp,
  deleteThis,
}: {
  moveUp: () => void;
  field: fieldType;
  setField: (t: fieldType) => void;
  deleteThis: () => void;
}) => {
  const setTitle = (title: string) => setField({ ...field, title });
  const setType = (type: typeof field.type) =>
    setField({ ...field, type, props: {} });
  const wrap = (
    stuff: Partial<Record<keyof fieldType["props"], "text" | "color" | "file">>,
  ) => (
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
        <Accordion elevation={3}>
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
                onChange={(v) => setTitle(v.target.value)}
              />
              <ButtonGroup>
                {(["ellipse", "rect", "image"] as const).map((type) => (
                  <Button
                    key={type}
                    onClick={() => setType(type)}
                    variant={type === field.type ? "contained" : undefined}
                  >
                    {type}
                  </Button>
                ))}
              </ButtonGroup>
              {Object.entries(stuff).map(([k, type]) => {
                const key = k as keyof typeof stuff;
                const handleChange = (
                  v: (typeof field.props)[keyof typeof field.props],
                ) =>
                  //@ts-expect-error This doesn't type nice
                  setField({
                    ...field,
                    props: { ...field.props, [key]: v },
                  });

                switch (type) {
                  case "text": {
                    return (
                      <Grid2 key={key}>
                        <TextField
                          label={key}
                          value={field.props[key]}
                          id={key}
                          onChange={(v) => {
                            handleChange(v.target.value);
                          }}
                        />
                      </Grid2>
                    );
                  }
                  case "color": {
                    return (
                      <Grid2 key={key}>
                        <FormControl
                          sx={{ m: 1, width: "25ch" }}
                          variant="filled"
                        >
                          <InputLabel htmlFor={key}>{key}</InputLabel>
                          <FilledInput
                            value={field.props[key]}
                            id={key}
                            onChange={(v) => {
                              handleChange(v.target.value);
                            }}
                            endAdornment={
                              <InputAdornment position="end">
                                <PopoverPicker
                                  color={field.props[key] + ""}
                                  onChange={(v) => handleChange(v)}
                                />
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid2>
                    );
                  }
                  case "file": {
                    return (
                      <Grid2 key={key}>
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                        >
                          Upload file
                          <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => {
                              console.log(event.target.files);
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();

                              reader.addEventListener(
                                "load",
                                () => {
                                  handleChange(reader.result as string);
                                },
                                false,
                              );

                              reader.readAsDataURL(file);
                            }}
                            multiple={false}
                            accept="image/*"
                          />
                        </Button>
                      </Grid2>
                    );
                  }
                  default: {
                    return assertUnreachable(type);
                  }
                }
              })}
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
      return wrap({
        color: "color",
        cx: "text",
        cy: "text",
        rx: "text",
        ry: "text",
      });
    }
    case "rect": {
      return wrap({
        width: "text",
        height: "text",
        x: "text",
        y: "text",
        fill: "color",
        stroke: "color",
        strokeWidth: "text",
      });
    }
    case "image": {
      return wrap({
        href: "file",
        height: "text",
        width: "text",
        x: "text",
        y: "text",
        preserveAspectRatio: "text",
      });
    }
    default: {
      assertUnreachable(field);
    }
  }
  return <div>How the hell did this render?</div>;
};
