export interface IGate {
  ID_gate: number;
  Title: string;
  Description: string;
  FullInfo: string;
  Image: string | null;
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