import { configureStore } from '@reduxjs/toolkit';
import databaseReducer from './databaseSlice';
import { loadState, saveState } from './persistence';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    database: databaseReducer,
  },
  preloadedState: {
    database: persistedState !== undefined ? persistedState : undefined,
  },
});

store.subscribe(() => {
  saveState(store.getState().database);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
