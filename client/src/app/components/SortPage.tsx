import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Fragment } from "react";

interface Props {
    options : any[];
    selectedValue : string;
    onChange : (event : any) => void;
    
}

export default function SortPage({options, selectedValue, onChange} : Props) {
    return (
        <Fragment>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Sort Items By</FormLabel>
                            <RadioGroup onChange={onChange} value={selectedValue}>
                                {options.map(({ value, label }) => (
                                    <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                                ))}
                            </RadioGroup>
                        </FormControl>
        </Fragment>
    )
}