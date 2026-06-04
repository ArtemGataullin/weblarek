export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = "card" | "cash";
export type TOrderResponse = {
    id: string;
    total: number;
};

export type TBuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
}

export interface IOrderRequest extends IBuyer {
    total: number;
    items: string[];
};

export interface IProductListApi {
    items: IProduct[];
    total: number;
}