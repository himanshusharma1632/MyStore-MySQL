import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/Basket";
import { getCookie } from "../../app/util/Cookies";

interface BasketState {
    basket : Basket | null,
    status : string,
}

const initialState : BasketState = {
    basket : null,
    status : 'idle_State',
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.BasketFetcher.getBasket()
        }catch(error : any){
            return thunkAPI.rejectWithValue({error : error.data});
        }
    }, {
        condition : () => {
            if(!getCookie("buyerId")) return false;
        }
    }
)

export const addBasketItemAsync = createAsyncThunk<Basket , {productId : number, quantity: number}>(
    'basket/addBasketItemAsync',
    async ({productId, quantity}) => {
        try{
            return await agent.BasketFetcher.AddBasketItem(productId, quantity);
        }
        catch(error) {
            console.log(error);
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, {productId : number, quantity: number}>(
'basket/removeBasketItemAsync',
async ({productId, quantity = 1})=> {
    try {
        await agent.BasketFetcher.RemoveBasketItem(productId, quantity);
    }catch(error){
        console.log(error);
    }
}
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers : {
        setBasket : (state, action) => {
         state.basket = action.payload
        },
        clearBasket: (state) => {
            state.basket = null;
        }
    },

    extraReducers : (builder => {
        builder.addCase(addBasketItemAsync.pending, (state)=> {
            state.status = 'Item_Pending';
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'item_Pending' + action.meta.arg.productId;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action)=> {
            const {productId, quantity} = action.meta.arg;
            const ItemIndex = state.basket?.items.findIndex(i=> i.productId === productId);
            if (ItemIndex === -1 || ItemIndex ===  undefined) return ;
            state.basket!.items[ItemIndex].quantity -= quantity; 
            if (state.basket?.items[ItemIndex].quantity === 0 ) {
                state.basket.items.splice(ItemIndex, 1);
            }
            state.status = 'idle_State';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state)=> {
            state.status = 'idle_State';
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
            state.basket = action.payload;
            state.status = 'idle_State';
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action)=> {
            state.status = 'idle_State';
            console.log(action.payload);
        });

    })
});

export const { setBasket, clearBasket } = basketSlice.actions;