export function groupSales(rawSales = []) {
  const map = new Map();

  const pmSig = (arr) =>
    (arr || [])
      .map((pm) => `${pm.method}|${pm.machine || ""}|${Number(pm.amount || 0).toFixed(2)}`)
      .join("||");

  for (const s of rawSales) {
    const dateIso = new Date(s.date).toISOString();
    const key =
      s.saleGroupId || s.groupId || s.quoteId || `${s.customerId || ""}#${dateIso}#${pmSig(s.paymentMethods)}`;

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        date: s.date,
        customerId: s.customerId || null,
        customerName: s.customerName || "Cliente não identificado",
        items: [],
        paymentMethods: s.paymentMethods || [],
        total: 0,
      });
    }

    const g = map.get(key);
    g.items.push({
      productId: s.productId,
      name: s.productName,
      qty: Number(s.quantity || 0),
      unitPrice: Number(s.unitPrice || 0),
      total: Number(s.total || 0),
    });
    g.total = Number((g.total + (s.total || 0)).toFixed(2));
  }

  return Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
}
