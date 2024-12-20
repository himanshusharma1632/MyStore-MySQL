import { Button, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router";
import { router } from "../../Routes/Routes";



export default function ServerError(){

    const {state} = useLocation();

    return(
        <Container component ={Paper} sx={{mt: 10}}>
            {state?.error ? (
                <>
                <Typography variant ='h5' color='warning.main'>{state.error.title}</Typography>
                <Divider sx={{mt: 2, mb: 2, p:1}} />
                <Typography variant ='subtitle1'>{state.error.detail || 'This is an Internal Server Error'}</Typography>
                </>
            ):(
                <Typography variant ='h6'>Server Error</Typography>
            )}
            <Grid container spacing={3} sx={{mt: 2, p: 2, justifyContent: 'center'}}>
            <Button variant ='contained' onClick ={()=> router.navigate('/catalog')} >Go Back to Catalog</Button>
            </Grid>
        </Container>
        
    )
}