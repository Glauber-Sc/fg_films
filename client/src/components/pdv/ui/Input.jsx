import React from "react";
import { C } from "../../../constants/uiPDV";

const Input = React.forwardRef(({ style, ...props }, ref) => (
  <input
    ref={ref}
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
      ...style,
    }}
  />
));

export default Input;
