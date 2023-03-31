import { Category } from "./Category";
import { FileHandle } from "./file-handle";

export class Product {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inShellStock?: number;
    currentStock?: number;
    category?: Category[];
    dateCreated?: Date;
    productImage?: FileHandle
}