import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection.service';
import { TestService } from 'src/app/services/test.service';
import { GenerateComponent } from '../generate/generate.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  @ViewChild(GenerateComponent, { static: false }) childComponent: GenerateComponent | undefined;

  isCaptureOn : boolean = false;
  currentlySelectedTab : number = 0;

  constructor(private router: Router, private connectionService: ConnectionService, private testService: TestService){
    connectionService.startHubConnection();
  }

  disconnect(){
    this.connectionService.disconnectSerialPort().subscribe(data => {
      localStorage.removeItem("connectionStatus");
      this.router.navigate(['/']);
    })    
  }

  captureToggler(event: any) {
    this.isCaptureOn = event;       
  }  

  ngOnDestroy() {
    this.connectionService.endHubConnection();
  }

  onTabSelected(event: MatTabChangeEvent): void {
    const selectedTabIndex = event.index;    
    switch (selectedTabIndex) {
      case 0:
        if(this.currentlySelectedTab == 2){
          this.testService.testComponent("USER;").subscribe();
        }
        this.currentlySelectedTab = selectedTabIndex;
        break;
      case 1:
        if(this.currentlySelectedTab == 2){
          this.testService.testComponent("USER;").subscribe();
        }
        this.currentlySelectedTab = selectedTabIndex;
        break;
      // Add more cases as needed
      default:
        if(this.childComponent?.show){
          this.childComponent?.stopGenerate();
        }      
        this.testService.testComponent("TEST;").subscribe();          
        this.currentlySelectedTab = selectedTabIndex;
        break;
    }
  }
}
