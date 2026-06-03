export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = "card" | "cash" | "";
export type TOrderResponse = {
    id: string;
    total: number;
};

export type TBuyerValidationErrors = Partial<Record<keyof TBuyer, string>>;

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface TProduct{
    id: string;
    deccription: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface TBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface TOrderRequest extends TBuyer {
    total: number;
    items: string[];
};

export interface TOrderResultApi {
    items: TProduct[];
    total: number;
}