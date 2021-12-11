import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { roomsReducer } from './slices/roomSlice';
import { RootState } from './types';

const rootReducer = combineReducers({
    rooms: roomsReducer,
});


export const makeStore = (): Store<RootState> => configureStore({
    reducer: rootReducer
});

export type AppStore = ReturnType<typeof makeStore>;

export const wrapper = createWrapper<Store<RootState>>(makeStore, { debug: true });

