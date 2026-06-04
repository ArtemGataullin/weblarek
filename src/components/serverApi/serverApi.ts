import { IApi, IOrderRequest, TOrderResponse, IProductListApi } from "../../types/index";

export class ServerApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductListApi> {
    return this.api.get<IProductListApi>("/product/");
  }

  async postOrder(orderRequest: IOrderRequest): Promise<TOrderResponse> {
    return this.api.post<TOrderResponse>('/order/', orderRequest);
  }
}