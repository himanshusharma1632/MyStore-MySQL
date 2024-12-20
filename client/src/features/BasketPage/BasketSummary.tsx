import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Grid, Stack, Typography } from "@mui/material";
import { Fragment } from "react";
import { useAppSelector } from "../../app/REDUX/configureStore";
import OrderReview from "../CheckoutPage/OrderReview";

interface Props {
    isSummeryLook? : boolean;
    subTotal? : number;
}

export default function BasketSummary ({isSummeryLook = true, subTotal}: Props) {
const { basket } = useAppSelector(state => state.basket);

if (subTotal === undefined){
subTotal = basket?.items.reduce((sum, item)=> sum + (item.price * item.quantity), 0) ?? 0;
}
const deliveryFee = subTotal > 20000 ? 0 : 500;
    return (
        <Fragment>
            {isSummeryLook ? (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{(subTotal/100).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{(deliveryFee/100).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{((subTotal + deliveryFee)/100).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            ) : (
              <OrderReview />
                )}
    </Fragment>
)}
