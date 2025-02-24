import { Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { QrComponent } from './qr/qr.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScannerComponent } from './scanner/scanner.component';

import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { authGuard } from './shared/guard/auth/auth.guard';

export const routes: Routes = [
  //before logging in
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // after logging in
  { path: 'dashboard', component: DashboardComponent },
  { path: 'qr', component: QrComponent, canActivate: [authGuard] },
  { path: 'scanner', component: ScannerComponent },
  { path: 'checkout', component: CheckoutComponent },
  // wildcard routes
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
