import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Fragment, useState } from "react";

interface Props {
    checked? : string[];
    onChange : (items : string[]) => void;
    items: string[];
}

export default function CheckboxButtons ({checked, onChange, items} : Props) {

const [selectedItem, setSelectedItem] = useState(checked || []);

function handleCheckedItem (value : string) {
const currentIndex = selectedItem.findIndex(item => item === value);
let newCheckedItem : string[] = [];
if (currentIndex === -1) newCheckedItem = [...selectedItem, value];
else newCheckedItem = selectedItem.filter(item => item !== value); //if it is already checked then uncheck it
setSelectedItem(newCheckedItem);
console.log(newCheckedItem)
onChange(newCheckedItem);
console.log(newCheckedItem, 'State Updated');

}
    return  (
        <Fragment>
               <FormGroup>
                            {items.map(item => (
                            <FormControlLabel control={<Checkbox 
                                checked ={selectedItem.indexOf(item) !== -1}
                                onClick={() => handleCheckedItem(item)}
                                />} label={item} key={item} />
                            ))}
                        </FormGroup>
        </Fragment>

    )
}