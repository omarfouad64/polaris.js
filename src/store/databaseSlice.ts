import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialData, type DatabaseState } from './initialData';

const databaseSlice = createSlice({
  name: 'database',
  initialState: initialData,
  reducers: {
    resetDatabase: () => initialData,

    // Add missing type mutations here if components actually dispatch them.
    // For now, this defines basic state management.
    updateDatabase: (state, action: PayloadAction<Partial<DatabaseState>>) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { resetDatabase, updateDatabase } = databaseSlice.actions;
export default databaseSlice.reducer;
