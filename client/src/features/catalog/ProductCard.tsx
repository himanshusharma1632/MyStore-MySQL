import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { Shop2Rounded, ShoppingCartCheckoutRounded } from "@mui/icons-material";
import { useState } from "react";
import agent from "../../app/api/agent";

import { setBasket } from "../BasketPage/BasketSlice";
import { useAppDispatch } from "../../app/REDUX/configureStore";

interface Props {
    product: Product;
}



export default function ProductCard({product}: Props){

const[loading, setloading] = useState(true);
const dispatch = useAppDispatch();

function HandleAddItem(productId: number){
  setloading(true);
  agent.BasketFetcher.AddBasketItem(productId)
  .then(basket => dispatch(setBasket(basket)))
  .catch(error=> console.log(error))
  .finally(()=> setloading(false));
}

    return(
        <Card sx={{cursor: 'pointer'}}>
        <CardHeader
            avatar={
             <Avatar sx={{bgcolor: 'secondary.main'}}>
               {product.name.charAt(0).toUpperCase()}
             </Avatar>
              
            }
            title={product.name}
            titleTypographyProps={{
              sx:{fontWeight: 'bold', color: 'primary.main'}
            }}
        />

<CardMedia
          sx={{height: '140', backgroundPosition:'center', backgroundSize:'contain', bgcolor: 'secondary.light', cursor: 'pointer'}}
          component="img"
          
          image={product.pictureUrl}
          alt="green iguana"
        />

        <CardContent>
          <Typography gutterBottom color="secondary" variant="h5">
          </Typography>
          <Typography variant="body2" color="text.secondary">
           {product.brand} / {product.typeofProduct}
           </Typography>
           <Typography component="div" gutterBottom>
             {product.quantityInStock}
             </Typography>
             <Typography gutterBottom variant='h6' sx={{color: 'secondary.main'}}> 
              ₹{(product.price/100).toFixed(2)}
             </Typography>
        </CardContent>
        <CardActions>
          <Button variant='contained'
           color="primary" 
          size="small" 
          onClick={()=> HandleAddItem(product.id)}
          startIcon={<Shop2Rounded sx={{color: '#fff'}}
           />}>
             Cart
           </Button>
          <Button
          component={Link}
          to={`/catalog/${product.id}`}
           variant='contained'
           color="error" 
           size="small" 
           sx={{ml: 1}}
           endIcon={<ShoppingCartCheckoutRounded sx={{color: '#fff'}}
            />}>
              View Details</Button>
        </CardActions>
      </Card>
      
    )
}