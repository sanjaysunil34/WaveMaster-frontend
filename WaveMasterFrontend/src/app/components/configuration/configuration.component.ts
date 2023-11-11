import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  connectionForm: FormGroup;
  submitted = false;

  baudRateValues = [110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 56000, 57600, 115200, 230400]

  constructor(fb: FormBuilder, private router:Router){
    this.connectionForm = fb.group({
      'portName' : ['', Validators.required],
      'stopBit' : [ 1, Validators.required],
      'baudRate' : [ 110 , Validators.required],
      'dataBit' : [ 5 , Validators.required],
      'parity' : [ "none" , Validators.required]
    })
  }

  onSubmitConnectionForm(){
    this.router.navigate(['dashboard'])    
  }

}
