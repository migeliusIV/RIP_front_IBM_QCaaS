export interface IGate {
  ID_gate: number;
  Title: string;
  Description: string;
  Status: boolean;
  Image: string | null;
  I0j0: 		number;
	I0j1:		number;
	I1j0: 		number;
	I1j1: 		number;
	Matrix_koeff: string;
  FullInfo: string;
  TheAxis: string;
}

export interface DraftTaskInfo {
  TaskID: number;
  GatesCount: number;
}

export interface Breadcrumb {
    label: string;
    path?: string;
    active?: boolean;
}

export interface DraftTaskInfo {
    TaskID: number;
    GatesCount: number;
}