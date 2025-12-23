import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import userReducer from './slices/userSlice';
import taskReducer from './slices/taskSlice';
import gatesSlice from './slices/gatesSlice';

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        user: userReducer,
        task: taskReducer,
        gates: gatesSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;