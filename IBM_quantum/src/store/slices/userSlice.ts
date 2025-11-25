import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { 
    InternalAppHandlerDTOReqUserReg, 
    InternalAppHandlerDTORespTokenLogin,
    InternalAppHandlerDTORespUser,
    InternalAppHandlerDTOReqUserUpd,
    InternalAppHandlerDTOUser
} from '../../api/Api';

// Тип состояния пользователя
interface UserState {
    user: InternalAppHandlerDTOUser | null;      
    token: string | null;        
    isAuthenticated: boolean;    
    registerSuccess: boolean;   
    loading: boolean;         
    error: string | null;      
}

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('userInfo');

const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    registerSuccess: false,
    loading: false,
    error: null,
};

// --- 1. ВХОД (Login) ---
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: InternalAppHandlerDTOReqUserReg, { rejectWithValue }) => {
        try {
            const response = await api.login.loginCreate(credentials);
            const data = response.data;

            if (data.token) localStorage.setItem('authToken', data.token);
            if (data.user) localStorage.setItem('userInfo', JSON.stringify(data.user));

            return data;
        } catch (err: any) {
            const backendError = err.response?.data || '';
            let readableError = 'Ошибка авторизации';
            
            if (backendError.includes('record not found')) {
                readableError = 'Пользователь с таким логином не найден';
            } else if (backendError.includes('hashedPassword is not the hash') || backendError.includes('password')) {
                readableError = 'Неверный пароль';
            } else if (backendError) {
                readableError = backendError;
            }

            return rejectWithValue(readableError);
        }
    }
);

// --- 2. РЕГИСТРАЦИЯ (Register) ---
export const registerUser = createAsyncThunk(
    'user/register',
    async (credentials: InternalAppHandlerDTOReqUserReg, { rejectWithValue }) => {
        try {
            const response = await api.users.usersCreate(credentials);
            return response.data; 
        } catch (err: any) {
            return rejectWithValue(err.response?.data || 'Ошибка регистрации');
        }
    }
);

// --- 3. ВЫХОД (Logout) ---
export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            // Используем метод из api.api
            await api.api.authLogoutCreate();
        } catch (err: any) {
            console.warn('Logout failed on backend, clearing local anyway');
            return rejectWithValue(err.response?.data || 'Ошибка выхода');
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        }
    }
);

// --- 4. ПОЛУЧЕНИЕ ПРОФИЛЯ ---
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            // Используем метод из api.api
            const response = await api.api.usersMeList();
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || 'Не удалось загрузить профиль');
        }
    }
);

// --- 5. ОБНОВЛЕНИЕ ПРОФИЛЯ ---
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (data: InternalAppHandlerDTOReqUserUpd, { rejectWithValue }) => {
        try {
            // Используем метод из api.api
            const response = await api.api.usersMeUpdate(data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || 'Ошибка обновления');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetRegisterSuccess: (state) => {
            state.registerSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // === LOGIN ===
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token || null;
                state.user = action.payload.user || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // === REGISTER ===
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true; 
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // === LOGOUT ===
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                // Все равно очищаем состояние даже при ошибке на бэкенде
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })

            // === FETCH PROFILE ===
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // === UPDATE PROFILE ===
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.user) {
                    // Обновляем только те поля, которые пришли в ответе
                    state.user = { ...state.user, ...action.payload };
                }
                localStorage.setItem('userInfo', JSON.stringify(state.user));
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetRegisterSuccess } = userSlice.actions;
export default userSlice.reducer;