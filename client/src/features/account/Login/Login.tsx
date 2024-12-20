import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../app/REDUX/configureStore';
import { loginUserAsync } from '../accountSlice';
import { router } from '../../../Routes/Routes';


export default function Login() {
const location = useLocation();
const dispatch = useAppDispatch();
const { register, handleSubmit, formState : {isSubmitting, isValid, errors}} = useForm({
  mode : 'all'
});

const submitForm = async (data : FieldValues) => {
  await dispatch(loginUserAsync(data));
  router.navigate(location.state?.from?.pathname || 'catalog');
};

  return (
      <Grid container spacing={0}
       component="main"
       sx={{ height: '80vh', mt: 12,
        justifyContent : 'center',
       }}>
        <Grid
          item
          xs={false}
          lg={5}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius : '10px',
            borderBottomLeftRadius : '10px' 
          }}
        />
        <Grid item xs={12} sm={8} md={5} lg={5}
         component={Paper}
         sx={{borderTopRightRadius : '10px', borderBottomRightRadius : '10px'}}
         elevation={0}
         square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(submitForm)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                type ='text'
                label="Username"
                autoComplete="username"
                autoFocus = {true}
                {...register('username', {
                  required : 'username is required!'
                })}
                placeholder="Enter a username"
                error={!!errors?.username}
                helperText = {errors?.username?.message?.toString()}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register('password', {
                  required : 'cannot leave the password empty!'
                })}
                autoFocus ={true}
                placeholder = "Enter a password"
                error={!!errors?.password}
                helperText = {errors?.password?.message?.toString()}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isSubmitting}
                disabled={!isValid}
              >
               {"Login"} 
              </LoadingButton>
              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
  );
}
