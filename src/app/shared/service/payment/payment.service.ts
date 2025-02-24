import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iinvoice, IPayment, IPaymentData } from '../../models/payment.model';
import { IAccount } from '../../models/account.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly apiUrl = `${environment.api_url}/payments`;
  private account!: IAccount;
  userIdentity = JSON.parse(localStorage.getItem('loggedAccount') as string);

  constructor(private http: HttpClient) {
    console.log(this.userIdentity);
  }

  createPayment(invoiceData: Iinvoice): Observable<IPayment | void> {
    console.log('invoiceData', invoiceData);

    if (!invoiceData || !this.userIdentity || this.userIdentity === 'null') {
      console.error('Invalid invoiceData or user identity');
      throw new Error('Invalid invoiceData or user identity');
    }

    this.account = this.userIdentity as IAccount;
    const { email, name } = this.account;

    const payment: IPaymentData = {
      creator: { email, name },
      invoice: invoiceData,
    };

    console.log('payment', payment);

    return this.http.post<IPayment>(`${this.apiUrl}`, payment);
  }

  updatePayment(
    invoiceData: Iinvoice,
    paymentData: IPayment
  ): Observable<IPayment | void> {
    if (
      !invoiceData ||
      (!this.userIdentity &&
        this.userIdentity!.email !== paymentData.creator.email)
    ) {
      console.warn('Invalid invoiceData or user identity');
      return of();
    }

    this.account = this.userIdentity as IAccount;
    const { email, name } = this.account;

    const payment: IPaymentData = {
      creator: { email, name },
      invoice: invoiceData,
    };

    return this.http.patch<IPayment>(
      `${this.apiUrl}/${paymentData._id}`,
      payment
    );
  }

  retrievePayment(id: String): Observable<IPayment> {
    return this.http.get<IPayment>(`${this.apiUrl}/${id}`);
  }

  isExisitingPayment(payment: IPayment): boolean {
    return payment && this.userIdentity === null;
  }
}
