import type { IGate } from '../types/types';

// Mock-данные (для разработки без бэкенда)
export const MOCK_GATES: IGate[] = [
  {
    ID_gate: 1,
    Title: "Identity Gate",
    Description: "Не изменяет состояния кубита.",
    Status: true, 
    Image: "http://127.0.0.1:9000/ibm-pictures/img/imageError.gif",
    I0j0: 0,
	  I0j1:	0,
	  I1j0: 0,
	  I1j1: 0,
	  Matrix_koeff: "non",
    FullInfo: "Ничего не делает с состоянием кубита. Оставляет его без изменений.",
    TheAxis: "non"
  },
  {
    ID_gate: 2,
    Title: "Pauli-X Gate (NOT gate)",
    Description: "Инвертирует состояние кубита.",
    FullInfo: "Аналог классического NOT-гейта. Переворачивает состояние кубита.",
    Image:  "http://127.0.0.1:9000/ibm-pictures/img/imageError.gif",
    TheAxis: "non",
    Status: true, 
    I0j0: 0,
	  I0j1:	0,
	  I1j0: 0,
	  I1j1: 0,
	  Matrix_koeff: "non",
  },
  {
    ID_gate: 3,
    Title: "X-axis Rotation Gate",
    Description: "Вращает кубит вокруг оси X на угол тэта.",
    FullInfo: "Эта операция вращает состояние кубита на сфере Блоха вокруг оси X. Значение угла поворота можно задать при компановке выражения (в деталях калькуляции).",
    Image: "http://127.0.0.1:9000/ibm-pictures/img/imageError.gif",
    TheAxis: "X",
    Status: true, 
    I0j0: 0,
	  I0j1:	0,
	  I1j0: 0,
	  I1j1: 0,
	  Matrix_koeff: "non",
  }
];

export const getMockGateById = (id: string): IGate | null => {
    return MOCK_GATES.find(gate => gate.ID_gate === Number(id)) || null;
};

export const getMockGates = (title?: string): IGate[] => {
    if (!title) return MOCK_GATES;
    return MOCK_GATES.filter(gate => 
        gate.Title.toLowerCase().includes(title.toLowerCase())
    );
};