import React from "react";
import { C } from "../../../constants/uiPDV";

export default function TextArea({ style, ...props }) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 12px",
        outline: "none",
        fontSize: 14,
        color: C.text,
        background: "#fff",
        resize: "vertical",
        ...style,
      }}
    />
  );
}
