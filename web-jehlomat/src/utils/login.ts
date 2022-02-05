
const STORAGE_KEY = 'auth';

export const setToken = (token: string) => localStorage.setItem(STORAGE_KEY, token);
export const getToken = (): string | null => localStorage.getItem(STORAGE_KEY);
export const isLoggedIn = (): boolean => !!localStorage.getItem(STORAGE_KEY);
