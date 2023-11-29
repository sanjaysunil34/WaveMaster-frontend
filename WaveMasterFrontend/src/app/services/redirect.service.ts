import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Injectible service that performs redirection to dashboard if connected to the device.
 */
@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  /**
   * Constructor for the Redirect Service.
   * @param router - Router used to navigate to different page.
   */
  constructor(private router : Router) {
    let status = localStorage.getItem("connectionStatus");
    if(status == "connected"){            
      this.router.navigate(['dashboard']);
    }
  }
}
