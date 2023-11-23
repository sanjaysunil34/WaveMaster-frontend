import { Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/services/connection-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  isCaptureOn : boolean = false;
  isGenerateOn : boolean = false;
  
  constructor(private router: Router,private connectionService: ConnectionService){
  }

  disconnect(){
    this.connectionService.disconnect().subscribe(data => {
      this.router.navigate(['/']);
    })    
  }

  captureToggler(event: any) {
    this.isCaptureOn = event;   
  }

  generateToggler(event : any){
    this.isGenerateOn = event;
  }
  onChange(event : any){
    console.log(event);    
  }

  ngOnInit() {   
    //if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;
    // let checkExist = setInterval(() => { 
      
    //     // grab the tabs
    //     let tabs = document.querySelectorAll('.mat-mdc-tab');
    
    //     //if all the tabs rendered
    //     if (tabs?.length == this.tabs) {
    
    //       //run and attach mouseenter listeners
    //       for(let i = 0; i < tabs.length; i++){
    //         tabs[i].addEventListener('mouseenter', ()=>{
    //           console.log("mouse over")
    //           //when mouse entering tab - trigger click on it
    //           //tabs[i];
    //         });
    //       }
    //       //after listener attached - clear the interval
    //       clearInterval(checkExist);
    //     }
    // }, 100);  
  }
}
