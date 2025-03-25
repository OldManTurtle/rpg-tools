import * as React from "react";

export type fieldElementType<T extends keyof React.JSX.IntrinsicElements> =
  React.JSX.IntrinsicElements[T] extends React.SVGProps<infer P>
    ? { type: `${T}`; props: React.SVGAttributes<P> }
    : never;

export type fieldType = {
  id: string;
  title: string;
} & (
  | fieldElementType<"ellipse">
  | fieldElementType<"rect">
  | fieldElementType<"image">
);

export type specType = {
  dimensions: [number, number];
  fields: fieldType[];
  cards: Record<
    string,
    { value: string; overrides: Partial<fieldType["props"]> }
  >[]; //ID/Value
};
