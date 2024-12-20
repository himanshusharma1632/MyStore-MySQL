import { Button, ButtonGroup, Typography } from "@mui/material";
import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import { decrement, increment } from "./counterSlice";


export default function ContactPage(){
const dispatch = useAppDispatch();
const { data, title, name} = useAppSelector(state=> state.CounterSlicer);
return(
    <Fragment>
    <Typography variant="h4" sx={{color: 'red', mt: 12}}>
       {title}
    </Typography>
    <Typography variant="h6" sx={{color: 'primary', mt: 0}}>
    {name}
 </Typography>
 <Typography variant="subtitle2" sx={{color: 'warning', mt: 0}}>
  This is the Data : {data}
</Typography>
<ButtonGroup>
    <Button onClick={() => dispatch(increment(1))} variant ="contained" color="primary" size="medium">Increment</Button>
    <Button onClick={() => dispatch(decrement(1))} variant ="contained" color="warning" size="medium">Decrement</Button>
    <Button onClick={() => dispatch(increment(5))} variant ="contained" color="secondary" size="medium">Increment Stepped</Button>

</ButtonGroup>
</Fragment>
)

}