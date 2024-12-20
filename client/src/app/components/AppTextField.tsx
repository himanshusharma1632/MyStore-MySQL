import { TextField } from "@mui/material";
import { Fragment } from "react";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps{
    label : string;
    fullWidth : boolean;
    multiline? : boolean;
    rows? : number;
    type? : string;
}

export default function AppTextField(props : Props){
const {field, fieldState} = useController({...props, defaultValue : ''});
    return (
        <Fragment>
            <TextField 
            {...props}
            {...field}
            variant='outlined'
            type = {props.type}
            multiline = {props.multiline}
            rows = {props.rows}
            error={!!fieldState.error}
            helperText ={fieldState.error?.message}
            />
        </Fragment>
    )
}