import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const role = authService.getRole();

  console.log("Checking role guard - Expected:", expectedRole, "User Role:", role);

  if (role && role === expectedRole) {
    return true;
  } else {
    console.warn('role.guard: UNAUTHORIZED - Redirecting to login');
    router.navigate(['/login']);
    return false;
  }
};
