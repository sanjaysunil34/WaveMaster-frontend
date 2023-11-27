import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {

  isCaptureOn : boolean = false;
  private unloadFlag = false;

  constructor(private router: Router,private connectionService: ConnectionService){
    connectionService.startConnection();
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

  ngOnDestroy() {
    this.connectionService.endConnection();
  }
}
