import assert from "node:assert/strict";
import test from "node:test";
import { calculateHotline, type HotlineInput } from "./hotline.js";

const sample:HotlineInput={regularDays:1,regularRate:21500,holidayDays:0,holidayRate:18000,hotstickDays:0,hotstickRate:2600,bucket2233Days:1,bucket2233Rate:7000,bucket115Days:0,bucket115Rate:10000,waterTruckDays:0,waterTruckRate:2000,allowanceDays:1,allowanceRate:2000,lodgingDays:0,lodgingRate:4500,hotstickKm:0,hotstickFuelPrice:0,bucketKm:24,bucketFuelPrice:40.8,bucketWaterKm:0,bucketWaterFuelPrice:0,waterTruckKm:0,waterTruckFuelPrice:0};
test("matches Hotline F30 sample",()=>assert.equal(calculateHotline(sample).total,46966.11));
test("items in every row contribute to sections 3, 4 and 7",()=>{const changed={...sample,holidayDays:1,hotstickDays:1,lodgingDays:1,hotstickKm:10,hotstickFuelPrice:40};const result=calculateHotline(changed);assert.equal(result.rows.miscellaneous,2455);assert.equal(result.rows.operation,3866.63);assert.ok(result.rows.grossProfit>10838.33);});
