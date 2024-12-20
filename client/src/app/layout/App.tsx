import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline } from "@mui/material";
import Header from "./Header";
import { useCallback, useEffect, useState } from "react";
import { Outlet, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./Loading";
import { fetchBasketAsync } from "../../features/BasketPage/BasketSlice";
import { useAppDispatch } from "../REDUX/configureStore";
import { fetchUserAsync } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";

function App() {
 
const [initializing, setinitializing] = useState(true);

const location = useLocation(); // using react-router-dom
const dispatch = useAppDispatch();
const [darkMode , setDarkMode]= useState(false);

const InitializeApplication = useCallback(async () => {
  try{
       await dispatch(fetchUserAsync());
       await dispatch(fetchBasketAsync());
  }catch(error : any){
    console.log(error);
  }}, [dispatch]);

useEffect(()=>{
InitializeApplication().then(() => setinitializing(false));
}, [InitializeApplication])

  const paletteType= darkMode ? 'dark' : 'light';
  const theme= createTheme({
    palette : {
     mode : paletteType, 
     background: {
       default: paletteType=== 'light' ? '#eaeaea' : '#121212'
     }
    },
  })

  function HandleThemeChange(){
    setDarkMode(!darkMode);
  }
  

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position ='bottom-right' hideProgressBar />
    <CssBaseline/>
     <Header darkMode={darkMode} HandleThemeChange={HandleThemeChange} />
     {initializing ? <Loading message="Staging App ..." />
                   : location.pathname === '/' ?  <HomePage />
                   : ( <Container sx = {{ mt : 9 }}>
                         <Outlet />
                       </Container> )}
     </ThemeProvider>
  );
}
export default App;

