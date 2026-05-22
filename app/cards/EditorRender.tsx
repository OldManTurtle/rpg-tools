import * as React from "react";
import { Grid as Grid2, Button, ButtonGroup, TextField } from "@mui/material";
import { array_move } from "@/imports/helpers";
import { specType } from "./constants";
import { FieldEditor } from "./FieldEditor";

export const EditorRender = ({
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
      <TextField
        type="number"
        value={spec.dimensions[0]}
        onChange={(v) =>
          setSpec({
            ...spec,
            dimensions: [Number.parseFloat(v.target.value), spec.dimensions[1]],
          })
        }
      />
      <TextField
        type="number"
        value={spec.dimensions[1]}
        onChange={(v) =>
          setSpec({
            ...spec,
            dimensions: [spec.dimensions[0], Number.parseFloat(v.target.value)],
          })
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
