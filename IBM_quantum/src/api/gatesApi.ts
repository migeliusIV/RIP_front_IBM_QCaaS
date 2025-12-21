import type { IGate, DraftTaskInfo } from '../types';
import {
  getMockGateById,
  getMockGates,
  mockDraftTask,
} from './mock';

/**
 * Runtime-проверка Tauri.
 * НЕ на уровне модуля — важно для build.
 */
function isTauriRuntime(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

/**
 * Backend URL — ЯВНО.
 * Никаких env, чтобы исключить влияние сборки.
 */
const BACKEND_URL = 'http://192.168.1.66:8080';

/**
 * Принудительный флаг мок-режима.
 * 🔥 ПОКА TRUE — ты 100% видишь моки и их обновления.
 */
const FORCE_MOCKS = false;

/**
 * API endpoints вычисляются ВНУТРИ функций
 * → Vite не может ничего вырезать.
 */
function getApiBase(): string {
  if (FORCE_MOCKS) return '';
  if (isTauriRuntime()) return `${BACKEND_URL}/api`;
  return '/api';
}

function getHealthUrl(): string {
  if (FORCE_MOCKS) return '';
  if (isTauriRuntime()) return `${BACKEND_URL}/health`;
  return '/health';
}

// кеш доступности backend (используется ТОЛЬКО если FORCE_MOCKS = false)
let isBackendAvailable: boolean | null = null;

export async function checkBackendAvailability(): Promise<boolean> {
  if (FORCE_MOCKS) return false;

  if (isBackendAvailable !== null) return isBackendAvailable;

  try {
    const response = await fetch(getHealthUrl(), {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });

    isBackendAvailable = response.ok;
  } catch {
    isBackendAvailable = false;
  }

  return isBackendAvailable;
}

// ------------------- API -------------------

export async function getGates(title?: string): Promise<IGate[]> {
  if (FORCE_MOCKS) {
    return getMockGates(title);
  }

  const url = title
    ? `${getApiBase()}/gates?title=${encodeURIComponent(title)}`
    : `${getApiBase()}/gates`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return getMockGates(title);
  }
}

export async function getDraftTaskInfo(): Promise<DraftTaskInfo> {
  if (FORCE_MOCKS) {
    return mockDraftTask;
  }

  const url = `${getApiBase()}/quantum_task/current`;

  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return mockDraftTask;
  }
}

export async function getGateById(id: string): Promise<IGate> {
  if (FORCE_MOCKS) {
    const gate = getMockGateById(id);
    if (!gate) throw new Error(`Gate "${id}" not found`);
    return gate;
  }

  const url = `${getApiBase()}/gates/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    const gate = getMockGateById(id);
    if (!gate) throw new Error(`Gate "${id}" not found`);
    return gate;
  }
}
