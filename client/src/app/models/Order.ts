export interface ShippingAddress {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface OrderItem {
    productId: number;
    name: string;
    pictureUrl: string;
    description: string;
    price: number;
    quantity: number;
    brand?: string;
    typeofProduct?: string;
}

export interface Order {
    id: number;
    buyerId: string;
    deliveryFees: number;
    shippingAddress: ShippingAddress;
    orderItems: OrderItem[];
    orderStatus: string;
    orderDate: string;
    subtotal: number;
    total: number;
}