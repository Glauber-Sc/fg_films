import React from "react";
import { C } from "../../../constants/uiPDV";

export default function Button({
  label,
  icon,
  children,
  outlined,
  danger,
  onClick,
  style,
  title,
  disabled,
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: outlined ? `1.5px solid ${danger ? C.red : C.red}` : "none",
    background: outlined ? "#fff" : danger ? C.red : C.red,
    color: outlined ? C.red : "#fff",
    transition: "filter .15s ease",
    boxShadow: outlined ? "none" : "0 2px 4px rgba(0,0,0,0.08)",
    ...style,
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      style={base}
      onMouseDown={(e) => (e.currentTarget.style.filter = "brightness(.95)")}
      onMouseUp={(e) => (e.currentTarget.style.filter = "none")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
      disabled={disabled}
    >
      {icon}
      {label ?? children}
    </button>
  );
}
