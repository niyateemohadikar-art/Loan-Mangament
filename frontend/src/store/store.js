import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, loanAPI, adminAPI, notificationAPI } from '../services/api';

// === AUTH SLICE ===
const initialAuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// === LOANS SLICE ===
export const fetchMyLoans = createAsyncThunk('loans/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await loanAPI.getMyLoans();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch loans');
  }
});

export const fetchAllLoans = createAsyncThunk('loans/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await loanAPI.getAllLoans(params);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch loans');
  }
});

const loansSlice = createSlice({
  name: 'loans',
  initialState: { items: [], allLoans: [], pagination: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLoans.pending, (state) => { state.loading = true; })
      .addCase(fetchMyLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllLoans.pending, (state) => { state.loading = true; })
      .addCase(fetchAllLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.allLoans = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// === NOTIFICATIONS SLICE ===
export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await notificationAPI.getAll();
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
        state.loading = false;
      });
  },
});

// === STORE ===
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    loans: loansSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});

export const { logout, clearError } = authSlice.actions;
export default store;
