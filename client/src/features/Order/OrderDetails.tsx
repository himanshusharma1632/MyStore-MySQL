import { Grid } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BasketItem } from "../../app/models/Basket";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import BasketSummary from "../BasketPage/BasketSummary";
import BasketTable from "../BasketPage/BasketTable";
import { fetchOrderAsync, orderSelector } from "./orderSlice";
import ShipTo from "./ShippingAddress";

export default function OrderDetails(){
const {id} = useParams<{id : string}>();
const order = useAppSelector(state => orderSelector.selectById(state, id!));
const dispatch = useAppDispatch();
const subTotal = order?.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) ?? 0;

useEffect(() => {
    if(!order) {
        dispatch(fetchOrderAsync(parseInt(id!)));
    }
}, [dispatch, id, order])
    return(
        <Fragment>
            <Grid container spacing={1} sx={{mt :{ lg : 10, md : 10, sm : 8, xs : 6}}}>
                <Grid item xs={8}>
                <BasketTable items={order?.orderItems as BasketItem[]} isBasketPresent={false} />
                </Grid>
           
                <Grid item xs={4}>
                <Grid item xs={12}>
                <BasketSummary subTotal={subTotal} />
                </Grid>

                <Grid item xs={12} sx={{mt : 2}}>
                 <ShipTo shippingAddress={order?.shippingAddress} />
                </Grid>
                </Grid>
            </Grid>
        </Fragment>
    )
}