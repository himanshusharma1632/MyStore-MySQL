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
import agent from '../../../app/api/agent';
import { router } from '../../../Routes/Routes';


export default function Register() {
const { register, handleSubmit, setError, formState : {isSubmitting, isValid, errors}} = useForm({
  mode : 'all'
});

const handleErrors = (errors : any) => {
  if(errors){
   errors.forEach((error : any) => {
    if(error.includes('userName')){
      setError('userName', {message : error});
    }else if(error.includes('email')){
      setError('email', {message : error});
    }else if(error.includes('PhoneNumber')){
      setError('PhoneNumber', {message : error})
    }else if(error.includes('password')){
      setError('password', {message : error});
    }
   });
  }
}; 

  return (
      <Grid container spacing={0}
       component="main"
       sx={{ height: '80vh', mt: 9, p: 0, 
        justifyContent : 'center',
       }}>
        <Grid
          item
          xs={false}
          lg={6}
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
            borderBottomLeftRadius : '10px',
            height : 'auto',
          }}
        />
        <Grid item xs={12} sm={8} md={5} lg={6}
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
            <Box component="form" noValidate 
            onSubmit=
            {handleSubmit((data : FieldValues) => agent.Account.register(data)
             .then(() => router.navigate('Login'))    
             .catch((error : any) => handleErrors(error)))} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                type ='text'
                label="Username"
                autoComplete="username"
                autoFocus = {true}
                {...register('userName', {
                  required : 'username is required!'
                })}
                placeholder="Enter a username"
                error={!!errors?.userName}
                helperText ={errors?.userName?.message?.toString()}
              />
               <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                {...register('Email', {
                  required : 'cannot leave Email as empty!',
                  pattern : /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/
                })}
                autoFocus ={true}
                placeholder = "Enter your Email ID"
                error={!!errors?.Email}
                helperText ={errors?.Email?.message?.toString()}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contact Info."
                type="tel"
                {...register('PhoneNumber', {
                  required : 'Please provide phone number for better delivery exp.',
                  pattern : /(\s*\(?0\d{4}\)?(\s*|-)\d{3}(\s*|-)\d{3}\s*)|(\s*\(?0\d{3}\)?(\s*|-)\d{3}(\s*|-)\d{4}\s*)|(\s*(7|8)(\d{7}|\d{3}(\-|\s{1})\d{4})\s*)/
                })}
                autoFocus ={true}
                placeholder = "Your 10 digits phone no."
                error={!!errors?.PhoneNumber}
                helperText ={errors?.PhoneNumber?.message?.toString()}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register('Password', {
                  required : 'cannot leave the password empty!',
                  pattern : /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
                })}
                autoFocus ={true}
                placeholder = "Enter a password"
                error={!!errors?.Password}
                helperText ={errors?.Password?.message?.toString()}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isSubmitting}
                disabled={!isValid}
              >
               {"Register"} 
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
