import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { inject } from '@angular/core';
import { RedirectService } from "../redirect.service";

export const redirectGuard: CanActivateFn = (route, state) => {    
    const redirectService = inject(RedirectService);
    return true;
}