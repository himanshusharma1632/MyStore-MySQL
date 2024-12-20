import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Fragment, useEffect, useState } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/REDUX/configureStore";
import { setBasket } from "../BasketPage/BasketSlice";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe('pk_test_51LrxX0SCirXTevcI8IULsOlbxoIcFvQ310PRjHKpQHsYWIX0FIZ9oY9hJqF5pAKuMZzKNAp2axw0HGvNgorcAC8Z00ft2NQFsz');

export default function CheckoutWrapper () {
//importing basket
const { basket } = useAppSelector(state => state.basket);
const dispatch = useAppDispatch();
const [loading, setLoading] = useState<boolean>(true);

//async adding the payment intent to basket into client side as well...
const awaitPaymentIntent = async () => {
    try {
         await agent.Payments.createIntent()
        .then((basket) => dispatch(setBasket(basket)))
        .catch((error : any) => console.log(error))
        .finally(() => setLoading(false))
        }catch(error : any){
            console.log(error, 'failed to add payment intent to the basket!');
            setLoading(false);
        }
    }

useEffect(() => {
  awaitPaymentIntent(); 
}, [dispatch]);

if (loading) return <Loading message = {"Taking you to checkoutPage, please wait ..."}/>

    return (
        <Fragment>
        <Elements stripe={stripePromise}>
         <CheckoutPage />
        </Elements>
        </Fragment>
    )
}