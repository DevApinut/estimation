import type { EstimateInput, EstimateItem } from "./types.js";

const money = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const active = (item: EstimateItem) => item.selected !== 0;

export function calculateEstimate(input: EstimateInput) {
  const vatRate = input.vatRate ?? 0.07;
  const sections = input.sections.map(section => {
    const items = section.items.filter(active).map(item => {
      const grossProfit = money(item.amount * (item.grossProfitRate ?? 0));
      return { ...item, grossProfit, totalWithProfit: money(item.amount + grossProfit) };
    });
    const total = money(items.reduce((sum, i) => sum + i.amount, 0));
    return { ...section, items, total };
  });

  const chargeSections = sections.filter(s => s.kind === "charge");
  const baseBeforeDeduction = money(chargeSections.reduce((sum, s) => sum + s.total, 0));
  // Customertable!H3 uses SUMIF(..., "*สมทบแรงสูง*", ...).
  const constructionContribution = money(chargeSections.flatMap(section => section.items)
    .filter(item => item.description.includes("สมทบแรงสูง"))
    .reduce((sum, item) => sum + item.amount, 0));
  const operatingExpense = money(baseBeforeDeduction - constructionContribution);
  const deduction = sections.find(s => s.kind === "deduction");
  const deductionBeforeVat = money(deduction?.items.filter(i => i.selected === 3).reduce((s, i) => s + i.amount, 0) ?? 0);
  const deductionAfterVat = money(deduction?.items.filter(i => i.selected === 2).reduce((s, i) => s + i.amount, 0) ?? 0);
  const informationDeduction = money(deduction?.items.filter(i => i.selected === 1).reduce((s, i) => s + i.amount, 0) ?? 0);
  const vatBase = Math.max(0, money(baseBeforeDeduction - deductionBeforeVat));
  const vat = money(vatBase * vatRate);
  const includingVat = money(vatBase + vat);
  const payable = money(includingVat - deductionAfterVat);
  const profitItems = sections.flatMap(s => s.items).filter(i => (i.grossProfitRate ?? 0) > 0);
  const grossProfit = money(profitItems.reduce((s, i) => s + i.grossProfit, 0));
  const mtBase = money(sections.filter(s => s.kind === "mt").reduce((s, x) => s + x.total, 0));
  const mt7Base = money(sections.filter(s => s.kind === "mt7").reduce((s, x) => s + x.total, 0));
  const mt7Vat = money(mt7Base * vatRate);
  const mt7Items = sections.filter(s => s.kind === "mt7").flatMap(s => s.items).map(item => ({ id:item.id, description:item.description, amount:money(item.amount), group:"MT7" as const }));
  const mtItems = sections.filter(s => s.kind === "mt").flatMap(s => s.items).map(item => ({ id:item.id, description:item.description, amount:money(item.amount), group:"MT" as const }));
  const customerAdditionalRows = [
    ...mt7Items.map(item => ({ type:"item" as const, label:item.description, amount:item.amount, group:item.group })),
    ...(mt7Items.length > 1 ? [{ type:"sum" as const, label:"รวม", amount:mt7Base, group:"MT7" as const }] : []),
    ...(mt7Items.length > 0 ? [
      { type:"vat" as const, label:"ภาษีมูลค่าเพิ่ม 7 %", amount:mt7Vat, group:"MT7" as const },
      { type:"grand" as const, label:"รวมค่าใช้จ่ายทั้งสิ้น(รวมภาษีมูลค่าเพิ่ม)", amount:money(mt7Base + mt7Vat), group:"MT7" as const }
    ] : []),
    ...mtItems.map(item => ({ type:"item" as const, label:item.description, amount:item.amount, group:item.group }))
  ];

  const profitCandidates = input.sections.flatMap(section => section.items)
    .filter(item => item.selected === 1 && Boolean(item.description.trim()) && (item.grossProfitRate ?? 0) !== 0);
  const profitRows = profitCandidates.slice(0, 9).map(item => {
    const cost = money(item.amount);
    const rate = item.grossProfitRate ?? 0;
    const profit = money(cost * rate);
    return { id:item.id, description:item.description.trim(), cost, rate, profit, total:money(cost + profit) };
  });
  const profitReport = {
    rows: profitRows,
    overflowCount: Math.max(0, profitCandidates.length - profitRows.length),
    totalCost: money(profitRows.reduce((sum, row) => sum + row.cost, 0)),
    totalProfit: money(profitRows.reduce((sum, row) => sum + row.profit, 0)),
    totalWithProfit: money(profitRows.reduce((sum, row) => sum + row.total, 0))
  };

  const summarySections = sections
    .filter(section => section.kind === "no-charge" || section.kind === "charge")
    .filter(section => section.items.length > 0)
    .map(section => ({
      id: section.id,
      title: section.title,
      kind: section.kind,
      items: section.items.map(item => ({ id:item.id, description:item.description, amount:money(item.amount) })),
      total: section.total
    }));
  const deductionItems = deduction?.items.map(item => ({ id:item.id, description:item.description, amount:money(item.amount), mode:item.selected })) ?? [];
  const summaryReport = { sections:summarySections, deductionItems, totals:{
    expense:baseBeforeDeduction, deductionBeforeVat, vatBase, vat, includingVat, deductionAfterVat, payable, informationDeduction
  }};
  const subtopicReport = {
    chargeSections: summarySections.filter(section => section.kind === "charge"),
    mtSections: sections.filter(section => section.kind === "mt").filter(section => section.items.length > 0),
    mt7Sections: sections.filter(section => section.kind === "mt7").filter(section => section.items.length > 0),
    peaSections: summarySections.filter(section => section.kind === "no-charge"),
    deductionItems,
    totals:{ expense:baseBeforeDeduction,
      vat:money(baseBeforeDeduction * vatRate),
      includingVat:money(baseBeforeDeduction + money(baseBeforeDeduction * vatRate)),
      mt:mtBase, mt7:mt7Base, mt7Vat, mt7IncludingVat:money(mt7Base + mt7Vat),
      payable:money(baseBeforeDeduction + money(baseBeforeDeduction * vatRate) + mtBase + mt7Base + mt7Vat),
      pea:money(summarySections.filter(section => section.kind === "no-charge").reduce((sum, section) => sum + section.total, 0)) }
  };

  const customerVatBase = money(operatingExpense + constructionContribution);
  const customerVat = money(customerVatBase * vatRate);
  const customerTable = {
    mainTable:{
      hasContribution:constructionContribution > 0,
      operatingExpense,
      contribution:constructionContribution,
      expenseBeforeVat:customerVatBase,
      vat:customerVat,
      total:money(customerVatBase + customerVat)
    },
    additionalRows:customerAdditionalRows
  };
  return { sections, profitReport, summaryReport, subtopicReport, customerTable, totals: { baseBeforeDeduction, deductionBeforeVat, deductionAfterVat, informationDeduction,
    vatBase, vat, includingVat, payable, grossProfit, mtBase, mt7Base, mt7Vat, mtGrandTotal: money(mtBase + mt7Base + mt7Vat) } };
}
