import { IApi, TOrderRequest, TOrderResponse, TOrderResultApi } from "../../types/index";

export class ServerApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<TOrderResultApi> {
    return this.api.get('/product/');
  }

  async postOrder(orderRequest: TOrderRequest): Promise<TOrderResponse> {
    return this.api.post('/order/', orderRequest);
  }
}