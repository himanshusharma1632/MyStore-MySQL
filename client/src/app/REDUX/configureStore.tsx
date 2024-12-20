import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { accountSlice } from '../../features/account/accountSlice';
import { basketSlice } from '../../features/BasketPage/BasketSlice';
import { catalogSlice } from '../../features/catalog/catalogSlice';
import { counterSlice } from '../../features/Contact/counterSlice';
import { orderSlice } from '../../features/Order/orderSlice';

export const store = configureStore({
     reducer : {
        CounterSlicer : counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog : catalogSlice.reducer,
        account : accountSlice.reducer,
        orders : orderSlice.reducer
     }
});


export type RootState = ReturnType<typeof  store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch=() => useDispatch<AppDispatch>(); 