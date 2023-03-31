import { Product } from "./Product";

export class OrderDetails {
    id?: number;
    orderNo?: string;
    orderDate?: string;
    totalQuantity?: number;
    total_amt?: number;
    productDto?: Product[];
}