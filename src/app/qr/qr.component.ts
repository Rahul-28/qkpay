import { Component, inject, OnInit } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../shared/service/payment/payment.service';
import { IPayment } from '../shared/models/payment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qr',
  imports: [QRCodeComponent, ReactiveFormsModule],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css',
})
export class QrComponent implements OnInit {
  paymentRequestForm!: FormGroup;
  jsonizedFormData!: string;

  submitted = false;
  isUpdateMode = false;

  id!: string;
  qr_data!: string;
  paymentData!: IPayment;
  loadPayment$!: Subscription;

  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  paymentService = inject(PaymentService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.qr_data = param['qr_data'];
      // retrieves existing payment
      if (this.qr_data) {
        this.loadPayment$ = this.paymentService
          .retrievePayment(this.qr_data)
          .subscribe({
            next: (res) => {
              this.paymentData = res;
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => {
              this.loadPayment$.unsubscribe();
            },
          });
        this.isUpdateMode = true;
      }
    });
    setTimeout(() => {
      if (this.qr_data && this.paymentData) {
        // updates payment form
        this.loadForm(this.paymentData);
      } else {
        // new payment form
        this.initializeForm();
      }
    }, 2000);
  }

  initializeForm() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 7);

    this.paymentRequestForm = this.fb.group({
      id: [''],
      phone: ['', [Validators.required]],
      amount: [0, [Validators.required]],
      invoice_month: [formattedDate, [Validators.required]],
      address_line1: ['4, sample address', [Validators.required]],
      address_line2: [''],
      zip_code: ['12121', [Validators.required]],
    });
  }

  createQr() {
    this.submitted = true;

    if (this.paymentRequestForm.invalid) {
      console.error('Form is invalid:', this.paymentRequestForm.errors);
      return;
    }

    this.paymentService.createPayment(this.paymentRequestForm.value).subscribe({
      next: (payment: IPayment | void) => {
        if (payment) {
          // todo: change this
          this.id = payment._id;
          this.generateQRData();
        } else {
          console.warn('No payment data received');
        }
      },
      error: (err) => {
        console.error('Error creating payment:', err);
      },
      complete: () => {
        console.log('Payment creation process completed.');
      },
    });
  }

  loadForm(payment: IPayment) {
    const invoice = payment.invoice;

    this.paymentRequestForm = this.fb.group({
      id: [payment._id],
      phone: [invoice.phone, [Validators.required]],
      amount: [invoice.amount, [Validators.required]],
      invoice_month: [invoice.invoice_month, [Validators.required]],
      address_line1: [invoice.address_line1, [Validators.required]],
      address_line2: [invoice.address_line2],
      zip_code: [invoice.zip_code, [Validators.required]],
    });
  }

  updateQr() {
    if (this.paymentRequestForm.invalid) {
      console.error('Form is invalid:', this.paymentRequestForm.errors);
      return;
    }
    this.paymentService
      .updatePayment(this.paymentRequestForm.value, this.paymentData)
      .subscribe({
        next: () => {
          this.generateQRData();
        },
        error: (err) => {
          console.error('Error updating payment:', err);
        },
        complete: () => {
          console.log('Payment updations process completed.');
        },
      });
  }

  generateQRData() {
    this.submitted = true;
    if (!this.qr_data) {
      this.paymentRequestForm.patchValue({ id: this.id });
    }

    this.jsonizedFormData = JSON.stringify(
      this.paymentRequestForm.get('id')?.value
    );
  }
}
