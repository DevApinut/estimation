import cors from "cors";
import express from "express";
import { z } from "zod";
import { calculateEstimate } from "./calculation.js";
import { seedEstimate } from "./seed.js";
import { calculateHotline } from "./hotline.js";
import { addEmployee, listEmployees, removeEmployee, updateEmployee } from "./employeeStore.js";
import { calculateWorkTemplate, workTemplates } from "./workTemplates.js";

const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));

const item = z.object({ id:z.string(), description:z.string(), amount:z.number(), selected:z.union([z.literal(0),z.literal(1),z.literal(2),z.literal(3)]), grossProfitRate:z.number().optional() });
const project = z.object({
  jobName:z.string(), address:z.string(), subdistrict:z.string(), district:z.string(), province:z.string(),
  postalCode:z.string(), drawingNo:z.string(), wbs:z.string(), requestNo:z.string(), requestDate:z.string(),
  surveyor:z.string(), estimator:z.string(), reviewer:z.string()
});
const schema = z.object({ project, vatRate:z.number().min(0).max(1).optional(), sections:z.array(z.object({ id:z.string(), title:z.string(), kind:z.enum(["no-charge","charge","deduction","mt","mt7"]), items:z.array(item) })) });
const hotlineSchema=z.object({regularDays:z.number(),regularRate:z.number(),holidayDays:z.number(),holidayRate:z.number(),hotstickDays:z.number(),hotstickRate:z.number(),bucket2233Days:z.number(),bucket2233Rate:z.number(),bucket115Days:z.number(),bucket115Rate:z.number(),waterTruckDays:z.number(),waterTruckRate:z.number(),allowanceDays:z.number(),allowanceRate:z.number(),lodgingDays:z.number(),lodgingRate:z.number(),hotstickKm:z.number(),hotstickFuelPrice:z.number(),bucketKm:z.number(),bucketFuelPrice:z.number(),bucketWaterKm:z.number(),bucketWaterFuelPrice:z.number(),waterTruckKm:z.number(),waterTruckFuelPrice:z.number()});

app.get("/health", (_req, res) => res.json({ ok:true, service:"estimate-api" }));
app.get("/api/estimate/template", (_req, res) => res.json(seedEstimate));
app.get("/api/work-templates",(_req,res)=>res.json(workTemplates));
app.post("/api/work-templates/calculate",(req,res)=>{const parsed=z.array(z.object({id:z.string(),description:z.string(),quantity:z.number(),unitPrice:z.number(),labor:z.number()})).safeParse(req.body);if(!parsed.success)return res.status(400).json({message:"ข้อมูลรายการไม่ถูกต้อง"});return res.json(calculateWorkTemplate(parsed.data));});
const employeeSchema=z.object({id:z.string().trim().min(1),position:z.string().trim(),prefix:z.string().trim().min(1),firstName:z.string().trim().min(1),lastName:z.string().trim().min(1),phone:z.string().trim()});
const employeeUpdateSchema=employeeSchema.omit({id:true});
app.get("/api/employees", async(_req, res) => res.json(await listEmployees()));
app.post("/api/employees",async(req,res)=>{const parsed=employeeSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({message:"ข้อมูลพนักงานไม่ครบ"});try{return res.status(201).json(await addEmployee(parsed.data));}catch{return res.status(409).json({message:"เลขประจำตัวนี้มีอยู่แล้ว"});}});
app.put("/api/employees/:id",async(req,res)=>{const parsed=employeeUpdateSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({message:"ข้อมูลพนักงานไม่ครบ"});const employee=await updateEmployee(req.params.id,parsed.data);return employee?res.json(employee):res.status(404).json({message:"ไม่พบรายชื่อ"});});
app.delete("/api/employees/:id",async(req,res)=>{const removed=await removeEmployee(req.params.id);return removed?res.status(204).end():res.status(404).json({message:"ไม่พบรายชื่อ"});});
app.post("/api/estimate/calculate", (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message:"ข้อมูลประมาณการไม่ถูกต้อง", issues:parsed.error.issues });
  return res.json(calculateEstimate(parsed.data));
});
app.post("/api/hotline/calculate",(req,res)=>{const parsed=hotlineSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({message:"ข้อมูล Hotline ไม่ถูกต้อง",issues:parsed.error.issues});return res.json(calculateHotline(parsed.data));});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`Estimate API ready at http://localhost:${port}`));
