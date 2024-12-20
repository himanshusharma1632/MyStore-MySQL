import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/Basket";

interface StoreContextValue{
basket: Basket | null;
setBasket : (basket: Basket)=> void;
removeItem : (productId : number, quantity: number)=> void;
}

//creating a storeContext
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStoreContext(){
const context = useContext(StoreContext);
if(context === undefined) {
throw Error ("We are Not Inside the Provider !");
}
return context;
}

export function StoreContextProvider({children}: PropsWithChildren<any>){
    //for getting the basket
    const [basket, setBasket] = useState<Basket | null>(null);

    //for removing the basket
function removeItem(productId: number, quantity: number){
    if(!basket) return;
    //spread the items into the basket
    const items = [...basket.items];
    const IndexItem = items.findIndex( i => i.productId=== productId);
    if(IndexItem >= 0){
        items[IndexItem].quantity -= quantity;
        if(items[IndexItem].quantity === 0)
        items.splice(IndexItem, 1);
        
        setBasket(prevState => {
            return{...prevState!, items}
        })
    }  
    
}

return(
    <StoreContext.Provider value ={{basket, setBasket, removeItem}}>
        {children}
   </StoreContext.Provider>
)
} 