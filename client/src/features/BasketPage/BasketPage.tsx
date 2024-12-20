import { Button, Grid, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../app/layout/Loading";
import { useAppSelector } from "../../app/REDUX/configureStore";
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";

export default function BasketPage(){
const [loading, setloading] = useState(false);

/*const { basket, setBasket, removeItem } = useStoreContext();*/
const { basket } = useAppSelector(state=> state.basket);

if (loading) return <Loading message='आपकी टोकरी लोड हो रही है ...' />;
if(!basket) return <Typography variant="h4" sx={{mt: 10}}>Your Basket Is Empty</Typography>;


    return(
      <Fragment>
        <Grid container spacing ={3} sx={{mt: 8}}>
            <Grid item xs={12} lg={9} xl={8}>
            <BasketTable items={basket.items} isBasketPresent ={true} />
             </Grid> 
              <Grid item xs={12} lg={3} md={4}>
                <BasketSummary />
              <Grid item xs={12} lg={12} md={4}>
              <Link to ={"/checkout"}>
              <Button variant="contained" color='success' fullWidth sx={{textDecoration : 'none'}}>Proceed to Checkout</Button>
              </Link>
             </Grid>
            </Grid>
        </Grid>
        </Fragment>
    )
}