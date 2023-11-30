import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection.service';
import { TestService } from 'src/app/services/test.service';
import { GenerateComponent } from '../generate/generate.component';

/**
 * Component which acts as the container for all the dashboard components.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  //Used to get a reference to the child component GenerateComponent.
  @ViewChild(GenerateComponent, { static: false }) childComponent: GenerateComponent | undefined;

  isCaptureOn : boolean = false;
  currentlySelectedTab : number = 0;

  /**
   * Constructor for Dashboard Component
   * @param router - Router used to navigate to different page.
   * @param connectionService - Service for establishing connection with the microcontroller board.
   * @param testService - Service for changing the device to test mode.
   */
  constructor(private router: Router, private connectionService: ConnectionService, private testService: TestService){
    connectionService.startHubConnection();
  }

  /**
   * Disconnects the application from the device.
   */
  disconnect(){
    this.connectionService.disconnectSerialPort().subscribe(data => {
      localStorage.removeItem("connectionStatus");
      this.router.navigate(['/']);
    })    
  }

  /**
   * Detects the state of capture function.
   * @param event - Event received from capture controller when the state of capture function is changed.
   */
  captureToggler(event: any) {
    this.isCaptureOn = event;       
  }  

  /**
   * Executed when component is about to be destroyed.
   * Here, ensures the connection is closed.
   */
  ngOnDestroy() {
    this.connectionService.endHubConnection();
  }

  /**
   * Handles the mode change commands to be sent to the device on changing the mat tabs.
   * @param event - Event emitted when a mat tab is selected.
   */
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
