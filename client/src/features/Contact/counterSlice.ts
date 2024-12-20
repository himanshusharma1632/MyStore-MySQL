import { Store } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit"
import { type } from "os";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { store } from "../../app/REDUX/configureStore";



export interface CounterState {
    data: any,
    title: string,
    name: string,
}

const initialState: CounterState = {
    data: 1,
    title: 'This is the React-Redux Toolkit Usage',
    name: 'Himanshu'
}

export const counterSlice = createSlice({
    name : 'CounterSlicer',
    initialState,
    reducers : {
        increment : (state, action) => {
            state.data += action.payload
        },
        decrement : (state, action) => {
            state.data -= action.payload
        },
    }
});

export const { increment, decrement} = counterSlice.actions;

