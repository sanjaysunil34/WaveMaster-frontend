import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { inject } from '@angular/core';
import { RedirectService } from "../services/redirect.service";

export const RedirectGuard: CanActivateFn = (route, state) => {    
    const redirectService = inject(RedirectService);
    return true;
}