import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private router: Router,private connectionService: ConnectionService){
  }

  disconnect(){
    this.connectionService.disconnect().subscribe(data => {
      this.router.navigate(['/']);
    })
    
  }
}
