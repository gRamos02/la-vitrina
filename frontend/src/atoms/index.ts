import { atom } from 'jotai';

// Estado para las categorías (árbol)
export const categoriesAtom = atom<unknown[]>([]);

// Estado para el usuario autenticado
// export const userAtom = atom<User | null>(null);

// Modal de feedback (ejemplo UX)
// export const feedbackAtom = atom<{ message: string; type: 'error' | 'success' } | null>(null);
