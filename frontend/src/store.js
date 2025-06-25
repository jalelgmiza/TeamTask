import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './features/auth/authApi';
import authReducer from './features/auth/authSlice';
import { taskApi } from './features/tasks/taskApi';
import taskReducer from './features/tasks/taskSlice';
import { userApi } from './features/users/userApi';
import userReducer from './features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    users: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, taskApi.middleware, userApi.middleware),
});

setupListeners(store.dispatch);