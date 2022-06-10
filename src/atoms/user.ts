import { atom } from 'jotai'
import { fetchJsonAtom } from './fetch';

export const testAtom = atom('testAtom');

type user = {
    id: number,
    name: string,
  }

export const usersListAtom = fetchJsonAtom<user[]>();
