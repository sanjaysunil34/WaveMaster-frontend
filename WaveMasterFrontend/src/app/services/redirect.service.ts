import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router : Router) { 
    let status = localStorage.getItem("connectionStatus");
    if(status == "connected"){            
      this.router.navigate(['dashboard']);
    }
  }
}
