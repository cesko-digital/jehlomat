import React, { useState } from 'react';

const STORAGE_KEY = 'auth';

export const setStorageToken = (token: string) => localStorage.setItem(STORAGE_KEY, token);
export const getStorageToken = (): string | null => localStorage.getItem(STORAGE_KEY);
export const isLoggedIn = () => !!localStorage.getItem(STORAGE_KEY);
export const removeToken = () => localStorage.removeItem(STORAGE_KEY);

interface UseLoginReturn {
    setToken: (token: string) => void;
    setLogin: (token: string) => void;
    logout: () => void;
    isLoggedIn: boolean;
    token: string | null;
}

export const defaultLoginValues = {
    token: null,
    setToken: (token: string) => {}
}

export const LoginContext = React.createContext<{token: null| string, setToken: (token: string) => void}>(defaultLoginValues);

//
export const useLogin = (): UseLoginReturn => {
    const [token, setToken] = useState<string | null>(null);

    const setLogin = (token: string) => {
        setToken(token);
        setStorageToken(token);
        console.log('called setLogin', token)
    };

    const logout = () => {
        removeToken();
        setToken(null);
    };


    return {
        setToken,
        logout,
        isLoggedIn: !!token,
        token,
        setLogin: setLogin
    };
};