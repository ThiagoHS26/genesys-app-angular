import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if(authSvc.checkAuthentication() != null){
    return true;
  }else {
    const urlTree = router.createUrlTree(['/login']);
    return urlTree;
  }

};
