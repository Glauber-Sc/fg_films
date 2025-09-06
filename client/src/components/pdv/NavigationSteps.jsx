import React from "react";
import { C } from "../../constants/uiPDV";

export default function NavigationSteps({ currentStep, setCurrentStep }) {
  const steps = React.useMemo(
    () => [
      { label: "Produto (Alt+Z)", key: "produto" },
      { label: "Cliente (Alt+C)", key: "cliente" },
      { label: "Pagamento (Alt+B)", key: "pagamento" },
    ],
    []
  );
  const ARROW_W = 18;

  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        overflow: "hidden",
        padding: 4,
        border: `1px solid ${C.border}`,
      }}
    >
      {steps.map((step, index) => {
        const active = currentStep === step.key;
        return (
          <div
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            style={{
              flex: 1,
              position: "relative",
              padding: "10px 16px",
              textAlign: "center",
              fontWeight: 800,
              fontSize: 14,
              color: active ? "#fff" : "#666",
              background: active ? C.red : "#e1e1e1",
              cursor: "pointer",
              userSelect: "none",
              transition: "background .2s ease",
              borderTopLeftRadius: index === 0 ? 6 : 0,
              borderBottomLeftRadius: index === 0 ? 6 : 0,
              borderTopRightRadius: index === steps.length - 1 ? 6 : 0,
              borderBottomRightRadius: index === steps.length - 1 ? 6 : 0,
              zIndex: active ? 3 : 1,
            }}
          >
            {step.label}
            {active && index < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "calc(100% - 1px)",
                  width: ARROW_W,
                  background: C.red,
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  zIndex: 4,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
