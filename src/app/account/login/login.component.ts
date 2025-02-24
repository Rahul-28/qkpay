import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../shared/service/account/account.service';
import { IAccount, LoggedIn } from '../../shared/models/account.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  login$!: Subscription;

  router = inject(Router);
  fb = inject(FormBuilder);
  service = inject(AccountService);

  showPassword = false;

  ngOnInit(): void {
    if (localStorage.getItem('loggedAccount')) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.fb.group({
      email: ['sample@gmail.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin(form: FormGroup) {
    this.login$ = this.service.login(form.value).subscribe({
      next: (res: LoggedIn) => {
        localStorage.setItem(
          'loggedAccount',
          JSON.stringify(res.data.loggedAccount)
        );
        if (
          localStorage.getItem('loggedAccount') &&
          localStorage.getItem('loggedAccount') !== 'null'
        ) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.info('login successfull');
        this.login$.unsubscribe();
      },
    });
  }
}
