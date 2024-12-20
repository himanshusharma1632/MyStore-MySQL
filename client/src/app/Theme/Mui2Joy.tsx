import { extendTheme as extendJoyTheme } from "@mui/joy";
//import { useColorScheme, experimental_extendTheme as extendMuiTheme } from '@mui/material';
import { deepmerge } from "@mui/utils";

const joyTheme = extendJoyTheme({

});

//const muiTheme = extendMuiTheme();
const theme = deepmerge(joyTheme, '')

export default theme;