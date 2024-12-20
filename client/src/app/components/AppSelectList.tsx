import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
 label : string;
 items : string[];
}; 

export default function AppSelectList(props : Props) {
const { field, fieldState } = useController({ ...props, defaultValue : '' });

    return (
        <FormControl error = {!!fieldState.error} fullWidth>
            <InputLabel >{props.label}</InputLabel>
            <Select {...props} {...field}>
                {props.items.map((item, index) => (<MenuItem key = {index} value={item}>{item}</MenuItem>))}
            </Select>
         <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}