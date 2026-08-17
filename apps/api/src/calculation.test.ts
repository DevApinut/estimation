import assert from "node:assert/strict";
import test from "node:test";
import { calculateEstimate } from "./calculation.js";
import type { EstimateInput } from "./types.js";

const project = { jobName:"",address:"",subdistrict:"",district:"",province:"",postalCode:"",drawingNo:"",wbs:"",requestNo:"",requestDate:"",surveyor:"",estimator:"",reviewer:"" };
test("keeps the three VBA deduction modes", () => {
  const input: EstimateInput = { project, vatRate: .07, sections: [
    { id:"c", title:"charge", kind:"charge", items:[{id:"1",description:"งาน",amount:1000,selected:1}] },
    { id:"d", title:"deduct", kind:"deduction", items:[
      {id:"d1",description:"ก่อน VAT",amount:100,selected:3}, {id:"d2",description:"หลัง VAT",amount:50,selected:2}, {id:"d3",description:"ข้อมูล",amount:20,selected:1}
    ]}
  ]};
  const t = calculateEstimate(input).totals;
  assert.deepEqual(t, { baseBeforeDeduction:1000, deductionBeforeVat:100, deductionAfterVat:50, informationDeduction:20,
    vatBase:900, vat:63, includingVat:963, payable:913, grossProfit:0, mtBase:0, mt7Base:0, mt7Vat:0, mtGrandTotal:0 });
});

test("calculates gross profit as cost times rate", () => {
  const input: EstimateInput = { project, sections:[{id:"c",title:"c",kind:"charge",items:[{id:"1",description:"x",amount:100,selected:1,grossProfitRate:.2}]}] };
  const result = calculateEstimate(input);
  assert.equal(result.totals.grossProfit, 20);
  assert.deepEqual(result.profitReport.rows[0], { id:"1", description:"x", cost:100, rate:.2, profit:20, total:120 });
});

test("Module2 exports at most nine selected profit rows", () => {
  const items = Array.from({length:11},(_,i)=>({id:String(i),description:`row ${i}`,amount:100,selected:1 as const,grossProfitRate:.1}));
  const input: EstimateInput = { project, sections:[{id:"c",title:"c",kind:"charge",items}] };
  const report = calculateEstimate(input).profitReport;
  assert.equal(report.rows.length, 9);
  assert.equal(report.overflowCount, 2);
  assert.equal(report.totalProfit, 90);
});

test("Module1 creates summary_report and summary_subtopic_table models", () => {
  const input: EstimateInput = { project, sections:[
    {id:"pea",title:"ค่าใช้จ่ายที่ กฟภ.ลงทุน",kind:"no-charge",items:[{id:"p",description:"มิเตอร์",amount:100,selected:1}]},
    {id:"charge",title:"ค่าใช้จ่ายที่คิดจากผู้ใช้ไฟ",kind:"charge",items:[{id:"c",description:"งานก่อสร้าง",amount:1000,selected:1}]}
  ]};
  const result = calculateEstimate(input);
  assert.equal(result.summaryReport.sections.length, 2);
  assert.equal(result.subtopicReport.totals.pea, 100);
  assert.equal(result.summaryReport.totals.vat, 70);
});
