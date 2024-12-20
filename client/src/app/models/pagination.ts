export interface MetaData {
pageSize : number;
totalCount : number;
currentPage : number;
totalPages : number;
}

export class PaginatedResponse<T> { //to make pagination available throughout the application
items : T; //generic type of the item.
metaData : MetaData;

constructor (items : T, metaData : MetaData) {
    this.items = items;
    this.metaData = metaData;
}}