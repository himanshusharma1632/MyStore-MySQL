import { InputBaseComponentProps } from '@mui/material';
import { forwardRef, Ref, useImperativeHandle, useRef } from 'react';

interface Props extends InputBaseComponentProps{};

export const StripeInput = forwardRef(function StripeInput({component : Component, ...props} : Props,
ref : Ref<unknown>){

//this is the reference which is going to get catched
const destinationEl = useRef<any>();
//so basically we are forwaring our reference from Material Ui's text input field to StripeInput Field

useImperativeHandle(ref, () => ({
    focus : () => destinationEl.current.focus 
}));


return ( 
    <Component 
     onReady = {(element : any) => destinationEl.current = element}
     {...props}
    />
)});
