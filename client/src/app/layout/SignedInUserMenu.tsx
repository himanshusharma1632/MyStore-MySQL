import { Email, ShoppingCartTwoTone, LogoutTwoTone, PhoneAndroid } from "@mui/icons-material";
import { Box, Tooltip, IconButton, Menu, MenuItem, Divider, ListItemIcon, Avatar, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { SignOutUser } from "../../features/account/accountSlice";
import { clearBasket } from "../../features/BasketPage/BasketSlice";
import { RootState, useAppDispatch, useAppSelector } from "../REDUX/configureStore";

export default function SignedInUserMenu() {
  const { user } = useAppSelector((state : RootState) => state.account);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar sx={{ width: 34, height: 34 }} >{(user?.userName)?.charAt(0).toUpperCase()}</Avatar>
          </IconButton>
        </Tooltip>
        <Typography variant='subtitle2' sx={{display: 'flex'}}>Welcome {user?.userName}</Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar src={"images/profiles/Thumbnail.png"} />
          {user?.userName}
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Email fontSize="small" />
          </ListItemIcon>
          {user?.email}
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PhoneAndroid fontSize="small" />
          </ListItemIcon>
          {user?.phoneNumber}
        </MenuItem>
        <MenuItem>
          <Link to={'order'} style={{textDecoration : 'none'}}>
          <ListItemIcon>
            <ShoppingCartTwoTone fontSize="small" />
          </ListItemIcon>
          My Orders
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem
        onClick={() =>{ dispatch(SignOutUser());
                        dispatch(clearBasket());                           
                      }}>
          <ListItemIcon>
            <LogoutTwoTone fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}