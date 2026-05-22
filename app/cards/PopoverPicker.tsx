import React, { useCallback, useRef, useState } from "react";
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";

import { useEffect } from "react";

// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = (
  reference: any,
  handler: (event: MouseEvent) => void,
) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: MouseEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!reference?.current || reference?.current.contains(event.target))
        return;

      handler(event);
    };

    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      startedWhenMounted = reference?.current;
      startedInside =
        reference?.current && reference?.current.contains(event.target);
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [reference, handler]);
};

export const PopoverPicker = ({
  color,
  onChange,
}: {
  color: Parameters<typeof HexColorPicker>[0]["color"];
  onChange: Parameters<typeof HexColorPicker>[0]["onChange"];
}) => {
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          backgroundColor: color,
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          border: "3px solid #fff",
          boxShadow:
            "0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }}
        onClick={() => toggle(true)}
      />
      {isOpen && (
        <div
          ref={popover}
          style={{
            position: "absolute",
            top: "calc(100% + 2px)",
            left: 0,
            borderRadius: "9px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 100,
          }}
        >
          <HexAlphaColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};
