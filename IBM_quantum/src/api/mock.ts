import type { IGate } from '../types/types';

// Mock-данные (для разработки без бэкенда)
export const MOCK_GATES: IGate[] = [
  {
    ID_gate: 1,
    Title: "Identity Gate",
    Description: "Не изменяет состояния кубита.",
    FullInfo: "Проверка",
    Image: "../../public/imageError.gif",
    TheAxis: "non"
  },
  {
    ID_gate: 2,
    Title: "Pauli-X Gate (NOT gate)",
    Description: "Инвертирует состояние кубита.",
    FullInfo: "Проверка",
    Image:  "../../public/imageError.gif",
    TheAxis: "non"
  },
  {
    ID_gate: 3,
    Title: "X-axis Rotation Gate",
    Description: "Вращает кубит вокруг оси X на угол тэта.",
    FullInfo: "Проверка",
    Image: "../../public/imageError.gif",
    TheAxis: "X"
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