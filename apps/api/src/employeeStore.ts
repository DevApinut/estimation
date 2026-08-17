import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { employees as initialEmployees } from "./seed.js";

export type Employee={id:string;position:string;prefix:string;firstName:string;lastName:string;phone:string;fullName:string};
const dataDir=path.resolve(process.cwd(),"data");
const dataFile=path.join(dataDir,"employees.json");
async function ensureStore(){try{await readFile(dataFile,"utf8");}catch{await mkdir(dataDir,{recursive:true});await writeFile(dataFile,JSON.stringify(initialEmployees,null,2),"utf8");}}
export async function listEmployees():Promise<Employee[]>{await ensureStore();return JSON.parse(await readFile(dataFile,"utf8"));}
export async function addEmployee(input:Omit<Employee,"fullName">){const employees=await listEmployees();if(employees.some(e=>e.id===input.id))throw new Error("DUPLICATE_ID");const employee={...input,fullName:`${input.prefix}${input.firstName} ${input.lastName}`};employees.push(employee);await writeFile(dataFile,JSON.stringify(employees,null,2),"utf8");return employee;}
export async function updateEmployee(id:string,input:Omit<Employee,"fullName"|"id">){const employees=await listEmployees();const index=employees.findIndex(e=>e.id===id);if(index<0)return null;employees[index]={id,...input,fullName:`${input.prefix}${input.firstName} ${input.lastName}`};await writeFile(dataFile,JSON.stringify(employees,null,2),"utf8");return employees[index];}
export async function removeEmployee(id:string){const employees=await listEmployees();const updated=employees.filter(e=>e.id!==id);if(updated.length===employees.length)return false;await writeFile(dataFile,JSON.stringify(updated,null,2),"utf8");return true;}
