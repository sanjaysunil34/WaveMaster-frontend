import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from 'src/app/services/test.service';

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
    "led": ['on', 'off'],
    "button": ['1','2']
  }

  str = "read"

  selectedFuncArr : any = ['read', 'write'];

  constructor(fb: FormBuilder,private testService: TestService){
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
    this.testService.testPeripheral(this.testForm.value.component + '-' + this.testForm.value.function).subscribe(data => {
      console.log("command sent")
    });
  }
}
