import { Basket } from "./Basket";

export interface User{
    email : string;
    Password : string;
    phoneNumber : string;
    userName : string;
    token : string;
    roles? : string[];
    basket? : Basket;
}