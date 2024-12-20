import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../app/layout/App";
import Register from "../features/account/Register/Register";
import Login from "../features/account/Login/Login";
import Catalog from "../features/catalog/Catalog";
import AboutPage from "../features/about/AboutPage";
import ContactPage from "../features/Contact/ContactPage";
import CollectionPage from "../features/Collections/CollectionPage";
import ServerError from "../app/error/ServerError";
import BasketPage from "../features/BasketPage/BasketPage";
import OrdersPage from "../features/Order/OrdersPage";
import ProductDetails from "../features/catalog/ProductDetails";
import OrderDetails from "../features/Order/OrderDetails";
import NotFound from "../app/error/NotFound";
import RequireAuth from "./RequireAuth";
import CheckoutWrapper from "../features/CheckoutPage/CheckoutWrapper";
import Inventory from "../features/admin/Inventory";

export const routes : RouteObject[] = [
{ path : '/',
  element : <App />,
  children : [ 
    // below are the pages accessed only when user logs in (all user-role(s))
   { element : <RequireAuth />, children : [
    { path : "/checkout", element : <CheckoutWrapper /> }, // checkout page
    { path : "order", element : <OrdersPage /> }, // orders page
    { path : "order/:id", element : <OrderDetails /> }, // order-details page
   ]},

   // below are the pages accessed only when user is an "Admin"
   { element : <RequireAuth roles = {["Admin"]} />, children : [
    { path : "inventory", element : <Inventory /> }, // inventory page (only admin authorized)
   ]},

   // below are the pages accessed for all new visitors
   { path : "account/register", element : <Register /> }, // Register page
   { path : "account/login", element : <Login /> }, // Login page
   { path : "catalog", element : <Catalog /> }, // catalog page
   { path : "catalog/:id", element : <ProductDetails /> }, // product-details page
   { path : "about", element : <AboutPage /> }, // about page
   { path : "contact", element : <ContactPage /> }, // contact page
   { path : "collections", element : <CollectionPage /> }, // collections page
   { path : "server-error", element : <ServerError /> }, // server-error page
   { path : "basket", element : <BasketPage /> }, // basket page
  
   { path : "not-found", element : <NotFound /> }, // not-found page
   { path : "*", element : <Navigate replace to = {'/not-found'} />, },
  ]}
];

// exporting all routes
export const router = createBrowserRouter(routes);
