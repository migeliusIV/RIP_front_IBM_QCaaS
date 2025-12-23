export interface IGate {
  ID_gate: number;
  Title: string;
  Description: string;
  Status?: boolean;
  Image: string | null;
  I0j0?: number;
	I0j1?: number;
	I1j0?: number;
	I1j1?: number;
	Matrix_koeff?: number;
  FullInfo: string;
  TheAxis: string;
}

export interface DraftTaskInfo {
  task_id: number;
  services_count: number;
}

export interface Breadcrumb {
    label: string;
    path?: string;
    active?: boolean;
}

export interface FilterState {
    searchTerm: string;
}

// export interface DTO_Resp_Tasks {
//     /** ID задачи */
//     id_task: number;
    
//     /** Статус задачи */
//     task_status: 'draft' | 'formed' | 'completed' | 'rejected';
    
//     /** Дата создания */
//     creation_date: string; // ISO строка даты-времени
    
//     /** ID пользователя */
//     id_user: number;
    
//     /** Дата завершения */
//     conclusion_date: string; // ISO строка даты-времени
    
//     /** Описание задачи */
//     task_description: string;
    
//     /** Коэффициент для |0⟩ */
//     res_koeff_0: number;
    
//     /** Коэффициент для |1⟩ */
//     res_koeff_1: number;
//     /** Гейты с углами */
//     gates_degrees: IGate[];
// }