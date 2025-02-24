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
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  router = inject(Router);
  fb = inject(FormBuilder);
  service = inject(AccountService);

  showPassword = false;
  register$!: Subscription;

  ngOnInit(): void {
    if (localStorage.getItem('loggedAccount')) {
      this.router.navigate(['/dashboard']);
    }
    this.registerForm = this.fb.group({
      name: ['sam', [Validators.required]],
      email: ['sample@gmail.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSignIn(form: FormGroup) {
    this.register$ = this.service.register(form.value).subscribe({
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
        console.info('registration successful');
        this.register$.unsubscribe();
      },
    });
  }
}
