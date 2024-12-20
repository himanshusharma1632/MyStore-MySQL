import { TableContainer, Paper, Table, TableRow, TableBody, styled, TableCell, tableCellClasses, Avatar, Button } from '@mui/material';
import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Order } from '../../app/models/Order';
import CurrencyConvert from '../../app/util/CurrencyConverter';

interface Props {
  order : Order;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function OrderCard({order} : Props) {

// appending a particular :id over order<List>
const {id} = useParams<{id: string}>();
  return (
  <Fragment>
   <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableBody>
          <StyledTableRow>
            <StyledTableCell><Avatar alt={order.id.toString()}>{`#${order.id.toString()}`}</Avatar></StyledTableCell>
            <StyledTableCell align="right">{order.orderStatus.split('s')[1]}</StyledTableCell>
            <StyledTableCell align="right">{order.orderDate.split('T')[0]}</StyledTableCell>
            <StyledTableCell align="right">{order.orderDate.split('T')[1]}</StyledTableCell>
            <StyledTableCell align="right">{order.deliveryFees}</StyledTableCell>
            <StyledTableCell align="right">{CurrencyConvert(order.subtotal)}</StyledTableCell>
            <StyledTableCell align="right" sx={{fontWeight : 500}}>{CurrencyConvert(order.total)}</StyledTableCell>
            <StyledTableCell align="right" sx={{fontWeight : 500}}>
              <Link
               to ={`/order/${order.id}`}
               style={{textDecoration : 'none'}}
               >
              <Button variant='contained' color='info' disableElevation>View Details</Button>
              </Link>
            </StyledTableCell>
          </StyledTableRow>
          </TableBody>
      </Table>
    </TableContainer>
  </Fragment>
  );
}
