import React from "react";
import { C } from "../../../constants/uiPDV";

export default function Checkbox({ checked, onChange, id }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange && onChange(e.target.checked)}
      style={{ width: 18, height: 18, accentColor: C.red, cursor: "pointer" }}
    />
  );
}
