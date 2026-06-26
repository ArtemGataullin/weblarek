import { Api, ApiListResponse} from "../base/Api";
import {IProduct, IOrderRequest, IProductListApi} from "../../types/index";

export class ServerApi extends Api{
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`)
        .then((data) => {
            const product = data as IProduct;
            return {
                ...product,
                image: this.cdn + product.image
            };
        });
}

    getItemList(): Promise<IProduct[]> {
    return this.get('/product')
        .then((data) => {
            const response = data as ApiListResponse<IProduct>;
            return response.items.map((item: IProduct) => ({
                ...item,
                image: this.cdn + item.image
            }));
        });
    }

    placeOrder(order: IOrderRequest): Promise<IProductListApi> {
    return this.post('/order', order)
        .then((data) => {
            const result = data as IProductListApi;
            return result;
        });
    }
}