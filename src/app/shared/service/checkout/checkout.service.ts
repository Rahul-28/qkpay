import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaymentData } from '../../models/payment.model';
import {
  StripePaymentElementComponent,
  StripeServiceInterface,
} from 'ngx-stripe';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly apiUrl = `${environment.api_url}/stripe/create-payment`;
  private readonly domainUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) {}

  createPaymentIntent(payment: IPaymentData): any {
    const payload = {
      amount: payment.invoice.amount,
      customer: payment.creator,
    };
    return this.http.post(`${this.apiUrl}`, payload);
  }

  handlePayment(
    clientSecret: string,
    paymentDetails: IPaymentData,
    paymentElements: StripePaymentElementComponent,
    stripe: StripeServiceInterface
  ) {
    const { name, email } = paymentDetails.creator;
    const { address_line1, address_line2, zip_code } = paymentDetails.invoice;

    return stripe.confirmPayment({
      clientSecret: clientSecret,
      elements: paymentElements.elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: name as string,
            email: email as string,
            address: {
              line1: address_line1 as string,
              line2: address_line2 as string,
              postal_code: zip_code as string,
            },
          },
        },
        return_url: `${this.domainUrl}/response/success`,
      },
      redirect: 'if_required',
    });
  }
}
