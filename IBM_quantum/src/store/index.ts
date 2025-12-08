import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import userReducer from './slices/userSlice';
import taskReducer from './slices/taskSlice';


export const store = configureStore({
    reducer: {
        filter: filterReducer,
        user: userReducer,
        task: taskReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;