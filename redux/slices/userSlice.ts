import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, RoomApi, RoomType } from '../../api/RoomApi';
import Axios from '../../core/axios';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from '../types';
import { UserData } from '../../pages';

export interface UserSliceState {
    data: UserData;
};

const initialState: UserSliceState = {
    data: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserData>) => {
            state.data = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action: PayloadAction<RootState>) => {
            state.data = action.payload.user.data;
        }
    }
})


export const { setUserData } = userSlice.actions;
export const userReducer = userSlice.reducer