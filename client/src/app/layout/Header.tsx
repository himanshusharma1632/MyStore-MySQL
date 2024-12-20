import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, FormControlLabel, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { RootState, useAppSelector } from "../REDUX/configureStore";
import SignedInUserMenu from "./SignedInUserMenu";


interface Props{
    darkMode: boolean;
    HandleThemeChange: ()=> void;
}

const MidLinks=[
    {title: 'Catalog', path: '/catalog'}, 
    {title: 'About', path: '/about'}, 
    {title: 'Contact', path: '/contact'},
    {title: 'Collections', path: '/collections'},
]

const RightLinks=[
    {title : 'Login', path: '/account/Login'},
    {title : 'Register', path: '/account/Register'}, 
]

const NavStyles={
    color: 'inherit', 
    typography: 'h6',
    '&:hover' :{
             color: 'warning.main'
             },
   '&.active' : {
             color: 'grey.500'
         },
         textDecoration: 'none'  

                
}



export default function Header({ darkMode, HandleThemeChange}: Props){
const { user } = useAppSelector((state : RootState) => state.account);
const { basket } = useAppSelector((state : RootState) => state.basket);
const CountBasket = basket?.items.reduce((sum, items)=> sum + items.quantity, 0);

    return(
        <AppBar position='fixed' sx={{mb: 9}}>
            <Toolbar 
            sx={{display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',     
                      }}>

             <Box display='flex'
             alignItems='center'>
                <Typography variant='h6'
                   component = {NavLink}
                   to='/'
                   sx={NavStyles}  
                >
                    My-Store
                </Typography>
                <FormControlLabel control={<Switch checked={darkMode} onChange={HandleThemeChange} color="warning"  sx={{ml: 2}} />} label="Dark Mode" />
            </Box>

            

                <List sx={{display: 'flex'}}>
                  {MidLinks.map(({title, path})=>(
                  <ListItem
                   component={NavLink}
                   key={path}
                   to={path}
                   sx={NavStyles}
                   >
                   {title.toUpperCase()}
                </ListItem>
                ))}

                {user && user.roles?.includes("Admin") &&
                   <ListItem
                   component = {NavLink}
                   to={'/inventory'}
                   sx={NavStyles}
                   >
                   {'INVENTORY'}
                </ListItem> }
                </List>

          <Box display='flex'
               alignItems='center'
                >
            {user ? (
                <SignedInUserMenu />
            ) : (
                <List sx={{display: 'flex'}}>
                {RightLinks.map(({title, path})=>(
                 <ListItem
                  component={NavLink}
                  key={path}
                  to={path}
                  sx={NavStyles}
                 >
                 {title.toUpperCase()}
                 </ListItem>
               ))}
            </List>
            )}
            <IconButton size='large' 
            sx={{color: 'inherit'}}
            component={Link}
            to='basket'
            >
                    <Badge badgeContent={CountBasket} color='warning'>
                        <ShoppingCart />
                    </Badge>
                    </IconButton>

          </Box>


            </Toolbar>
           
        </AppBar>
    )
}


