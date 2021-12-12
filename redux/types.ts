import { RoomSliceState } from './slices/roomSlice';
import { UserSliceState } from './slices/userSlice';

export type RootState = {
    rooms: RoomSliceState;
    user: UserSliceState;
};
