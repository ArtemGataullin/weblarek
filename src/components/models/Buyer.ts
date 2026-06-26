import { IBuyer, TPayment, TBuyerValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  protected data: IBuyer;

  constructor(protected events: IEvents) {
    this.data = {
      payment: "",
      address: "",
      email: "",
      phone: "",
      total: 0,
      items: [],
    };
  }

  savePaymentType(payment: TPayment) {
    this.data.payment = payment;
  }

  saveAddress(address: string) {
    this.data.address = address;
  }

  saveEmail(email: string) {
    this.data.email = email;
  }

  savePhone(phone: string) {
    this.data.phone = phone;
  }

  getData(): IBuyer {
    return this.data;
  }

  validate(): TBuyerValidationErrors {
    const errors: TBuyerValidationErrors = {};

    if (!this.data.payment.trim()) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.data.address.trim()) {
      errors.address = "Не указан адрес";
    }

    if (!this.data.email.trim()) {
      errors.email = "Не указан email";
    }

    if (!this.data.phone.trim()) {
      errors.phone = "Не указан телефон";
    }

    return errors;
  }

  clearBuyerData() {
    this.data = {
      payment: "",
      address: "",
      email: "",
      phone: "",
      total: 0,
      items: [],
    };
  }
}