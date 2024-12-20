import { ErrorOutline } from "@mui/icons-material";
import { Alert, AlertTitle, Button, ButtonGroup, Container, Grid, List, ListItem, ListItemText, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";


export default function AboutPage(){
 const [open, setOpen] = useState(false);

 const [Validateit, setValidateit] = useState<string[]>([]);
 const [loading, setloading] = useState(false);

const loadit =()=>{
  setloading(true);
}


 function showValidateit(){
   agent.TestError.GetValidationError()
   .then(()=> console.log("This error is not visible in console"))
   .catch(error=> setValidateit(error))
 };

 function openit(){
        return setOpen(true)
    };

    const Closeit =()=>{

         setOpen(false);
    }

    if (loading) return <Loading />


return(




    <Container>
 <Typography variant ='h3' sx={{mt: 10}}> This is the error generator page
 </Typography>
 <ButtonGroup>
 <Button variant ="contained" size="small" color="secondary" sx={{mt: 2}}
 onClick= {()=> agent.TestError.GetBadRequest().catch(error=> console.log(error))}>Test Bad Request error</Button>


<Button variant ="contained" size="small" color="primary" sx={{mt: 2, ml: 4}}
 onClick= {()=> agent.TestError.GetServerError().catch(error=> console.log(error))}
 >Test Server error- 500</Button>
 <Button variant ="contained" size="small" color="warning" sx={{mt: 2, ml: 4}}
 onClick= {()=> agent.TestError.GetNotFound().catch(error=> console.log(error))}
 >Test Not Found Error</Button>

<Button variant ="contained" size="small" color="error" sx={{mt: 2, ml: 4}}
 onClick= {showValidateit}
  startIcon={<ErrorOutline sx={{bgcolor: 'inherit'}}/>}
  >Test validation Error</Button>
  
  <Button variant ="contained" color="warning" size="small" onClick={openit} sx={{mt: 2, ml: 4}}>Snack Generator</Button>
  <Button variant ="contained" color ="warning" onClick ={loadit} >Load</Button>
</ButtonGroup>

{Validateit.length >0 &&
<Alert>
  <AlertTitle>Validation Error</AlertTitle>
  <List>
    {Validateit.map(error=>
    <ListItem key={error}><ListItemText>{error}</ListItemText>
    </ListItem>
    )};
  </List>
  </Alert>
}


<Grid container spacing={4}>
     <Grid item xs={6}>
     <Snackbar autoHideDuration={5000} open={open} onClose={Closeit}>
  <Alert  severity="success" sx={{ width: '100%' }}>
    This is a success message!
  </Alert>
</Snackbar>
     </Grid>
 </Grid>

 </Container>

 
)

}