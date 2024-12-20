import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import { TextField } from '@mui/material';
import AppTextField from '../../app/components/AppTextField';
import { useFormContext } from 'react-hook-form';
import { StripeInput } from './StripeInputComponent';
import { StripeElementType } from '@stripe/stripe-js';

interface Props {
  cardState : {ElementError : {[key in StripeElementType]? : string}};
  handleCardInput : (event : any) => void;
}

export default function NewPayment({cardState, handleCardInput} : Props) {
const { control } = useFormContext();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
         <AppTextField
          control={control}
          name ='cardHolderName'
          label='Name On Card'
          fullWidth ={true}
             />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id = 'cardNumber'
            label="Card number"
            autoComplete = "cc-number"
            variant= 'outlined'
            fullWidth
            onChange = {handleCardInput}
            error = {!!cardState.ElementError.cardNumber}
            helperText = {cardState.ElementError.cardNumber}
            InputLabelProps={{
              shrink : true
            }}
            InputProps = {{
              inputComponent : StripeInput,
              inputProps : {
                component : CardNumberElement
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id = 'expDate'
            label="Expiry date"
            variant= 'outlined'
            fullWidth
            onChange = {handleCardInput}
            error = {!!cardState.ElementError.cardExpiry}
            helperText = {cardState.ElementError.cardExpiry}
            InputLabelProps={{
              shrink : true
            }}
            InputProps = {{
              inputComponent : StripeInput,
              inputProps : {
                component : CardExpiryElement
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id = ''
            label="CVV"
            variant= 'outlined'
            fullWidth
            onChange = {handleCardInput}
            error = {!!cardState.ElementError.cardCvc}
            helperText = {cardState.ElementError.cardCvc ? cardState.ElementError.cardCvc : "Last three digits on signature strip"}
            InputLabelProps={{
              shrink : true
            }}
            InputProps = {{
              inputComponent : StripeInput,
              inputProps : {
                component : CardCvcElement
              }
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}