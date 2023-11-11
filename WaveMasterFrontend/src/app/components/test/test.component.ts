import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  testForm: FormGroup;
  submitted = false;

  functionArr = {
    "eeprom": ['read', 'write'],
    "ledRed": ['on', 'off'],
    "ledGreen": ['on', 'off']
  }

  str = "read"

  selectedFuncArr : any = ['read', 'write'];

  constructor(fb: FormBuilder){
    this.testForm = fb.group({
      'component' : ['eeprom', Validators.required],
      'function' : ['read', Validators.required]
    })
  }

  handleComponentChange(){
    var sel = this.testForm.value.component;    
    this.str = this.functionArr[sel as keyof typeof this.functionArr][0];
    this.selectedFuncArr = this.functionArr[sel as keyof typeof this.functionArr];    
  }

  onSubmitTestForm(){
    console.log(this.testForm.value.component + '-' + this.testForm.value.function);    
  }
}
