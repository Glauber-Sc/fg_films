import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrinterIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../utils/format";
import { fetchQuoteById, convertQuoteToSale } from "../services/api";

import logo from "../assets/img/logo.png";

const BLANK_ROWS = 12;

const StatusBadge = ({ status }) => {
  const key = (status || "").toLowerCase();
  const map = {
    converted: {
      label: "Convertido",
      cls: "bg-blue-100 text-blue-700 border-blue-200",
    },
    pending: {
      label: "Pendente",
      cls: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
  };
  const found = map[key] || {
    label: status || "—",
    cls: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${found.cls}`}
    >
      {found.label}
    </span>
  );
};

const ViewQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadQuote = async () => {
    try {
      setIsLoading(true);
      const data = await fetchQuoteById(id);
      setQuote(data);
    } catch (error) {
      console.error("Error loading quote:", error);
      toast.error("Erro ao carregar orçamento");
      navigate("/quotes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToSale = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja converter este orçamento em venda?"
      )
    ) {
      try {
        await convertQuoteToSale(id);
        toast.success("Orçamento convertido em venda com sucesso!");
        navigate("/quotes");
      } catch (error) {
        console.error("Error converting quote to sale:", error);
        toast.error("Erro ao converter orçamento em venda");
      }
    }
  };

  const handlePrint = () => window.print();

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center text-gray-600">
        Carregando...
      </div>
    );
  if (!quote)
    return (
      <div className="flex h-64 items-center justify-center text-gray-600">
        Orçamento não encontrado
      </div>
    );

  return (
    <div className="p-6">
      {/* === CSS GLOBAL DE IMPRESSÃO === */}
      <style>{`
        @media screen { #fg-print { display: none !important; } }
        @media print {
          body * { visibility: hidden !important; }
          #fg-print, #fg-print * { visibility: visible !important; }
          @page { size: A4; margin: 10mm; }
          #fg-print { position: absolute !important; inset: 0 0 auto 0 !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
        }
        #fg-print { font-family: Arial, Helvetica, sans-serif; color: #000; }
        #fg-print .sheet { width: 190mm; margin: 0 auto; background: #fff; }
        .b1 { border:1px solid #000; } .b2 { border:2px solid #000; }
        .p6 { padding:6px; } .p8 { padding:8px; }
        .mt2{ margin-top:2px; } .mt4{ margin-top:4px; } .mt6{ margin-top:6px; } .mt8{ margin-top:8px; } .mb4{ margin-bottom:4px; }
        .tt { text-transform: uppercase; letter-spacing: .2px; }
        .small { font-size:11px; } .xsmall { font-size:10px; }
        .hdr { display:grid; grid-template-columns: 1fr 170px; gap:10px; align-items:center; }
        .brand { display:grid; grid-template-columns: 64px 1fr; gap:8px; align-items:center; }
        .logo { width:64px; height:40px; display:flex; align-items:center; justify-content:center; border:1px solid #000; font-size:10px; }
        .brand h1 { margin:0; font-size:22px; line-height:1; } .brand .sub { margin-top:2px; font-size:11px; }
        .orc { text-align:center; border:2px solid #000; padding:6px; } .orc .t { font-weight:800; font-size:16px; }
        .orc .n { margin-top:6px; border:1px solid #000; height:28px; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .orc .n::before { content:"Nº "; margin-right:2px; }
        .empresa { border:1px solid #000; padding:6px; margin-top:8px; }
        .empresa .row { display:flex; flex-wrap:wrap; justify-content:space-between; gap:8px; }
        .empresa .svc { font-size:11px; } .empresa .addr { font-weight:700; }
        .dados { border:1px solid #000; border-top:none; }
        .dln { display:grid; grid-template-columns: 1.4fr .8fr 1fr .6fr; gap:6px; padding:6px; }
        .dln-2 { grid-template-columns: 1.8fr 1fr .6fr; }
        .dln-3 { grid-template-columns: 1.2fr 1fr 1fr; }
        .dln-4 { grid-template-columns: 1.2fr 1fr 1fr; }
        .field { display:grid; grid-template-rows:auto 26px; gap:2px; }
        .field label { font-size:10px; text-transform:uppercase; }
        .line { border-bottom:1px solid #000; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; padding:2px 4px; }
        table.itens { width:100%; border-collapse:collapse; margin-top:6px; }
        .itens thead th { border:1px solid #000; padding:6px; font-size:11px; text-align:center; }
        .itens tbody td { border:1px solid #000; padding:4px; height:24px; }
        .col-q { width:60px; text-align:center; } .col-vu, .col-t { width:120px; text-align:right; }
        .wm { position:absolute; left:0; right:0; margin:auto; top:92mm; width:75%; text-align:center; font-size:36px; font-weight:700; color:#000; opacity:.06; pointer-events:none; user-select:none; }
        .wm small { display:block; font-weight:400; font-size:16px; letter-spacing:.8px; }
        .foot { display:grid; grid-template-columns: 1fr 220px; gap:10px; align-items:end; margin-top:8px; }
        .valid { border:1px solid #000; padding:6px; min-height:44px; display:grid; align-content:center; font-size:10px; color:#333; }
        .total { border:2px solid #000; padding:8px; text-align:right; font-size:18px; font-weight:800; }
        .sign { display:grid; grid-template-columns: 1fr 240px; gap:20px; align-items:end; margin-top:22mm; }
        .uline { border-top:1px solid #000; height:0; margin-top:24px; } .siglbl { font-size:10px; text-align:center; }
      `}</style>

      {/* === Header padrão + ações === */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Orçamento {quote.quote_number}
          </h1>
          <p className="text-sm text-gray-500">
            Visualize, imprima ou converta em venda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <PrinterIcon className="h-5 w-5" /> Imprimir
          </button>
          {(quote.status || "").toLowerCase() !== "converted" && (
            <button
              onClick={handleConvertToSale}
              className="inline-flex items-center gap-2 rounded-md btn-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary"
            >
              <ShoppingCartIcon className="h-5 w-5" /> Converter em Venda
            </button>
          )}
        </div>
      </div>

      {/* === Card resumo + itens === */}
      <div className="overflow-hidden rounded-lg bg-white shadow no-print">
        <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Resumo</h3>
            <p className="text-sm text-gray-500">Cliente, data e status</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(quote.total)}
            </p>
            <div className="mt-1">
              <StatusBadge status={(quote.status || "").toLowerCase()} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Cliente
            </p>
            <p className="text-sm font-medium text-gray-900">
              {quote.customerName || "Cliente não informado"}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Data
            </p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(quote.date).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="border-t px-6 py-6">
          <h3 className="mb-4 text-sm font-medium text-gray-700">Itens</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Qtd
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Preço Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {quote.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.brand}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {quote.notes && (
          <div className="border-t px-6 py-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Observações
            </h3>
            <p className="text-sm text-gray-900">{quote.notes}</p>
          </div>
        )}
      </div>

      {/* === Layout exclusivo de impressão === */}
      <div id="fg-print">
        <div className="sheet">
          <div className="empresa">
           <div className="hdr">
  <div className="brand" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <img
      src={logo}
      alt="Logo"
      style={{ maxWidth: "220px", height: "auto", objectFit: "contain", marginBottom: "-40px",  marginTop: "-10px" }}
    />
  </div>

  <div className="orc">
    <div className="t">ORÇAMENTO</div>
    <div className="n">{quote.quote_number}</div>
  </div>
</div>

            <div className="row">
              <div style={{ fontWeight: 700 }}>CNPJ: 14.864.222/0001-67</div>
            </div>
            <div className="svc">
              PELÍCULA · SUPER LED · SOM · AMPLIFICADORES · ALARMES · TRAVAS ·
              MÓDULOS
            </div>
            <div className="mt4">
              Tel.: (91) 98241-6768 · <span>fer_maia2005@hotmail.com</span>
            </div>
            <div className="mt4 addr">
              RUA QUINZE DE AGOSTO, 552, CRUZEIRO / ICOARACI
            </div>
          </div>

          <div className="dados">
            <div className="dln">
              <div className="field">
                <label>Nome</label>
                <div className="line">{quote.customerName || ""}</div>
              </div>
              <div className="field">
                <label>Tel.</label>
                <div className="line">{quote.customerPhone || ""}</div>
              </div>
              <div className="field">
                <label></label>
                <div></div>
              </div>
              <div className="field">
                <label></label>
                <div></div>
              </div>
            </div>
            <div className="dln dln-2">
              <div className="field">
                <label>End.</label>
                <div className="line">{quote.address || ""}</div>
              </div>
              <div className="field">
                <label>Cidade</label>
                <div className="line">{quote.city || ""}</div>
              </div>
              <div className="field">
                <label>UF</label>
                <div className="line">{quote.uf || ""}</div>
              </div>
            </div>
            <div className="dln dln-3">
              <div className="field">
                <label>Bairro</label>
                <div className="line">{quote.neighborhood || ""}</div>
              </div>
              <div className="field">
                <label>CPF/CNPJ</label>
                <div className="line">{quote.cpfCnpj || ""}</div>
              </div>
              <div className="field">
                <label>INSC. EST.</label>
                <div className="line">{quote.stateRegistration || ""}</div>
              </div>
            </div>
            <div className="dln dln-4">
              <div className="field">
                <label>COND. PAGAMENTO</label>
                <div className="line">{quote.paymentTerms || ""}</div>
              </div>
              <div className="field">
                <label>PRAZO ENTREGA</label>
                <div className="line">{quote.deliveryTime || ""}</div>
              </div>
              <div className="field">
                <label>VALIDADE</label>
                <div className="line">{quote.validityDate || ""}</div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 150,
                right: 0,
                margin: "auto",
                top: "92mm",
                width: "70%",
                textAlign: "center",
                pointerEvents: "none",
                userSelect: "none",
                top: 70,
              }}
            >
              <img
                src={logo}
                alt="Marca d’água"
                style={{ width: "60%", opacity: 0.06 }}
              />
            </div>

            <table className="itens">
              <thead>
                <tr>
                  <th className="col-q">Quant.</th>
                  <th>Discriminação</th>
                  <th className="col-vu">V. Unit.</th>
                  <th className="col-t">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, i) => (
                  <tr key={i}>
                    <td className="col-q">{item.quantity}</td>
                    <td>{`${item.name}${
                      item.brand ? " - " + item.brand : ""
                    }`}</td>
                    <td className="col-vu">{formatCurrency(item.price)}</td>
                    <td className="col-t">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
                {Array.from({
                  length: Math.max(BLANK_ROWS - quote.items.length, 0),
                }).map((_, i) => (
                  <tr key={`blank-${i}`}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {quote.notes ? (
            <div className="b1 p6 mt6">
              <div className="small tt mb4">Observações</div>
              <div>{quote.notes}</div>
            </div>
          ) : null}

          <div className="foot">
            <div className="valid">
              Apresente este orçamento até a data de validade. Após, será
              realizado um novo orçamento.
              <div className="mt4 xsmall">
                Data: {new Date(quote.date).toLocaleDateString("pt-BR")}
              </div>
              <div className="xsmall">
                Cliente: {quote.customerName || "Não informado"}
              </div>
            </div>
            <div className="total">
              TOTAL R$ {formatCurrency(quote.total).replace("R$ ", "")}
            </div>
          </div>

          <div className="sign">
            <div>
              <div className="uline"></div>
              <div className="siglbl">ASSINATURA</div>
            </div>
            <div>
              <div className="uline"></div>
              <div className="siglbl">DATA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuote;
