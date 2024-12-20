import { Box, Button, Grid, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import AddressDetails from "./AddressDetails";
import NewPayment from "./NewPayment";
import OrderReview from "./OrderReview";
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from "./ValidationSchema";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import { clearBasket } from "../BasketPage/BasketSlice";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Loading from "../../app/layout/Loading";

const steps = ['Shipping address', 'Review your order', 'Payment details'];

export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState(0);
    //once the order is sent to the API Server, we would set the order number inside the local state
    const [orderNumber, setOrderNumber] = useState(0);
    //also adding some loading indicators
    const [loading, setLoading] = useState<boolean>(false);
    const currentValidation = validationSchema[activeStep]; //we can easily find array index as array[]
    const method = useForm({
        mode : 'all',
        resolver : yupResolver(currentValidation)
    });
    //dispatching the action
    const dispatch = useAppDispatch();
    //validations objects
    const [cardState, setCardState] = useState<{ElementError : {[key in StripeElementType]? : string}}>({
    ElementError : {}
    });
   //checking if input is filled or not
   const [complete, setComplete] = useState<any>({
    cardNumber : false,
    cardExpiry : false,
    cardCvC : false
   });
   // final submission of the order
   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
   // displaying the error message when payment is not succeed
   const [message, setMessage] = useState<string>('');
   // importing elements from stripe pcp
   const elements = useElements();
   // importing stripe itself
   const stripe = useStripe();
   // importing basket 
   const { basket } = useAppSelector(state => state.basket);


   const submitStripePayment = async (data : FieldValues) => {
    const {saveAddress, nameOnCard, ...shippingAddress} = data; //destructures saveAddress and nameOnCard into its own property to use them seperately
    if (!stripe || !elements) return;
    try {
    const card = elements.getElement(CardNumberElement);
    const resultPayment = await stripe.confirmCardPayment(basket?.clientSecretForStripe!, {
        payment_method : {
           card : card!,
           billing_details : {
            name : nameOnCard,
          //  address : shippingAddress
           } 
        }
    });
    if (resultPayment.paymentIntent?.status === 'succeeded'){
     setLoading(true);
     const orderNumber = await agent.Orders.createOrder({saveAddress, shippingAddress});
     setOrderNumber(orderNumber); //this will assign the particular order number of what we received from the API
     setPaymentSuccess(true);
     setMessage("Thank you, we have received your payment. Please check order details for shipping and delivery ..."); //when payment is succeeded
     setActiveStep(activeStep + 1); // move to the next page
     dispatch(clearBasket());  // emptying the basket
     setLoading(false); //finally set the loading flag as falses

    }else{
        setMessage(resultPayment.error?.message!); // showing the error message when not succeed payment
        setPaymentSuccess(false); // making payment success as true
        setLoading(false); // making loading state to false
        setActiveStep(activeStep + 1); // still moving to next step to show the unsuccess payment message
        
    }}catch(error : any){
    console.log(error);
    setLoading(false);
   }};

  
  //function for handling card input validations
   const handleCardInput = (event : any) => {
   setCardState({
    ...cardState, 
     ElementError : {
      ...cardState.ElementError, 
      [event.elementType] : event.error?.message
    }
    });
   setComplete({
    ...complete, 
    [event.elementType] : event.complete
  })};
  
//getting individual steps
function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <AddressDetails/>;
        case 1:
            return <OrderReview />;
        case 2:
            return <NewPayment 
                    handleCardInput = {handleCardInput}
                    cardState = {cardState}
                   />;
        default:
            throw new Error('Unknown step');
    }
};

//as a side effect we are calling the saved address for the user
useEffect(() => {
    try{
        agent.Account.savedAddress()
        .then(response => {
            if (response){
                method.reset({...method.getValues(), ...response, saveAddress : false});
            }
        })
    }catch(error : any){
        console.log(error);
    }
}, [method]);

    const handleNext = async (data : FieldValues) => {
        if(activeStep === steps.length - 1){
         await submitStripePayment(data); //await for the function to make payment to the stripe server
        }else{
        setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    function submitDisabled () : boolean  {
     if (activeStep === steps.length - 1) {
      return !method.formState.isValid ||
             !complete.cardNumber ||
             !complete.cardCvc ||
             !complete.cardExpiry;
    }else {
      return !method.formState.isValid;
    }};

if (loading) return <Loading message = {"Securely paying to MyStore. This could take a moment, please ..."} />
    return (
        <FormProvider {...method}>
        <Grid container spacing={2} sx={{justifyContent: 'center', alignItems : 'center', display: 'flex'}}>
            <Grid item xs={12} lg={activeStep === steps.length - 2 ? 12 : 9} sx={{p : 2}}>
        <Paper elevation={0} sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3, lg: 4}, mt: {lg : 11}}}>
            <Typography component="h1" variant="h4" align="center">
                Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                        <>
                         <Typography variant="h5" gutterBottom>
                            {message}
                         </Typography>
                         { paymentSuccess ? (
                         <Typography variant="subtitle1">
                            Your order number is #{orderNumber}. We have emailed your order
                            confirmation, and will send you an update when your order has
                            shipped.
                          </Typography>
                       ) : (
                        <>
                          <Grid item
                           xs = {12}
                           justifyContent = 'center'
                           alignItems = 'center'
                           >
                               <Button sx = {{
                                 m : 2,
                               }} variant = 'contained' onClick={handleBack}>
                                Go back and continue ...
                               </Button>
                          </Grid>
                        </>
                       )}
                    </>
                ) : (
                    <>
                    <form onSubmit={method.handleSubmit(handleNext)}>
                        {getStepContent(activeStep)}
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                    Back
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                type='submit'
                                sx={{mt: 3, ml: 1}}
                                disabled ={submitDisabled()}
                            >
                                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                            </Button>
                        </Box>
                        </form>
                    </>
                )}
            </>
        </Paper>
        </Grid>
    </Grid>
    </FormProvider>
    );
}
