import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { AuthFacade } from './auth.facade';

const protectAdminRoute = (_route: Parameters<CanActivateFn>[0], state: Parameters<CanActivateFn>[1]) =>
  inject(AuthFacade).requireAuthentication(state.url);

export const adminAuthGuard: CanActivateFn = protectAdminRoute;
export const adminChildAuthGuard: CanActivateChildFn = protectAdminRoute;
