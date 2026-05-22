import * as React from "react";
import { assertUnreachable } from "@/imports/helpers";
import { specType } from "./constants";

export const SvgRender = ({ spec }: { spec: specType }) => {
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
