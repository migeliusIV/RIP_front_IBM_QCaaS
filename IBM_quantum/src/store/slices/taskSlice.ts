// src/store/slices/taskSlice.ts
import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api'; // ← убедитесь, что apiClient существует и экспортирует `api`
import type {
  InternalAppHandlerDTORespTasks,
  InternalAppHandlerDTOReqTaskUpd,
  InternalAppHandlerDTOReqDegreesUpd,
  InternalAppHandlerDTORespUpdateDegrees,
  InternalAppHandlerDTORespTaskServiceLink,
  InternalAppHandlerDTORespCurrTaskInfo,
} from '../../api/Api';

// --- State ---
interface TaskState {
  list: InternalAppHandlerDTORespTasks[];
  currentTask: InternalAppHandlerDTORespTasks | null;
  loading: boolean;
  error: string | null;
  operationSuccess: boolean;
  currentDraftInfo: InternalAppHandlerDTORespCurrTaskInfo | null;
  addingGate: number | null; // id_gate, который сейчас добавляется
}

const initialState: TaskState = {
  list: [],
  currentTask: null,
  loading: false,
  error: null,
  operationSuccess: false,
  currentDraftInfo: null,
  addingGate: null,
};

// --- Thunks ---
export const setAddingGate = createAction<number | null>('task/setAddingGate');

// 1. Получить одну задачу по ID
export const fetchTaskById = createAsyncThunk(
  'task/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.api.quantumTasksDetail(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось загрузить задачу');
    }
  }
);

// 2. Обновить описание задачи
export const updateTaskDescription = createAsyncThunk(
  'task/updateDescription',
  async ({ id, description }: { id: number; description: string }, { rejectWithValue }) => {
    try {
      const req: InternalAppHandlerDTOReqTaskUpd = { task_description: description };
      const res = await api.api.quantumTasksUpdate(id, req);
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось сохранить описание');
    }
  }
);

// 3. Обновить угол гейта в задаче
export const updateGateAngle = createAsyncThunk(
  'task/updateGateAngle',
  async (
    { taskId, serviceId, degrees }: { taskId: number; serviceId: number; degrees: number },
    { rejectWithValue }
  ) => {
    try {
      const req: InternalAppHandlerDTOReqDegreesUpd = { degrees };
      const res: { data: InternalAppHandlerDTORespUpdateDegrees } =
        await api.api.tasksServicesUpdate(taskId, serviceId, req);
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось обновить угол');
    }
  }
);

// 4. Удалить гейт из задачи
export const removeGateFromTask = createAsyncThunk(
  'task/removeGate',
  async ({ taskId, serviceId }: { taskId: number; serviceId: number }, { rejectWithValue }) => {
    try {
      const res: { data: InternalAppHandlerDTORespTaskServiceLink } =
        await api.api.tasksServicesDelete(taskId, serviceId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось удалить гейт');
    }
  }
);

// 5. Удалить задачу
export const deleteTask = createAsyncThunk(
  'task/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.api.quantumTasksDelete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue('Не удалось удалить задачу');
    }
  }
);

// 6. Завершить заявку (отправить на модерацию)
export const resolveTask = createAsyncThunk(
  'task/resolve',
  async ({ id, action }: { id: number; action: 'complete' | 'reject' }, { rejectWithValue }) => {
    try {
      const req = { action };
      const res = await api.api.quantumTasksResolveUpdate(id, req);
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось завершить заявку');
    }
  }
);

// 7. Получить информацию о текущем черновике (ID + количество)
export const fetchCurrentDraftInfo = createAsyncThunk(
  'task/fetchCurrentDraftInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.api.quantumTaskCurrentList();
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось получить данные черновика');
    }
  }
);

// 8. Получить **полную** текущую черновую задачу (через 2 запроса)
export const fetchCurrentDraftTask = createAsyncThunk(
  'task/fetchCurrentDraftTask',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const info = await dispatch(fetchCurrentDraftInfo()).unwrap();
      if (!info.task_id) {
        return null; // нет черновика
      }
      const task = await dispatch(fetchTaskById(info.task_id)).unwrap();
      return task;
    } catch (err: any) {
      return rejectWithValue('Не удалось загрузить черновик');
    }
  }
);

