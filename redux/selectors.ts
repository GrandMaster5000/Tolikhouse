import { RootState } from './types';

export const selectRooms = (state: RootState) => state.rooms.items;