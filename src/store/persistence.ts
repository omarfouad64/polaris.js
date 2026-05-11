export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('polaris_db');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('polaris_db', serializedState);
  } catch {
    // ignore write errors
  }
};
