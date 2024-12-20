import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/REDUX/configureStore";
import { toast } from "react-toastify";

interface Props {
 roles? : string[];
};

export default function RequireAuth ({roles} : Props) {
// using(s)
// 1.redux
const { user } = useAppSelector( state => state.account);

// 2. react-router-dom
const location = useLocation();

// function(s)
// 3.) content function(s)
// 3.a) return application redirection(s)
function AppRedirection () : JSX.Element {
switch (true) {
 case !user : return <Navigate to = {'/account/login'} state = {{ from : location }} />;
 case !!(roles && !roles.some(role => user?.roles?.includes(role))) : 
      { toast.error("You are not authorized to visit this area !!")
        return <Navigate to = {'catalog'} /> };
 default : return <Outlet />;
}; 
};

return AppRedirection();
}