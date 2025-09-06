import React from "react";
import { C } from "../../../constants/uiPDV";

export default function Select({ options = [], value, onChange, style, placeholder }) {
  const caret =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>`
    );

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange && onChange(e.target.value || "")}
      style={{
        width: "100%",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "10px 36px 10px 12px",
        outline: "none",
        fontSize: 14,
        color: C.text,
        backgroundColor: "#fff",
        appearance: "none",
        backgroundImage: `url("${caret}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        ...style,
      }}
    >
      <option value="">{placeholder || "Selecione"}</option>
      {options.map((o) => (
        <option key={o.value ?? o.code ?? o.id} value={o.value ?? o.code ?? o.id}>
          {o.label ?? o.name}
        </option>
      ))}
    </select>
  );
}
