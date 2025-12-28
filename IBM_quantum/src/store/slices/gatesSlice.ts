// src/store/slices/gatesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../../api';
import type { IGate, DraftTaskInfo } from '../../types';
import type { 
  InternalAppHandlerDTORespGate,
  InternalAppHandlerDTORespCurrTaskInfo 
} from '../../api/Api';

// --- Thunks ---
export const fetchGatesList = createAsyncThunk<IGate[], { title?: string }>(
  'gates/fetchList',
  async ({ title }, { rejectWithValue }) => {
    try {
      const res = await api.api.gatesList({ title });
      return res.data.map(g => ({
        ID_gate: g.ID_gate ?? 0,
        Title: g.Title ?? 'Без названия',
        Description: g.Description ?? '',
        Status: g.Status ?? false,
        Image: g.Image ?? null,
        I0j0: g.I0j0 ?? 0,
        I0j1: g.I0j1 ?? 0,
        I1j0: g.I1j0 ?? 0,
        I1j1: g.I1j1 ?? 0,
        Matrix_koeff: (g.Matrix_koeff ?? 1), // ✅ number, не string!
        FullInfo: g.Full_info ?? g.Description ?? '',
        TheAxis: g.TheAxis ?? 'non',
      }));
    } catch (err: any) {
      return rejectWithValue('Не удалось загрузить гейты');
    }
  }
);

export const fetchDraftTaskInfo = createAsyncThunk<DraftTaskInfo>(
  'gates/fetchDraftTaskInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.api.quantumTaskCurrentList();
      return {
        task_id: res.data.task_id ?? 0,
        services_count: res.data.services_count ?? 0,
      };
    } catch (err: any) {
      return rejectWithValue('Не удалось получить данные черновика');
    }
  }
);

export const addGateToDraft = createAsyncThunk<void, number>(
  'gates/addGateToDraft',
  async (gateId, { dispatch, rejectWithValue }) => {
    try {
      // 1. Оптимистично увеличиваем счётчик
      dispatch(incrementGatesCount());

      // 2. Делаем запрос
      await api.api.draftGatesCreate(gateId);

      // 3. Обновляем данные черновика (task_id может появиться)
      dispatch(fetchDraftTaskInfo());
    } catch (err: any) {
      // Откатываем при ошибке
      dispatch(decrementGatesCount());
      return rejectWithValue('Не удалось добавить гейт');
    }
  }
);

// --- State ---
interface GatesState {
  data: IGate[];
  loading: boolean;
  error: string | null;
  draftTask: DraftTaskInfo | null;
}

const initialState: GatesState = {
  data: [],
  loading: false,
  error: null,
  draftTask: null,
};

const gatesSlice = createSlice({
  name: "gates",
  initialState,
  reducers: {
    setGates: (state, action) => { state.data = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    setDraftTask: (state, action) => { state.draftTask = action.payload; },
    
    // ✅ Оптимистичное обновление
    incrementGatesCount: (state) => {
      if (state.draftTask) state.draftTask.services_count += 1;
    },
    decrementGatesCount: (state) => {
      if (state.draftTask && state.draftTask.services_count > 0) {
        state.draftTask.services_count -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGatesList.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGatesList.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchGatesList.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchDraftTaskInfo.fulfilled, (state, action) => { state.draftTask = action.payload; })
      .addCase(fetchDraftTaskInfo.rejected, (state, action) => { state.error = action.payload as string; })

      // После успешного добавления — не трогаем draftTask (уже обновили)
      .addCase(addGateToDraft.fulfilled, (state) => {})
      .addCase(addGateToDraft.rejected, (state) => {});
  },
});

export const {
  setGates,
  setLoading,
  setError,
  setDraftTask,
  incrementGatesCount,
  decrementGatesCount,
} = gatesSlice.actions;

export default gatesSlice.reducer;