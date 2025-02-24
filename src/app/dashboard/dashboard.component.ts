import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../shared/service/account/account.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  accountService = inject(AccountService);
  loggedAccount = JSON.parse(localStorage.getItem('loggedAccount') as string);

  ngOnInit(): void {
    console.log(this.loggedAccount);
  }

  logout() {
    this.accountService.logout();
  }
}
