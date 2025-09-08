import React from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Select from "../ui/Select";
import { UserPlusIcon } from "@heroicons/react/24/outline";

function ClienteStep({ state, dispatch, handleQuickCustomerAdd }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, color: "#444", fontSize: 14 }}>Cliente (opcional)</label>
          <Select
            value={state.selectedCustomerId}
            onChange={(v) => dispatch({ type: "SET_CUSTOMER", payload: v })}
            options={state.customers.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Selecione um cliente"
          />
        </div>
        <Button
          title="Cadastro rápido"
          onClick={() => dispatch({ type: "TOGGLE_QUICK_CUSTOMER" })}
          icon={<UserPlusIcon style={{ width: 18, height: 18 }} />}
          style={{ background: "#16a34a" }}
        >
          Novo
        </Button>
      </div>

      {state.showQuickCustomer && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
          <Input
            placeholder="Nome rápido do cliente"
            value={state.quickCustomerName}
            onChange={(e) => dispatch({ type: "SET_QUICK_CUSTOMER", payload: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleQuickCustomerAdd()}
          />
          <Button onClick={handleQuickCustomerAdd} style={{ background: "#16a34a" }}>
            Salvar
          </Button>
        </div>
      )}

      <TextArea
        rows={3}
        placeholder="Observações na venda (opcional)"
        value={state.notes}
        onChange={(e) => dispatch({ type: "SET_NOTES", payload: e.target.value })}
        style={{ marginTop: 10 }}
      />
    </div>
  );
}

export default React.memo(ClienteStep);
