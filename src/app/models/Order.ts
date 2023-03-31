import { CartItem } from "./CartItem";
import { Product } from "./Product";

export class Order {
    id?: number;
    orderNo?: string;
    orderDate?: string;
    totalQuantity?: number;
    total_amt?: number;
    products?: Product[];
}