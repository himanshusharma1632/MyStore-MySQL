import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import AppTextField from '../../app/components/AppTextField';
import { useFormContext } from 'react-hook-form';
import AppCheckBox from '../../app/components/AppCheckBox';

export default function AddressDetails() {
const {control, formState: {isDirty}} = useFormContext();
  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
     
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextField
          control={control}
           label="fullName"
           name="fullName"
           fullWidth={true}
          />
        </Grid>
        <Grid item xs={12}>
        <AppTextField
        control={control}
           label="Address Line 1"
           name="address1"
           fullWidth={true}
          />
        </Grid>
        <Grid item xs={12}>
        <AppTextField
           control={control}
           label= {"Address Line 2 Optional"}
           name="address2"
           fullWidth={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <AppTextField
           control={control}
           label= {"City"}
           name="city"
           fullWidth={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <AppTextField
           control={control}
           label= {"State"}
           name="state"
           fullWidth={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <AppTextField
           control={control}
           label= {"Country"}
           name="country"
           fullWidth={true}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <AppTextField
           control={control}
           label= {"Postal Code"}
           name="zipCode"
           fullWidth={true}
          />
        </Grid>
        <Grid item xs={12}>
          <AppCheckBox
           control ={control}
           disabled ={!isDirty}
           name ='saveAddress'
           label ="I want this address to be my default address from now on"
           />
        </Grid>
      </Grid>
    </Fragment>
  );
}