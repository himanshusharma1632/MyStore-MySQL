import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import { Product, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/REDUX/configureStore";

interface CatalogState {
 loadedProducts : boolean,
 filtersLoaded : boolean,
 brandList : string[],
 status : string,
 typeList : string[],
 productParams: ProductParams,
 metaData : MetaData | null
}

function AxiosGetParams (productParams : ProductParams) {
const params = new URLSearchParams();
//for orderBy
params.append('orderBy', productParams.orderBy);

//for pageNumber
params.append('pageNumber', productParams.pageNumber.toString());

//for pageSize
params.append('pageSize', productParams.pageSize.toString());

//for searchTerm
if (productParams.searchTerm)
params.append('searchTerm', productParams.searchTerm);

//for brandList
if (productParams.brandList)
params.append('Brand', productParams.brandList.toString()); //because brandList is a string[]

if (productParams.typeList)
params.append('Type', productParams.typeList.toString()); //because typeList is the string[]

return params;
}

export const productsAdapter = createEntityAdapter<Product>();
export const productsFetchAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/productsFetchAsync',
    async (_, thunkAPI) =>{
        const params = AxiosGetParams(thunkAPI.getState().catalog.productParams);
        try {
        const response = await agent.Catalog.list(params);
        thunkAPI.dispatch(setMetaData(response.metaData));
        return response.items;
        }catch(error : any) {
         return thunkAPI.rejectWithValue({error : error.data});
        }
    }
);

export const productFetchAsync = createAsyncThunk<Product, number>(
'catalog/productFetchAsync',
async (productId, thunkAPI) => {
    try {
        return await agent.Catalog.details(productId);
        }
    catch(error : any) {
        return thunkAPI.rejectWithValue({error: error.data});
    }
  }
)

export const fetchFilters = createAsyncThunk(
'catalog/fetchFilters',
async (_, thunkAPI) => {
    try {
        return await agent.Catalog.fetchFilters();
    }
    catch(error : any) {
        return thunkAPI.rejectWithValue({error : error.data});
    }
}
);

function initParams() {
    return {
        pageSize : 6,
        pageNumber : 1,
        orderBy : 'name'
    }
}

export const catalogSlice = createSlice({
   name: 'catalog',
   initialState : productsAdapter.getInitialState<CatalogState>({
       loadedProducts : false, 
       filtersLoaded : false,
       status : 'idle',
       brandList : [],
       typeList : [],
       productParams : initParams(),
       metaData : null,
   }),
   reducers : {
       setProductParams : (state, action) => {
           state.loadedProducts = false;
           state.productParams = {...state.productParams, ...action.payload};
       },
       setMetaData : (state, action) => {
        state.metaData = action.payload;
       },
       resetProductParams : (state) => {
        state.productParams = initParams();//this reducer is refresh when new batch of product is loaded
       },
       setProduct : (state, action) => {
        productsAdapter.upsertOne(state, action.payload);
       }
   },
   extraReducers : (builder => {
       builder.addCase(productsFetchAsync.pending, (state)=> {
           state.status = 'pendingProductsFetch';
       });
       builder.addCase(productsFetchAsync.fulfilled, (state, action) => {
           productsAdapter.setAll(state, action.payload);
           state.status = 'idle';
           state.loadedProducts = true;
       });
       builder.addCase(productsFetchAsync.rejected, (state, action)=> {
           console.log(action.payload);
           state.status = 'idle'
       });
       builder.addCase(productFetchAsync.pending, (state)=> {
            state.status = 'pendingProductFetch';
       });
       builder.addCase(productFetchAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
       });
       builder.addCase(productFetchAsync.rejected, (state) => {
           state.status = 'idle';
       });
       builder.addCase(fetchFilters.pending, (state) => {
           state.status = 'pendingfetchFilters';
       });
       builder.addCase(fetchFilters.fulfilled, (state, action) => {
           state.brandList = action.payload.brandList;
           state.typeList = action.payload.typeList;
           console.log(state.brandList);
           console.log(state.typeList);
           state.filtersLoaded = true; 
       });
       builder.addCase(fetchFilters.rejected, (state) => {
           state.status = 'idle';
       });
   })
});

export const productSelector = productsAdapter.getSelectors((state : RootState) => state.catalog);
export const {setProductParams, resetProductParams, setMetaData, setProduct} = catalogSlice.actions; 