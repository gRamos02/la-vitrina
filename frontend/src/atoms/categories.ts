import type { Category } from '@/vite-env';
import { atom } from 'jotai';

export const categoriesAtom = atom<Category[]>([]);
