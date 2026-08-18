import assert from "node:assert/strict";
import test from "node:test";
import { calculateWorkTemplate, workTemplates } from "./workTemplates.js";

test("loads one transformer template set and Turnkey",()=>{
 assert.equal(workTemplates.length,5);
 assert.deepEqual(workTemplates.map(template=>template.sheetName),["T30-160","T250-315","T400","T>500","Turnkey"]);
});

test("calculates material labor operation and grand total",()=>{
 const result=calculateWorkTemplate([{id:"1",description:"sample",quantity:2,unitPrice:100,labor:50}]);
 assert.deepEqual(result,{rows:[{id:"1",description:"sample",quantity:2,unitPrice:100,labor:50,total:200}],material:200,labor:50,subtotal:250,operation:18.75,grandTotal:268.75});
});
