import { CanActivateFn } from "@angular/router";

export function connectionGuard(): CanActivateFn {
    let status = localStorage.getItem("connectionStatus")

    return () => {
        if(status == "connected"){
            return true;
        }
        alert("Sorry no access...  ");
        return false;
    };
}