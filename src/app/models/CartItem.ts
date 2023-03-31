import { FileHandle } from "./file-handle";
import { Product } from "./Product";

export class CartItem {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    unitsInStock?: number;
    category?: {
        id?: number;
        name?: string;
    };
    dateCreated?: Date;
    productImage?: FileHandle
}