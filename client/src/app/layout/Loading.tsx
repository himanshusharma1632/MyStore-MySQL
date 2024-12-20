import { Box, Container, Divider, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface Props{
    message? : string;
}

export default function Loading({message="आपका उत्पाद लोड हो रहा है"}: Props){
    
    return(
        <Container>
          <Backdrop invisible ={true} open ={true}>
              <Box display ='flex' alignItems = 'center' justifyContent ='center'>
          <CircularProgress color='secondary' size={60} />
          <Typography variant ='h5' sx={{color: 'ThreeDShadow', position: 'fixed' , top: '55%'}}>{message}</Typography>
          </Box>    
              </Backdrop>     
   </Container>
    )
}