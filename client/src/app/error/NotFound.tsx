import { Container, Paper, Typography } from "@mui/material";

export default function NotFound(){
    return(
        <Container component ={Paper} sx={{height : 500,  backgroundColor: 'InfoBackground', mt: 10}} >
        <Typography variant ='h4' sx={{color: 'HighlightText'}}>
            Oops! Your required page is not Found :(
        </Typography>
        </Container>
    )
}