import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from '../index';

interface FiltersState {
  searchTerm: string;
}

const initialState: FiltersState = {
  searchTerm: '',
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    resetFilters: (state) => {
      state.searchTerm = '';
    }
  }
});

// Хук для доступа к фильтрам
export const useFilters = () => {
  const searchTerm = useSelector((state: RootState) => state.filters.searchTerm);
  return { searchTerm };
};

export const {
  setSearchTerm: setSearchTermAction,
  resetFilters: resetFiltersAction
} = filtersSlice.actions;

export default filtersSlice.reducer;