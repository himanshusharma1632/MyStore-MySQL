 import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Order } from "../../app/models/Order";
import { RootState } from "../../app/REDUX/configureStore";

interface OrderState {
    order : Order[] | null,
    status : string,
    orderLoaded : boolean

}
//initialState of orders
const initialState : OrderState = {
order : null,
status : 'idle',
orderLoaded : false
}
//creating an entity adapter for fetching the orders
export const ordersAdapter = createEntityAdapter<Order>();
//fetching the list of Orders from API Server
export const fetchOrdersAsync = createAsyncThunk<Order[]>(
    'orders/fetchOrdersAsync',
    async (_, thunkAPI) => {
     try {
        return await agent.Orders.get();
     }catch(error : any){
        return thunkAPI.rejectWithValue({error : error.data});
     }
    }
);

//fetching the single Order {id} from API Server
export const fetchOrderAsync = createAsyncThunk<Order, number>(
    'orders/fetchOrderAsync',
    async (orderId : number, thunkAPI) => {
        try {
            return await agent.Orders.getDetail(orderId)
        }catch(error : any){
            return thunkAPI.rejectWithValue({error : error.data})
        }
    }
)

export const orderSlice = createSlice({
    name : 'orders',
    initialState : ordersAdapter.getInitialState<OrderState>({
        order : null,
        status : 'idle',
        orderLoaded : false,

    }),
    reducers : {
    clearOrders : (state) => {
      state.order = null;
      state.status = 'idle'
    }
    }, 
    extraReducers : (builder => {
        builder.addCase(fetchOrdersAsync.pending, (state) => {
            state.status = 'pendingFetchOrders';
        });
        builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
            ordersAdapter.setAll(state, action);
            state.status = 'idle';
            state.orderLoaded = true;
        });
        builder.addCase(fetchOrdersAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload)
        });

        //cases for fetching the single order from the API Server
        builder.addCase(fetchOrderAsync.pending, (state) => {
            state.status = 'pendingFetchOrder';
        });
        builder.addCase(fetchOrderAsync.fulfilled, (state, action) => {
            ordersAdapter.upsertOne(state, action.payload);
            state.orderLoaded = true;
            state.status = 'idle';

        });
        builder.addCase(fetchOrderAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload)
        });
    })
});

export const orderSelector = ordersAdapter.getSelectors((state : RootState) => state.orders);
export const {clearOrders} = orderSlice.actions;