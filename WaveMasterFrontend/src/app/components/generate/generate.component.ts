import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent {
  generateForm: FormGroup;
  submitted = false;

  constructor(fb: FormBuilder){
    this.generateForm = fb.group({
      'signalType' : ['sine', Validators.required]
    })
  }

  onSubmitGenerateForm(){

  }
}
