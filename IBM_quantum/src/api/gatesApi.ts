// src/api/gatesApi.ts
import type { IGate } from '../types/types';
import {  
    getMockGateById, 
    getMockGates 
} from './mock';

// Состояние доступности бэкенда
let isBackendAvailable: boolean | null = null;

// Вспомогательные функции
const checkBackendAvailability = async (): Promise<boolean> => {
    if (isBackendAvailable !== null) return isBackendAvailable;
    
    try {
        const response = await fetch('/api/health', {
            method: 'HEAD',
            signal: AbortSignal.timeout(3000)
        });
        isBackendAvailable = response.ok;
        console.log(`Бэкенд ${isBackendAvailable ? 'доступен' : 'недоступен'}`);
    } catch (error) {
        console.warn('Бэкенд недоступен, используем моковые данные', error);
        isBackendAvailable = false;
    }
    
    return isBackendAvailable;
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

const handleApiError = (error: unknown, context: string): never => {
    console.error(`Ошибка в ${context}:`, error);
    throw error instanceof Error ? error : new Error(`Ошибка в ${context}`);
};

// Основные API функции
export const getGates = async (title?: string): Promise<IGate[]> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Используем моковые данные для getGates');
        return getMockGates(title);
    }
    
    try {
        const url = title
            ? `/api/gates?title=${encodeURIComponent(title)}`
            : '/api/gates';
        
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error('Ошибка загрузки гейтов');
        return await res.json();
    } catch (error) {
        console.warn('Ошибка при запросе гейтов, используем моки', error);
        isBackendAvailable = false;
        return getMockGates(title);
    }
};
/*
export const getDraftTaskInfo = async (): Promise<DraftTaskInfo> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Используем моковые данные для getDraftTaskInfo');
        return mockDraftTask;
    }
    
    try {
        const res = await fetchWithTimeout('/api/tasks/draft');
        if (!res.ok) throw new Error('Ошибка загрузки черновика');
        return await res.json();
    } catch (error) {
        console.warn('Ошибка при запросе черновика, используем моки', error);
        isBackendAvailable = false;
        return mockDraftTask;
    }
};
*/
export const getGateById = async (id: string): Promise<IGate> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Используем моковые данные для getGateById');
        const gate = getMockGateById(id);
        if (gate) return gate;
        throw new Error(`Гейт с ID "${id}" не найден в моках`);
    }
    
    try {
        const response = await fetchWithTimeout(`/api/gates/${id}`);
        if (!response.ok) throw new Error('Gate not found');
        return await response.json();
    } catch (error) {
        console.warn('Ошибка при запросе гейта по ID, используем моки', error);
        isBackendAvailable = false;
        
        const gate = getMockGateById(id);
        if (gate) return gate;
        throw new Error(`Гейт с ID "${id}" не найден`);
    }
};

// Дополнительные функции для управления режимом
export const forceMockMode = (): void => {
    isBackendAvailable = false;
    console.log('Принудительно включен режим моковых данных');
};

export const forceBackendMode = (): void => {
    isBackendAvailable = true;
    console.log('Принудительно включен режим бэкенда');
};

export const resetBackendCheck = (): void => {
    isBackendAvailable = null;
    console.log('Сброшена проверка доступности бэкенда');
};

export const isUsingMockData = (): boolean => {
    return isBackendAvailable === false;
};

export const getBackendStatus = (): 'checking' | 'available' | 'unavailable' => {
    if (isBackendAvailable === null) return 'checking';
    if (isBackendAvailable === true) return 'available';
    return 'unavailable';
};

// Дополнительные API функции которые могут понадобиться
/*
export const addGateToTask = async (gateId: string, taskId?: string): Promise<void> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Демо-режим: имитация добавления гейта в задачу');
        // В демо-режиме просто логируем действие
        return;
    }
    
    try {
        const taskToUse = taskId || (await getDraftTaskInfo()).TaskID;
        const response = await fetchWithTimeout(`/api/tasks/${taskToUse}/gates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gateId }),
        });
        
        if (!response.ok) throw new Error('Ошибка добавления гейта');
    } catch (error) {
        console.warn('Ошибка при добавлении гейта', error);
        // В демо-режиме не бросаем ошибку, просто логируем
        if (!isBackendAvailable) return;
        throw error;
    }
};

export const removeGateFromTask = async (gateId: string, taskId?: string): Promise<void> => {
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
        console.log('Демо-режим: имитация удаления гейта из задачи');
        return;
    }
    
    try {
        const taskToUse = taskId || (await getDraftTaskInfo()).TaskID;
        const response = await fetchWithTimeout(`/api/tasks/${taskToUse}/gates/${gateId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Ошибка удаления гейта');
    } catch (error) {
        console.warn('Ошибка при удалении гейта', error);
        if (!isBackendAvailable) return;
        throw error;
    }
};
*/