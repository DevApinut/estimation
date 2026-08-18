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

test("summary_subtopic_table includes normal, MT, MT7 and PEA groups", () => {
 const input:EstimateInput={project,sections:[
  {id:"charge",title:"ปกติ",kind:"charge",items:[{id:"c",description:"งานปกติ",amount:1000,selected:1}]},
  {id:"mt",title:"มท.",kind:"mt",items:[{id:"m",description:"ค่าประกัน",amount:200,selected:1}]},
  {id:"mt7",title:"มท.7",kind:"mt7",items:[{id:"m7",description:"ค่าตรวจสอบ",amount:300,selected:1}]},
  {id:"pea",title:"กฟภ.",kind:"no-charge",items:[{id:"p",description:"ลงทุน",amount:400,selected:1}]}
 ]};
 const report=calculateEstimate(input).subtopicReport;
 assert.equal(report.mtSections.length,1);
 assert.equal(report.mt7Sections.length,1);
 assert.deepEqual(report.totals,{expense:1000,vat:70,includingVat:1070,mt:200,mt7:300,mt7Vat:21,mt7IncludingVat:321,payable:1591,pea:400});
});

test("Module1 builds Customertable Table4 with MT7 before MT", () => {
 const input:EstimateInput={project,sections:[
  {id:"mt7",title:"MT7",kind:"mt7",items:[{id:"m71",description:"MT7 หนึ่ง",amount:100,selected:1},{id:"m72",description:"MT7 สอง",amount:200,selected:1}]},
  {id:"mt",title:"MT",kind:"mt",items:[{id:"m1",description:"MT หนึ่ง",amount:50,selected:1}]}
 ]};
 const result=calculateEstimate(input);
 assert.deepEqual(result.customerTable.additionalRows.map(row=>row.group),["MT7","MT7","MT7","MT7","MT7","MT"]);
 assert.deepEqual(result.customerTable.additionalRows.slice(2,5).map(row=>row.type),["sum","vat","grand"]);
 assert.equal(result.customerTable.additionalRows[3].amount,result.totals.mt7Vat);
});

test("Customertable omits the repeated sum row for one MT7 item", () => {
 const input:EstimateInput={project,sections:[{id:"mt7",title:"MT7",kind:"mt7",items:[
  {id:"m71",description:"ค่าธรรมเนียม MT7",amount:1000,selected:1}
 ]}]};
 const rows=calculateEstimate(input).customerTable.additionalRows;
 assert.deepEqual(rows.map(row=>row.type),["item","vat","grand"]);
 assert.equal(rows.some(row=>row.label==="รวม"),false);
 assert.equal(rows[2].label,"รวมค่าใช้จ่ายทั้งสิ้น(รวมภาษีมูลค่าเพิ่ม)");
});

test("Customertable changes one main table when construction contribution exists", () => {
 const withContribution:EstimateInput={project,sections:[{id:"charge",title:"ค่าใช้จ่ายที่คิดจากผู้ใช้ไฟ",kind:"charge",items:[
  {id:"work",description:"ค่าใช้จ่ายดำเนินการ",amount:200000,selected:1},
  {id:"support",description:"ค่าสมทบแรงสูง (30 เควีเอ x 100)",amount:3000,selected:1}
 ]}]};
 const present=calculateEstimate(withContribution).customerTable.mainTable;
 assert.deepEqual(present,{hasContribution:true,operatingExpense:200000,contribution:3000,expenseBeforeVat:203000,vat:14210,total:217210});
 withContribution.sections[0].items[1].selected=0;
 const absent=calculateEstimate(withContribution).customerTable.mainTable;
 assert.deepEqual(absent,{hasContribution:false,operatingExpense:200000,contribution:0,expenseBeforeVat:200000,vat:14000,total:214000});
});
