export interface IPayment {
  _id: string;
  creator: ICreator;
  invoice: Iinvoice;
}
export interface IPaymentData {
  creator: ICreator;
  invoice: Iinvoice;
}

export interface Iinvoice {
  amount: number;
  phone: number;
  invoice_month: string;
  address_line1: string;
  address_line2: string;
  zip_code: string;
}

export interface ICreator {
  email: string;
  name: String;
}
