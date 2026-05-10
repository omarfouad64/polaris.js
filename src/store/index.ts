import { configureStore } from '@reduxjs/toolkit';
import databaseReducer from './databaseSlice';
import { loadState, saveState } from './persistence';

import { initialData } from './initialData';

const persistedState = loadState();

// Ensure seed data is present even if persisted state is missing new keys or is empty
const preloadedDatabase = persistedState !== undefined 
  ? { ...initialData, ...persistedState } 
  : undefined;

if (preloadedDatabase) {
  // If projects are empty in persisted state but exist in initialData, restore them
  if ((!preloadedDatabase.projects || preloadedDatabase.projects.length === 0) && initialData.projects.length > 0) {
    preloadedDatabase.projects = initialData.projects;
  }
  // Same for users
  if ((!preloadedDatabase.users || preloadedDatabase.users.length === 0) && initialData.users.length > 0) {
    preloadedDatabase.users = initialData.users;
  }
}

export const store = configureStore({
  reducer: {
    database: databaseReducer,
  },
  preloadedState: {
    database: preloadedDatabase,
  },
});

store.subscribe(() => {
  saveState(store.getState().database);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
