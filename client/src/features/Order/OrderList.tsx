import { Grid } from "@mui/material";
import { Fragment } from "react";
import { Order } from "../../app/models/Order";
import OrderCard from "./OrderCard";

interface Props {
    orders : Order[];
}

export default function OrderList({orders} : Props) {
    return(
        <Fragment>
            <Grid container spacing ={1} sx={{mt : 10}}>
                {orders?.map(order => (
                    <Grid item xs={10} key={order.id}>
                        <OrderCard order = {order} />
                    </Grid>
                ))} 
            </Grid>
        </Fragment>
    )
}