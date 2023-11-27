import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  isCaptureOn : boolean = false;
  private unloadFlag = false;

  constructor(private router: Router,private connectionService: ConnectionService){
  }

  disconnect(){
    this.connectionService.disconnect().subscribe(data => {
      localStorage.removeItem("connectionStatus");
      this.router.navigate(['/']);
    })    
  }

  captureToggler(event: any) {
    this.isCaptureOn = event;   
  }

  // private disconnectFlagKey = 'disconnectFlag';

  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event): void {
  //   if (localStorage.getItem("disconnectFlag") === "true") {
      
  //     localStorage.removeItem("connectionStatus");
      
  //   }
  // }

  // @HostListener('document:visibilitychange', ['$event'])
  // handleVisibilityChange(event: Event): void {
  //   var logoutTimeout;
  //   if (document.visibilityState === 'hidden') {
  //     // Use a short timeout to delay the logout action
  //     logoutTimeout = setTimeout(() => {
  //       // Your code to handle tab close event goes here
  //       localStorage.removeItem("connectionStatus");
  //       // You can prompt the user or perform any necessary actions
  //     }, 1000); // Adjust the timeout as needed
  //   } else {
  //     // If visibility changes to 'visible', clear the timeout
  //     clearTimeout(logoutTimeout);
  //   }
  // }




  
}
