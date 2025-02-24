import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../service/account/account.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  return accountService.isAuthenticated$.pipe(
    map((isAuthenticated: boolean) => {
      console.log('isAuthenticated', isAuthenticated);
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
