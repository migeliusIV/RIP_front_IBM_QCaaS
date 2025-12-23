// src/store/slices/gatesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../../api';
import type { IGate, DraftTaskInfo } from '../../types';


// --- Thunk: загрузка списка гейтов ---
export const fetchGatesList = createAsyncThunk<
  IGate[],
  { title?: string }
>(
  'gates/fetchList',
  async ({ title }, { rejectWithValue }) => {
    try {
      const res = await api.api.gatesList({ title });
      // Маппинг из API-модели в IGate
      return res.data.map(g => ({
        ID_gate: g.id_gate ?? 0,
        Title: g.title ?? 'Без названия',
        Description: g.description ?? '',
        Status: g.status ?? false,
        Image: g.image ?? null,
        I0j0: g.i0j0 ?? 0,
        I0j1: g.i0j1 ?? 0,
        I1j0: g.i1j0 ?? 0,
        I1j1: g.i1j1 ?? 0,
        Matrix_koeff: (g.matrix_koeff ?? 1),
        FullInfo: g.full_info ?? g.description ?? '',
        TheAxis: g.the_axis ?? 'non',
      }));
    } catch (err: any) {
      return rejectWithValue('Не удалось загрузить гейты');
    }
  }
);

// --- Thunk: загрузка информации о черновике ---
export const fetchDraftTaskInfo = createAsyncThunk<
  DraftTaskInfo,
  void
>(
  'gates/fetchDraftTaskInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.api.quantumTaskCurrentList();
      const data = res.data;
      return {
        task_id: data.task_id ?? 0,
        services_count: data.services_count ?? 0,
      };
    } catch (err: any) {
      return rejectWithValue('Не удалось получить данные черновика');
    }
  }
);

// --- Thunk: добавление гейта в черновик ---
export const addGateToDraft = createAsyncThunk<
  void,
  number // gateId
>(
  'gates/addGateToDraft',
  async (gateId, { dispatch, rejectWithValue }) => {
    try {
      await api.api.draftGatesCreate(gateId);
      // Оптимистично увеличиваем счётчик
      dispatch(incrementGatesCount());
      // И перезагружаем информацию
      dispatch(fetchDraftTaskInfo());
    } catch (err: any) {
      return rejectWithValue('Не удалось добавить гейт в задачу');
    }
  }
);

// --- State ---
interface GatesState {
  data: IGate[];
  loading: boolean;
  error: string | null;
  draftTask: DraftTaskInfo | null;
  useMock: boolean;
}

const initialState: GatesState = {
  data: [],
  loading: false,
  error: null,
  draftTask: null,
  useMock: false,
};

const gatesSlice = createSlice({
  name: "gates",
  initialState,
  reducers: {
    setGates: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDraftTask: (state, action) => {
      state.draftTask = action.payload;
    },
    setUseMock: (state, action) => {
      state.useMock = action.payload;
    },
    incrementGatesCount: (state) => {
      if (state.draftTask) {
        state.draftTask.services_count += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // --- Список гейтов ---
    builder
      .addCase(fetchGatesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGatesList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchGatesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Черновик ---
      .addCase(fetchDraftTaskInfo.fulfilled, (state, action) => {
        state.draftTask = action.payload;
      })
      .addCase(fetchDraftTaskInfo.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setGates,
  setLoading,
  setError,
  setDraftTask,
  setUseMock,
  incrementGatesCount,
} = gatesSlice.actions;

export default gatesSlice.reducer;