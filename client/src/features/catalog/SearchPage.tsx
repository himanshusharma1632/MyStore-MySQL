import { debounce, TextField } from "@mui/material";
import { Fragment, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import { setProductParams } from "./catalogSlice";

export default function SearchPage() {

const {productParams} = useAppSelector(state => state.catalog);
const dispatch = useAppDispatch();
const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

//for delaying the search till complete input is given
const debouncedSearch = debounce((event : any)=> {
dispatch(setProductParams({searchTerm : event.target.value}));
}, 3500)

    return(
        <Fragment>
            <TextField
              label='Search Products'
              variant='outlined'
              value ={searchTerm || ''}
              onChange={(event : any) => {
              setSearchTerm(event.target.value);
              debouncedSearch(event);  
              }
             }
              fullWidth />
        </Fragment>
    )
}