import { TBuyer, TPayment, TBuyerValidationErrors } from "../../types/index";

export class Buyer {
    protected data: TBuyer;

    constructor() {
        this.data = {
            payment: "",
            address: "",
            email: "",
            phone: "",
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

    getData(): TBuyer {
        return this.data;
    }

    clearBuyerData() {
        this.data = {
            payment: "",
            address: "",
            email: "",
            phone: "",
        };
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
}