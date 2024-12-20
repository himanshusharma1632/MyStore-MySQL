import { Fragment, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/REDUX/configureStore';
import Loading from '../../app/layout/Loading';
import { fetchOrdersAsync, orderSelector } from './orderSlice';
import OrderList from './OrderList';

const GridStyle = {
  justifyContent : 'center',
  alignItems : 'center',
  display : 'flex',
  mt : 5,
  p : {
    lg : 1,
    sm : 2,
    md : 1
  },
  width : '100%'
}


export default function OrdersPage() {
const {status, orderLoaded} = useAppSelector(state => state.orders);
const orderList = useAppSelector(orderSelector.selectAll);
const dispatch = useAppDispatch();

//when component is mounted, the Effect is also produced
useEffect(() => {
if (!orderLoaded){
dispatch(fetchOrdersAsync())
}
}, [dispatch, orderLoaded]) 

if (status.includes('pending')) return <Loading message='Your Orders are loading ...' />

  return (
  <Fragment>
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <OrderList orders={orderList}/>
      </Grid>
    </Grid>
    </Fragment>
  );
}