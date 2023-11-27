import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  testForm: FormGroup;
  submitted = false;

  command : string = "";

  functionArr = {
    "eeprom": ['read', 'write'],
    "ledRed": ['on', 'off'],
    "ledGreen": ['on', 'off'],
    "button1": ['get'],
    "button2": ['get']
  }

  str = "read"

  selectedFuncArr : any = ['read', 'write'];

  testDataSubscription : Subscription = new Subscription();

  constructor(fb: FormBuilder, private testService: TestService){
    this.testForm = fb.group({
      'component' : ['eeprom', Validators.required],
      'function' : ['read', Validators.required],
      'status': ['']
    })
  }

  handleComponentChange(){
    var sel = this.testForm.value.component;    
    this.str = this.functionArr[sel as keyof typeof this.functionArr][0];
    this.selectedFuncArr = this.functionArr[sel as keyof typeof this.functionArr];    
  }

  onSubmitTestForm(){
    console.log(this.testForm.value.component + '-' + this.testForm.value.function);    
    if(this.testForm.value.component === "ledRed"){
      if(this.testForm.value.function === "on"){
        this.command = "SET LED ON;"
      }else{
        this.command = "SET LED OFF;"
      }
    }else if(this.testForm.value.component === "ledGreen"){
      if(this.testForm.value.function === "on"){
        this.command = "SET LED ON;"
      }else{
        this.command = "SET LED OFF;"
      }
    }else if(this.testForm.value.component === "eeprom"){
      if(this.testForm.value.function === "read"){
        this.command = "READ EEPROM;"
      }else{
        this.command = "WRITE EEPROM;"
      }
    } else if(this.testForm.value.component === "button1"){
      this.command = "GET BUTTON 1;"
    } else if(this.testForm.value.component === "button2"){
      this.command = "GET BUTTON 2;"
    }

    this.testService.testComponent(this.command).subscribe();
    this.testService.addTestDataListener();  
    this.testDataSubscription = this.testService.getTestDataSubject().subscribe(data => {
      console.log(data);                    
      this.testService.stopTestDataListener();
      this.testDataSubscription.unsubscribe();
    }); 
  }
}