export const addGateToDraft = createAsyncThunk(
  'task/addGateToDraft',
  async (gateId: number, { dispatch, rejectWithValue }) => {
    try {
      // 1. Обновляем стейт: идёт добавление
      dispatch({ type: 'task/setAddingGate', payload: gateId });

      // 2. Делаем запрос
      const res = await api.api.draftGatesCreate(gateId); // ← убедитесь, что в secureApi есть draftGatesCreate(id, { secure: true })
      
      // 3. После успеха — обновляем черновик (например, перезапросом info или optimistic update)
      dispatch(fetchCurrentDraftInfo()); // ← или fetchCurrentDraftTask()

      return res.data;
    } catch (err: any) {
      return rejectWithValue('Не удалось добавить гейт');
    } finally {
      dispatch({ type: 'task/setAddingGate', payload: null });
    }
  }
);

export const fetchTasksList = createAsyncThunk(
  'task/fetchList',
  async (filters: { status?: string; from?: string; to?: string }, { rejectWithValue }) => {
    try {
      const queryArgs: Record<string, string> = {};
      if (filters.status && filters.status !== 'all') queryArgs.status = filters.status;
      if (filters.from) queryArgs.from = filters.from;
      if (filters.to) queryArgs.to = filters.to;

      const res = await api.api.quantumTasksList(queryArgs); // ← secureApi с secure: true
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Ошибка загрузки списка');
    }
  }
);

export const formedTask = createAsyncThunk(
  'task/form',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.api.quantumTasksFormUpdate(id);
      return id;
    } catch (err: any) {
      return rejectWithValue('Не удалось сформировать задачу');
    }
  }
);
// --- Slice ---
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    resetOperationSuccess: (state) => {
      state.operationSuccess = false;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    
    setCurrentTaskField: (
    state,
    action: PayloadAction<{ field: 'task_description' | 'id_task' | 'task_status'; value: any }>
    ) => {
    if (state.currentTask) {
        const { field, value } = action.payload;
        switch (field) {
        case 'task_description':
            state.currentTask.task_description = value as string;
            break;
        // Добавьте другие поля, если нужно (например, в будущем — `res_koeff_0`)
        default:
            // Опционально: логирование или игнор
            break;
    }
  }
},
  },

  extraReducers: (builder) => {
    // fetchTaskById
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateTaskDescription — оптимистичное обновление
      .addCase(updateTaskDescription.fulfilled, (state, action) => {
        if (state.currentTask) {
          state.currentTask.task_description = action.payload.task_description;
        }
      })

      // updateGateAngle — оптимистичное обновление
      .addCase(updateGateAngle.fulfilled, (state, action) => {
        if (state.currentTask?.gates_degrees) {
          const gd = state.currentTask.gates_degrees.find(
            (g) => g.id_gate === action.payload.service_id
          );
          if (gd) gd.degrees = action.payload.degrees;
        }
      })

      // removeGateFromTask
      .addCase(removeGateFromTask.fulfilled, (state, action) => {
        if (state.currentTask?.gates_degrees) {
          state.currentTask.gates_degrees = state.currentTask.gates_degrees.filter(
            (g) => g.id_gate !== action.payload.service_id
          );
        }
      })

      // deleteTask
      .addCase(deleteTask.fulfilled, (state) => {
        state.operationSuccess = true;
        state.currentTask = null;
      })

      // resolveTask
      .addCase(resolveTask.fulfilled, (state, action) => {
        state.operationSuccess = true;
        if (state.currentTask) {
          state.currentTask = action.payload; // или просто обновить статус
        }
      })

    .addCase(fetchTasksList.fulfilled, (state, action) => {
        state.list = action.payload; // ← без этого list остаётся []
    })
    
      // fetchCurrentDraftTask
      .addCase(fetchCurrentDraftTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentDraftTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchCurrentDraftTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(setAddingGate, (state, action) => {
        state.addingGate = action.payload;
      })
  },
});

export const { resetOperationSuccess, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;