import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

/**
 * Connection guard function to control access based on the connection status.
 * @returns A function that can be used as a canActivate guard in Angular routes.
 */
export function ConnectionGuard(): CanActivateFn {
    let status = localStorage.getItem("connectionStatus")
    
    return () => {
        const router: Router = inject(Router);
        if(status == "connected"){
            return true;
        }
        alert("Check serial port connection.");
        router.navigateByUrl("/");
        return false;
    };
}