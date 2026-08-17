export type SelectionMode = 0 | 1 | 2 | 3;
export type SectionKind = "no-charge" | "charge" | "deduction" | "mt" | "mt7";

export interface EstimateItem {
  id: string;
  description: string;
  amount: number;
  selected: SelectionMode;
  grossProfitRate?: number;
}

export interface EstimateSection {
  id: string;
  title: string;
  kind: SectionKind;
  items: EstimateItem[];
}

export interface ProjectInfo {
  jobName: string; address: string; subdistrict: string; district: string; province: string;
  postalCode: string; drawingNo: string; wbs: string; requestNo: string; requestDate: string;
  surveyor: string; estimator: string; reviewer: string;
}

export interface EstimateInput { project: ProjectInfo; sections: EstimateSection[]; vatRate?: number; }
