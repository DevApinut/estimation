import type { EstimateInput } from "./types.js";

export const employees = [
  { id:"498712", position:"หผ.", prefix:"นาย", firstName:"สรายุทธ", lastName:"จุลจินดา", phone:"08-8835-8708" },
  { id:"505947", position:"ชผ.", prefix:"นาย", firstName:"ณรงค์กร", lastName:"ตปนียะพงศ์", phone:"08-5336-7904" },
  { id:"508497", position:"นบช.6", prefix:"นางสาว", firstName:"เมธาวี", lastName:"มิลำเอียง", phone:"08-2827-6575" },
  { id:"512977", position:"วศก.5", prefix:"นาย", firstName:"อภินัทธ์", lastName:"แก้วมูณี", phone:"08-1963-5567" },
  { id:"506604", position:"พชง.5", prefix:"นาย", firstName:"ยุทธนา", lastName:"สาแหละ", phone:"08-6746-0400" },
  { id:"507816", position:"พชง.5", prefix:"นาย", firstName:"ภูชิต", lastName:"คทาวุธพูนพันธ์", phone:"08-1959-4868" },
  { id:"507824", position:"พชง.5", prefix:"นาย", firstName:"วุฒิพนธ์", lastName:"เหมือนพะวงศ์", phone:"08-7633-4531" },
  { id:"501396", position:"พชง.7", prefix:"นาย", firstName:"ธีรพงศ์", lastName:"นาพนัง", phone:"08-0539-9111" },
  { id:"514816", position:"พชง.3", prefix:"นาย", firstName:"วีระชัย", lastName:"ศิริมงคล", phone:"09-1719-6956" },
  { id:"511010", position:"พชง.4", prefix:"นาย", firstName:"อรุณสวัสดิ์", lastName:"ส้องสง", phone:"09-3774-8227" }
].map(employee=>({...employee,fullName:`${employee.prefix}${employee.firstName} ${employee.lastName}`}));

export const seedEstimate: EstimateInput = {
  project: {
    jobName: "แขวงทางหลวงสงขลาที่ 1 หน้าศูนย์กระจายสินค้า (จุดที่ 2)",
    address: "หน้าศูนย์กระจายสินค้า (จุดที่ 2)", subdistrict: "ท่าช้าง", district: "บางกล่ำ",
    province: "สงขลา", postalCode: "90110", drawingNo: "TF09-0A3/690796", wbs: "C-69-L-HAYSR.0382",
    requestNo: "LHAY69002507", requestDate: "2026-07-14", surveyor: "นายอภินัทธ์ แก้วมูณี",
    estimator: "นายอภินัทธ์ แก้วมูณี", reviewer: "นายธีรพงศ์ นาพนัง"
  },
  vatRate: 0.07,
  sections: [
    { id: "pea", title: "ค่าใช้จ่ายที่ กฟภ.ลงทุน", kind: "no-charge", items: [
      { id: "pea-1", description: "แผนกแรงสูงภายนอก", amount: 24022.30, selected: 0 },
      { id: "pea-2", description: "แผนกรื้อถอนแรงสูงภายนอก", amount: 1199, selected: 0 },
      { id: "pea-3", description: "แผนกมิเตอร์", amount: 1413, selected: 1 },
      { id: "pea-4", description: "แผนกรื้อถอนมิเตอร์", amount: 296, selected: 0 }
    ]},
    { id: "customer", title: "ค่าใช้จ่ายที่คิดจากผู้ใช้ไฟ", kind: "charge", items: [
      { id: "cus-1", description: "แผนกหม้อแปลงภายใน", amount: 150467.83, selected: 1, grossProfitRate: 0.20 },
      { id: "cus-2", description: "แผนกรื้อถอนหม้อแปลงภายใน", amount: 8895, selected: 0, grossProfitRate: 0.20 },
      { id: "cus-3", description: "แผนกรื้อถอนแรงสูงภายใน", amount: 2669, selected: 0, grossProfitRate: 0.50 },
      { id: "cus-4", description: "แผนกแรงสูงภายใน", amount: 38816.67, selected: 0, grossProfitRate: 0.30 },
      { id: "cus-5", description: "อุปกรณ์จับยึดหม้อแปลงป้องกันการโจรกรรม (Nut lock)", amount: 3000, selected: 1, grossProfitRate: 0.20 },
      { id: "cus-6", description: "งานติดตั้งชุดกราวด์ทองแดงและ wiring 185 sq.mm.", amount: 68488.25, selected: 0, grossProfitRate: 0.25 }
    ]},
    { id: "fee", title: "ค่าธรรมเนียม", kind: "charge", items: [
      { id: "fee-1", description: "ค่าสมทบแรงสูง (30 เควีเอ x 100)", amount: 3000, selected: 1 },
      { id: "fee-2", description: "ค่าตรวจสอบแรงสูงภายในระยะทางไม่เกิน 1 กม.", amount: 2000, selected: 0 },
      { id: "fee-3", description: "ค่าตรวจสอบหม้อแปลงขนาดไม่เกิน 1,500 เควีเอ", amount: 3000, selected: 0 },
      { id: "fee-4", description: "ค่าเชื่อมแรงสูง", amount: 14000, selected: 1 },
      { id: "fee-5", description: "ค่าปลดสับแรงสูง", amount: 570, selected: 0 },
      { id: "fee-hotline", description: "ค่าบริการด้านฮอตไลน์", amount: 46966.11, selected: 0 },
      { id: "fee-6", description: "กำไรขั้นต้น", amount: 31835.22, selected: 1 }
    ]},
    { id: "deduct", title: "หักค่าใช้จ่าย", kind: "deduction", items: [
      { id: "ded-1", description: "ลูกค้าชำระค่าตรวจสอบแบบและแผนผังตามบิล", amount: 5350, selected: 0 }
    ]},
    { id: "mt7", title: "ค่าธรรมเนียมการขอใช้ไฟ (มท.7)", kind: "mt7", items: [
      { id: "mt7-1", description: "ค่าตรวจสอบอุปกรณ์ไฟฟ้าภายใน (กรณีซีทีเกิน 30/5)", amount: 15000, selected: 0 },
      { id: "mt7-2", description: "ค่าธรรมเนียมย้ายเครื่องวัดมิเตอร์แรงต่ำ", amount: 500, selected: 0 }
    ]},
    { id: "mt", title: "ค่าประกันการใช้ไฟ (มท.)", kind: "mt", items: [
      { id: "mt-1", description: "ค่าประกันการใช้ไฟ (400 เควีเอ x 400)", amount: 160000, selected: 0 }
    ]}
  ]
};
