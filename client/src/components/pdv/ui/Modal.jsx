import React from "react";
import { C } from "../../../constants/uiPDV";

export default function Modal({ open, onClose, title, footer, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 520,
          maxWidth: "92vw",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 10px 28px rgba(0,0,0,.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontWeight: 800 }}>
          {title}
        </div>
        <div style={{ padding: 16 }}>{children}</div>
        <div
          style={{
            padding: 12,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}
