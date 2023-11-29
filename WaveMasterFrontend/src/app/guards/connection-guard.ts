import { CanActivateFn } from "@angular/router";

/**
 * Connection guard function to control access based on the connection status.
 * @returns A function that can be used as a canActivate guard in Angular routes.
 */
export function ConnectionGuard(): CanActivateFn {
    let status = localStorage.getItem("connectionStatus")

    return () => {
        if(status == "connected"){
            return true;
        }
        alert("Sorry no access...  ");
        return false;
    };
}