export type WorkTemplateItem={id:string;description:string;quantity:number;unitPrice:number;labor:number};
export type WorkTemplate={id:string;sheetName:string;group:string;title:string;note:string;quote:string;custom:boolean;items:WorkTemplateItem[]};
const common=(size:string,cable:string,price:number,lugPrice:number,mouldPrice:number):WorkTemplateItem[]=>[
 {id:"ground",description:"กราวด์ร็อดหุ้มทองแดง 5/8 x 2.4 ม. 1010220002",quantity:1,unitPrice:size===">500"?480:380,labor:510},
 {id:"wire",description:`สายทองแดงหุ้มฉนวน (THW) ขนาด ${cable} ตร.มม.`,quantity:20,unitPrice:price,labor:0},
 {id:"lug",description:`หางปลาสำหรับเข้าปลายสายทองแดง ขนาด ${cable} ตร.มม.`,quantity:1,unitPrice:lugPrice,labor:0},
 {id:"pvc",description:'ท่อเหลือง PVC ขนาด 3/4" 1080040001',quantity:3,unitPrice:size==="400"||size===">500"?55:60,labor:0},
 {id:"elbow",description:'ข้อโค้งท่อเหลือง ขนาด 3/4"',quantity:1,unitPrice:size==="30-160"?10:size==="250-315"?7:size==="400"?7:15,labor:0},
 ...(size==="400"||size===">500"?[{id:"connector",description:'ข้อต่อตรงท่อเหลือง ขนาด 3/4"',quantity:1,unitPrice:size==="400"?5:7,labor:0}]:[]),
 {id:"mould",description:`One Time Mould ชนิด 1 ทาง สำหรับสาย ขนาด ${size==="30-160"?"35":size==="250-315"?"50":"70-120"} ตร.มม. 9090011007`,quantity:1,unitPrice:mouldPrice,labor:90}
];
const make=(id:string,sheetName:string,group:string,size:string,cable:string,price:number,lug:number,mould:number,quote:string,extra:WorkTemplateItem[]=[]):WorkTemplate=>({id,sheetName,group,title:`หม้อแปลง ${size} kVA (สายทองแดง ${cable} ตร.มม.)`,note:"สืบราคาจาก ห้างหุ้นส่วนจำกัด ศูนย์รวมไฟฟ้า 336/1 ถ.ศรีภูวนารถ อ.หาดใหญ่ จ.สงขลา 90110",quote,custom:false,items:[...common(size,cable,price,lug,mould),...extra]});
export const workTemplates:WorkTemplate[]=[
 make("a-30","T30-160","ชุด A","30-160","35",190,150,190,"QT-000004578"),
 make("a-250","T250-315","ชุด A","250-315","50",250,150,190,"QT-000004579",[{id:"cv185",description:"สายทองแดงหุ้มฉนวน (CV) ขนาด 185 ตร.มม.",quantity:55,unitPrice:1005,labor:0},{id:"lug185",description:"หางปลาสำหรับเข้าปลายสายทองแดง 2 รู ขนาด 185 ตร.มม.",quantity:7,unitPrice:275,labor:0}]),
 make("a-400","T400","ชุด A","400","70",320,45,210,"QT-000004580"),
 make("a-500","T>500","ชุด A",">500","95",365,395,250,""),
 make("b-30","T 30-160","ชุด B","30-160","35",190,150,190,"QT-000004578"),
 make("b-250","T 250-315","ชุด B","250-315","50",225,25,180,"QT-000004579"),
 make("b-400","T 400","ชุด B","400","70",320,45,210,"QT-000004580"),
 make("b-500","T >500","ชุด B",">500","95",365,395,250,""),
 {id:"turnkey",sheetName:"Turnkey",group:"กำหนดเอง",title:"จ้างเหมาเบ็ดเสร็จ Turnkey",note:"",quote:"",custom:true,items:[{id:"turnkey-1",description:"งานจ้างเหมาระบบจำหน่ายไฟฟ้าแรงต่ำจากหม้อแปลงไปยังตู้ MDB ภายในอาคาร",quantity:1,unitPrice:437350,labor:0}]}
];
export function calculateWorkTemplate(items:WorkTemplateItem[]){const rows=items.map(item=>({...item,total:Math.round(item.quantity*item.unitPrice*100)/100}));const material=Math.round(rows.reduce((sum,row)=>sum+row.total,0)*100)/100;const labor=Math.round(rows.reduce((sum,row)=>sum+row.labor,0)*100)/100;const subtotal=material+labor;const operation=Math.round(subtotal*.075*100)/100;return {rows,material,labor,subtotal,operation,grandTotal:Math.round((subtotal+operation)*100)/100};}
