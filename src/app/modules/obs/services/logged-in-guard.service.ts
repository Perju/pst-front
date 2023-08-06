import { Injectable } from '@angular/core';
import { ObsAuthService } from './obs-auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedInGuardService {
  constructor(private obsAuth: ObsAuthService) {}

  canActivate() {
    return this.obsAuth._isLoggedIn$;
  }
}
