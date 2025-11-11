import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { IGate, DraftTaskInfo } from '../../types/types';
import type { RootState } from '../index';

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
    setGates: (state, action: PayloadAction<IGate[]>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDraftTask: (state, action: PayloadAction<DraftTaskInfo | null>) => {
      state.draftTask = action.payload;
    },
    setUseMock: (state, action: PayloadAction<boolean>) => {
      state.useMock = action.payload;
    },
    updateGatesCount: (state, action: PayloadAction<number>) => {
      if (state.draftTask) {
        state.draftTask.GatesCount = action.payload;
      }
    },
    incrementGatesCount: (state) => {
      if (state.draftTask) {
        state.draftTask.GatesCount += 1;
      }
    }
  }
});

// Хуки для доступа к состоянию
export const useGates = () => useSelector((state: RootState) => state.gates.data);
export const useGatesLoading = () => useSelector((state: RootState) => state.gates.loading);
export const useGatesError = () => useSelector((state: RootState) => state.gates.error);
export const useDraftTask = () => useSelector((state: RootState) => state.gates.draftTask);
export const useMockMode = () => useSelector((state: RootState) => state.gates.useMock);

// Экспортируем actions
export const {
  setGates: setGatesAction,
  setLoading: setLoadingAction,
  setError: setErrorAction,
  setDraftTask: setDraftTaskAction,
  setUseMock: setUseMockAction,
  updateGatesCount: updateGatesCountAction,
  incrementGatesCount: incrementGatesCountAction
} = gatesSlice.actions;

export default gatesSlice.reducer;