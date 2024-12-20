export interface Product
{
        id: number;
        name: string;
        rating?: number;
        description: string;
        price: number;
        pictureUrl: string;
        new_Arrival?: string;
        typeofProduct?: string;
        brand: string;
        quantityInStock?: number;
    }

    export interface ProductParams {
        orderBy : string,
        searchTerm? : string, //this is optional
        pageNumber : number,
        pageSize : number,
        brandList? : string[], //this is optional
        typeList? : string[] //this is optional
    }