import { IApi, IOrderRequest, TOrderResponse, IProductListApi } from "../../types/index";

export class ServerApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductListApi> {
    return this.api.get<IProductListApi>("/product/");
  }

  postOrder(orderRequest: IOrderRequest): Promise<TOrderResponse> {
    return this.api.post<TOrderResponse>('/order/', orderRequest);
  }
}