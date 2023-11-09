import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  connectionForm: FormGroup;
  submitted = false;

  constructor(fb: FormBuilder){
    this.connectionForm = fb.group({
      'portName' : ['', Validators.required]
    })
  }

  onSubmitConnectionForm(){

  }

}
