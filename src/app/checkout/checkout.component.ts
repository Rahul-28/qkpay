import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripeError,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';

import { environment } from '../../../environment';
import { ActivatedRoute } from '@angular/router';
import { IPaymentData } from '../shared/models/payment.model';
import { CheckoutService } from '../shared/service/checkout/checkout.service';
import { PaymentService } from '../shared/service/payment/payment.service';

@Component({
  selector: 'app-checkout',
  imports: [StripeElementsDirective, StripePaymentElementComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild(StripeElementsDirective) elements!: StripeElementsDirective;
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  paymentData!: IPaymentData;
  clientSecret!: string;
  private paying = signal(false);

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    mode: 'payment',
    currency: 'usd',
    amount: 1000, // Default value
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false,
    },
  };

  stripe = injectStripe(environment.stripe.publicKey);
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  private checkoutService = inject(CheckoutService);

  ngOnInit(): void {
    this.initializeCheckout();
  }

  ngAfterViewInit(): void {
    if (this.clientSecret) {
      this.elementsOptions.clientSecret = this.clientSecret;
    }
  }

  private initializeCheckout(): void {
    this.route.queryParams.subscribe((params) => {
      const qrData = params['qr_data'];
      if (qrData) {
        this.paymentService.retrievePayment(qrData).subscribe(async (res) => {
          this.paymentData = await {
            invoice: res.invoice,
            creator: res.creator,
          };
        });
      }
      setTimeout(() => {
        if (this.paymentData) {
          this.fetchClientSecret();
        } else {
          console.error('Error creating paymentData object', this.paymentData);
        }
      }, 2000);
    });
  }

  private fetchClientSecret(): void {
    this.checkoutService.createPaymentIntent(this.paymentData).subscribe(
      (response: any) => {
        if (response && response.paymentIntent) {
          this.clientSecret = response.paymentIntent.client_secret;
          console.log('Payment Intent:', response.paymentIntent);
        }
      },
      (error: any) => {
        console.error('Error creating payment intent:', error);
      }
    );
  }

  pay() {
    if (this.paying()) return;
    this.paying.set(true);
    this.elements.submit().subscribe((res) => {
      (err: StripeError) => {
        this.paying.set(false);
        console.error(err.message);
      };
    });

    this.checkoutService
      .handlePayment(
        this.clientSecret,
        this.paymentData,
        this.paymentElement,
        this.stripe
      )
      .subscribe((result) => {
        this.paying.set(false);
        console.log('Result', result);
        if (result.error) {
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            alert({ success: true });
          }
        }
      });
  }
}
