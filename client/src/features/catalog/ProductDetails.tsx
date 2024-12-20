import { ShoppingCartCheckoutRounded } from "@mui/icons-material";
import { Button, Divider, Grid, Rating, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../BasketPage/BasketSlice";
import { productFetchAsync, productSelector } from "./catalogSlice";


export default function ProductDetails() {
    const {id} = useParams<{id: string}>();
    const product = useAppSelector(state => productSelector.selectById(state, id!));
        
    const dispatch = useAppDispatch();
    const { basket, status } = useAppSelector(state => state.basket);
    const { status : productStatus } = useAppSelector(state => state.catalog);
    const [quantity, setQuantity] = useState(0);
    
    const items = basket?.items.find(i=> i.productId===product?.id);

    useEffect(() => {
      if (items) setQuantity(items.quantity);
       if (!product) dispatch(productFetchAsync(parseInt(id!)));
    }, [id, items, dispatch, product])
  

    function handleUpdateCart() {
     //adding item from page to cart
     if (!items || quantity > items.quantity){
       const UpdateQuantity = items ? quantity - items.quantity : quantity;
       dispatch(addBasketItemAsync({productId : product?.id!, quantity : UpdateQuantity}))
     }else {
       //removing item from page to cart
       const UpdateRemoval = items.quantity - quantity;
       dispatch(removeBasketItemAsync({productId : product?.id!, quantity : UpdateRemoval}));
     }
    }
    
    

  function handleInputQuantity(event : any) {
    if (event.target.value > 0){
    setQuantity(parseInt(event.target.value));
    }
  }

    if(productStatus.includes('pending')) return <Loading />
    if(!product) return <h3>Product Not Found ! ....</h3>

    
    return(
        <Grid container spacing={6} sx={{mt: 8}}>
           <Grid item xs={6}>
             <img src={product.pictureUrl} alt={product.name} 
             style={{width: '100%', backgroundColor: '#d3d3d3'}} /> 
           </Grid>    

           <Grid item xs={6}>
             <Typography variant='h4'>{product.name}</Typography>
             <Divider sx={{mt: 1, mb: 2}}/>
           
             <Typography variant='h5' color="error">₹{(product.price/100).toFixed(2)}</Typography>
             
             <Divider sx={{mt: 1, mb: 2}}/>
            

             <TableContainer>
               <Table>
                 <TableBody>
                 <TableRow>
                   <TableCell>Name</TableCell>
                   <TableCell>{product.name}</TableCell>
                 </TableRow>

                 <TableRow>
                   <TableCell>Description</TableCell>
                   <TableCell>{product.description}</TableCell>
                 </TableRow>

                 <TableRow>
                   <TableCell>Brand</TableCell>
                   <TableCell>{product.brand}</TableCell>
                 </TableRow>

                 <TableRow>
                   <TableCell>User Ratings</TableCell>
                   <TableCell>{product.rating}</TableCell>
                   <TableCell><Rating name="half-rating" size="medium" defaultValue={4.5} precision={0.5}/></TableCell>
                 </TableRow>

                 <TableRow>
                   <TableCell>Quantity In Stock</TableCell>
                   <TableCell>{product.quantityInStock}</TableCell>
                 </TableRow>

                 <TableRow>
                   <TableCell>Type</TableCell>
                   <TableCell>{product.typeofProduct}</TableCell>
                 </TableRow>
         
              </TableBody>
               </Table>
             </TableContainer>
   
   <Grid container spacing={1} sx={{mt: 1}}>
     <Grid item xs={6}>
       <TextField 
        value={quantity}
        onChange={handleInputQuantity}
        variant="outlined"
        fullWidth
        label="quantity"
        type="number"
       />
     </Grid>

     <Grid item xs={6}>
     <Button variant="contained"
     disabled ={items?.quantity === quantity}
        size="medium"
        color="warning" 
        fullWidth
        sx={{width: '100%', height: 55}}
        startIcon={<ShoppingCartCheckoutRounded sx={{color: '#fff'}}/>}
        onClick={handleUpdateCart}
        >{items ? "Update Cart" : "Add To Cart"}</Button>
     </Grid>
   </Grid>  
           </Grid>
        </Grid>
    )
}