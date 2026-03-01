import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];
  if (requiredRole) {
    if (requiredRole === 'customer' && !authService.isCustomer()) {
      router.navigate(['/officer-home']);
      return false;
    }
    if (requiredRole === 'officer' && !authService.isOfficer()) {
      router.navigate(['/customer-home']);
      return false;
    }
  }

  return true;
};
