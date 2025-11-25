// src/api/gatesApi.ts
import type { IGate, DraftTaskInfo } from '../types';
import {  
    getMockGateById, 
    getMockGates,
    mockDraftTask, 
} from './mock';

const isTauri = import.meta.env.VITE_TARGET === 'tauri';
const BACKEND_IP = 'http://10.241.187.182:8080/'; 
const API_BASE_URL = isTauri ? `${BACKEND_IP}/api` : '/api';

// Состояние доступности бэкенда
let isBackendAvailable: boolean | null = null;

// Вспомогательные функции
export const checkBackendAvailability = async (): Promise<boolean> => {
    if (isBackendAvailable !== null) return isBackendAvailable;
    
    try {
        // Используем GET вместо HEAD (более надёжно)
        const response = await fetch('/health', {
            method: 'GET',
            // Убираем таймаут из fetch, используем общий
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

// Получение списка гейтов с опциональной фильтрацией по названию
export const getGates = async (title?: string): Promise<IGate[]> => {
    const url = title
        ? `${API_BASE_URL}/gates?title=${encodeURIComponent(title)}`
        : `${API_BASE_URL}/gates`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        return await response.json();
    } catch (error) {
        console.warn('Failed to fetch from backend, using mock data.', error);
        return getMockGates(title);
    }
};

// Получение информации о черновике задачи
export const getDraftTaskInfo = async (): Promise<DraftTaskInfo> => {
    const url = `${API_BASE_URL}/quantum_task/current`;

    try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
            throw new Error('No auth token found');
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch draft task');
        }
        return await response.json();
    } catch (error) {
        console.warn('Failed to fetch draft task, using mock data.', error);
        return mockDraftTask;
    }
};

// Получение одного гейта по ID
export const getGateById = async (id: string): Promise<IGate> => {
    const url = `${API_BASE_URL}/gates/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        return await response.json();
    } catch (error) {
        console.warn(`Failed to fetch gate ${id}, using mock data.`, error);
        const gate = getMockGateById(id);
        if (!gate) {
            throw new Error(`Gate with ID "${id}" not found in mocks`);
        }
        return gate;
    }
};
