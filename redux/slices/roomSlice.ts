import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, RoomApi, RoomType } from '../../api/RoomApi';
import Axios from '../../core/axios';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from '../types';
import { UserData } from '../../pages';

export interface RoomSliceState {
    items: Room[]
};

const initialState: RoomSliceState = {
    items: [],
};

export const fetchCreateRoom = createAsyncThunk(
    'rooms/fetchCreateRoomStatus',
    async ({ title, type }: { title: string, type: RoomType}) => {
        try {
            const room = await RoomApi(Axios).createRoom({
                title, 
                type
            });
    
            return room;
        } catch (err) {
            throw new Error('Error while creating a room')
        }
    }
)

export const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRooms: (state, action: PayloadAction<Room[]>) => {
            state.items = action.payload;
        },
        setRoomSpeakers: (state, action: PayloadAction<{ speakers: Room['speakers']; roomId: number }>) => {
            state.items = state.items.map(room => {
                if(room.id === action.payload.roomId) {
                    room.speakers = action.payload.speakers;
                }
                return room;
            });
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action: PayloadAction<RootState>) => {
            state.items = action.payload.rooms.items;
        },
        [fetchCreateRoom.fulfilled.type]: (state, action: PayloadAction<Room | null>) => {
            state.items.push(action.payload);
        },
        [fetchCreateRoom.rejected.type]: (_, action) => {
            console.error(action);
        }
    }
})


export const { setRooms, setRoomSpeakers } = roomSlice.actions;
export const roomsReducer = roomSlice.reducer