import type { Metadata } from "next";
import "./globals.css";
import "./profit.css";
import "./summary.css";
import "./hotline.css";
import "./hotline-overrides.css";
import "./estimate.css";
import "./work-template.css";
import "./price-manager.css";

export const metadata: Metadata = { title:"ระบบประมาณการค่าใช้จ่าย", description:"แปลงจาก ออกเอกสาร.xlsm" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="th"><body>{children}</body></html>; }
