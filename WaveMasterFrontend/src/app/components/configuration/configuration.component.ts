import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionParams } from 'src/app/models/connectionParams';
import { ConnectionService } from 'src/app/services/connection-service.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  connectionForm: FormGroup;
  submitted = false;
  portNameEmpty = false;
  connectionParams : ConnectionParams = new ConnectionParams("", 0, 0, 0, "");

  baudRateValues = [110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 56000, 57600, 115200, 230400]
  portNames : string[] = [];

  constructor(fb: FormBuilder, private router:Router, private connectionService: ConnectionService){
    this.connectionForm = fb.group({
      'portName' : [this.portNames[0], Validators.required],
      'stopBit' : [ 1, Validators.required],
      'baudRate' : [ 110 , Validators.required],
      'dataBit' : [ 5 , Validators.required],
      'parity' : [ "none" , Validators.required]
    })

    connectionService.getPortName().subscribe(data => {
      data.forEach(d => {
        this.portNames.push(d);
      });
    });    
  }

  onSubmitConnectionForm(){
    console.log({
      portName : this.connectionForm.value.portName,
      stopBit : this.connectionForm.value.stopBit,
      baudRate : this.connectionForm.value.baudRate,
      dataBit : this.connectionForm.value.dataBit,
      parity : this.connectionForm.value.parity
    });

      this.connectionParams.portName = this.connectionForm.value.portName;
      this.connectionParams.stopBit = this.connectionForm.value.stopBit;
      this.connectionParams.baudRate = this.connectionForm.value.baudRate;
      this.connectionParams.dataBit = this.connectionForm.value.dataBit;
      this.connectionParams.parity = this.connectionForm.value.parity;

    

    if(this.connectionForm.value.portName === null){
      this.portNameEmpty = true;
    }else{
      this.connectionService.connect(this.connectionParams).subscribe(data => {
        this.router.navigate(['dashboard'])    
      },error => {
        console.log(error)
      });
    }
    
    
  }

}
