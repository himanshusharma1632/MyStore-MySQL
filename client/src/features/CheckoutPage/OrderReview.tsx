import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useAppSelector } from '../../app/REDUX/configureStore';
import { Fragment } from 'react';
import { Paper, Stack } from '@mui/material';
import BasketTable from '../BasketPage/BasketTable';


export default function OrderReview(){
const { basket } = useAppSelector(state => state.basket);
const subtotal = basket?.items.reduce((sum, item)=> sum + (item.price * item.quantity), 0) ?? 0;
const deliveryFee = subtotal > 20000 ? 0 : 500;

    return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
      Order summary
    </Typography>
    {basket &&
    <Grid container>
      <Grid item xs={12}>
         <BasketTable isBasketPresent={false} items={basket?.items} />
      </Grid>
    </Grid>}
                <Grid container spacing={2} sx={{ p: {lg :1, sm : 1, md :1}}}>
                  <Grid item xs={12}>
                <Stack direction ='row'>
                    <Grid item xs={4} sx={{borderRight : '1px solid rgba(0, 0, 0, 0.1)', mx :1}}>
                       <Typography variant ='body1'>Subtotal</Typography>
                       <Typography variant ="subtitle1" sx={{fontWeight : '600'}}>${(subtotal/100).toFixed(2)}/-</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{borderRight : '1px solid rgba(0, 0, 0, 0.1)', mx :1}}>
                       <Typography variant ='body1'>Delivery Fees</Typography>
                       <Typography variant ="subtitle1" sx={{fontWeight : '600'}}>${(deliveryFee/100).toFixed(2)}/-</Typography>
                    </Grid>
                    <Grid item xs={4}>
                       <Typography variant ='body1'>Total</Typography>
                       <Typography variant ="h6" sx={{fontWeight : '600', color : 'red'}}>${((subtotal + deliveryFee)/100).toFixed(2)}/-</Typography>
                    </Grid>
                    </Stack>
                </Grid>
               </Grid>
    </Fragment>
       
    )
}