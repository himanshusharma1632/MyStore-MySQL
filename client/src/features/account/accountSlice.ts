import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { User } from "../../app/models/User";
import { setBasket } from "../BasketPage/BasketSlice";
import { router } from "../../Routes/Routes";

interface AccountState {
    user : User | null;
}
const initialState : AccountState = {
    user : null
}
export const loginUserAsync = createAsyncThunk<User, FieldValues>(
    'account/loginUserAsync',
    async(data, thunkAPI) => {
        try{
        const userDTO = await agent.Account.login(data);
        const {basket, ...user} = userDTO;
        if (basket) thunkAPI.dispatch(setBasket(basket));
        localStorage.setItem("user", JSON.stringify(user));
        return user;
        }
        catch(error : any){
        thunkAPI.rejectWithValue({error : error.data});
    }
}
);

export const fetchUserAsync = createAsyncThunk<User>(
    'account/fetchUserAsync',
    async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
    try{
    const userDTO = await agent.Account.currentUser();
    const {basket, ...user} = userDTO;
    if(basket) thunkAPI.dispatch(setBasket(basket));
    localStorage.setItem('user', JSON.stringify(user));
    return user;
        }catch(error : any){
            thunkAPI.rejectWithValue({error : error.data});
        }   
    },
    {
        condition : () => {
            if(!localStorage.getItem('user')) return false;
        }
    }
    );

export const accountSlice = createSlice({
    name : 'account',
    initialState,
    reducers : {
        SignOutUser : (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser : (state, action) => {
         const claims = JSON.parse(atob(action.payload.token.split('.')[1]));
         let roles : string | string[] = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
         state.user = { ...action.payload, roles : typeof(roles) === 'string' ? [roles] : roles };
        }
    },
    extraReducers : (builder => {
     builder.addMatcher(isAnyOf(loginUserAsync.fulfilled, fetchUserAsync.fulfilled), (state, action : PayloadAction<User>) => {
      const claims = JSON.parse(atob(action.payload.token.split('.')[1]));
      let roles : string | string[] = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      state.user = { ...action.payload, roles : typeof(roles) === 'string' ? [roles] : roles };
    }); 
    builder.addMatcher(isAnyOf(loginUserAsync.rejected, fetchUserAsync.rejected), (state, action) => {
     console.log(action.payload);
    })
  })
});

export const { SignOutUser, setUser } = accountSlice.actions;