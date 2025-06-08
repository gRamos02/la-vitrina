import { atom } from 'jotai';

const localStorageToken = localStorage.getItem('token') || '';

// Átomo base
export const tokenAtom = atom<string>(localStorageToken);

// Átomo con acciones para manejar el token
export const setTokenAtom = atom(null, (_get, set, newToken: string) => {
  localStorage.setItem('token', newToken);
  set(tokenAtom, newToken);
});

export const clearTokenAtom = atom(null, (_get, set) => {
  localStorage.removeItem('token');
  set(tokenAtom, '');
});
