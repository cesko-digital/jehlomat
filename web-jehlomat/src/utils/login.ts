const STORAGE_KEY = 'auth';

export const setToken = (token: string) => localStorage.setItem(STORAGE_KEY, token);
export const getToken = (): string | null => localStorage.getItem(STORAGE_KEY);
export const isLoggedIn =() => !!localStorage.getItem(STORAGE_KEY);
export const logout = () => localStorage.removeItem(STORAGE_KEY);
