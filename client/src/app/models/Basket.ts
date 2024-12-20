export interface BasketItem {
    productId: number;
    quantity: number;
    name: string;
    price: number;
    brand?: string;
    typeofProduct?: string;
    pictureUrl: string;
}

export interface Basket {
    id: number;
    buyerId: string;
    items: BasketItem[];
    paymentIntentId? : string;
    clientSecretForStripe? : string;
}