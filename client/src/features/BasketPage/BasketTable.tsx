import { Remove, Add, DeleteOutlined } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, styled, tableCellClasses, Divider } from "@mui/material";
import { Fragment } from "react";
import { BasketItem } from "../../app/models/Basket";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import { removeBasketItemAsync, addBasketItemAsync } from "./BasketSlice";

interface Props{
    items : BasketItem[];
    isBasketPresent? : boolean;
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.secondary.dark,
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


export default function BasketTable({items, isBasketPresent = true} : Props){
const {status} = useAppSelector(state => state.basket);
const dispatch = useAppDispatch();
    return(
        <Fragment>
            <TableContainer>
                <Paper elevation={3} sx={{borderRadius : '0px'}}>
<Table sx={{ minWidth: !isBasketPresent ? 500 : 750 }} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>Product Name</StyledTableCell>
            <StyledTableCell align="right">Brand</StyledTableCell>
            <StyledTableCell align="right">Product Type</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            {isBasketPresent &&
            <StyledTableCell align="right"></StyledTableCell>}
          </StyledTableRow>
        </TableHead>
        <TableBody>
        {items?.map(item =>(
            <StyledTableRow
              key={item.productId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component ="th" scope = "row">
                  <img src={item.pictureUrl} alt={item.name} style={{maxWidth: 60, backgroundColor: '#ADD8E6', padding: 2}} />
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" sx={{fontWeight: 500}} color="text.success">
                  {item.name}
              </StyledTableCell>
              <StyledTableCell align="right">{item.brand}</StyledTableCell>
              <StyledTableCell align="right">{item.typeofProduct}</StyledTableCell>
              <StyledTableCell align="center">
                {isBasketPresent &&
                <IconButton 
                color="error"
                onClick ={()=> dispatch(removeBasketItemAsync({productId: item.productId, quantity : 1}))}>
                  <Remove />
                </IconButton>}
                {item.quantity}
                {isBasketPresent && 
                <IconButton 
                onClick={()=> dispatch(addBasketItemAsync({productId : item.productId, quantity : 1}))}
                color="success"
                >
                  <Add />
                </IconButton>}
              </StyledTableCell>
              <StyledTableCell align="right" sx={{fontWeight : 500, color : '#121212', fontSize : '18px'}}>₹{((item.price/100) * item.quantity).toFixed(2)}</StyledTableCell>
              {isBasketPresent && 
              <StyledTableCell align="right"> 
                <IconButton color="success" onClick={()=> dispatch(removeBasketItemAsync({productId: item.productId,
                                                                                          quantity: item.quantity}))}>
                  <DeleteOutlined color="success" />
                  </IconButton>
                  </StyledTableCell>}
            </StyledTableRow>
             ))}
        </TableBody>
      </Table>
      </Paper>
    </TableContainer>
        </Fragment>
    )
}