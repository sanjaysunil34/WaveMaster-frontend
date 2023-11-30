import { CanActivateFn } from "@angular/router";
import { inject } from '@angular/core';
import { RedirectService } from "../services/redirect.service";

/**
 * Redirect guard function to redirect to dashboard if in connected state.
 * @returns A boolean indicating whether the redirection should be allowed.
 */
export const RedirectGuard: CanActivateFn = () => {    
    //Injects the Redirect Service which handles logic for redirection.
    inject(RedirectService);
    return true;
}