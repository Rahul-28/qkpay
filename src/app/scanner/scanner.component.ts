import { NgClass } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent,
  NgxScannerQrcodeModule,
} from 'ngx-scanner-qrcode';
import { PaymentService } from '../shared/service/payment/payment.service';
import { IPayment } from '../shared/models/payment.model';

@Component({
  selector: 'app-scanner',
  imports: [NgxScannerQrcodeModule, NgClass],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.css',
})
export class ScannerComponent implements AfterViewInit {
  public percentage = 80;
  public quality = 100;

  config: ScannerQRCodeConfig = {
    constraints: {
      audio: false,
      video: {
        width: window.innerWidth,
      },
    },
  };

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  retrievedPayment!: IPayment;

  private router = inject(Router);
  private paymentService = inject(PaymentService);

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      console.log(res);
    });
  }

  public onEvent(data: ScannerQRCodeResult[], action?: any): void {
    this.redirectToPayment(data[0].value);
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find((f) =>
        /back|rear|environment/gi.test(f.label)
      ); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  async redirectToPayment(payment_id: String) {
    // stop the camera
    this.action.stop();

    const stringifiedPaymentId = payment_id.replace(/^["']|["']$/g, '');

    this.paymentService.retrievePayment(stringifiedPaymentId).subscribe({
      next: (res: IPayment) => {
        this.retrievedPayment = res;
        // checks if loggedUser created the payment
        const temp = this.paymentService.isExisitingPayment(
          this.retrievedPayment
        );
        const route = temp ? 'checkout' : 'qr';
        this.router.navigate([`/${route}`], {
          queryParams: { qr_data: stringifiedPaymentId },
        });
      },
    });
  }
}
