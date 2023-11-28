import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  testForm: FormGroup;
  //submitted = false;
  status: FormControl = new FormControl('')
  command : string = "";
  message : string = "";

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
    })
  }

  handleComponentChange(){
    var sel = this.testForm.value.component;    
    this.str = this.functionArr[sel as keyof typeof this.functionArr][0];
    this.selectedFuncArr = this.functionArr[sel as keyof typeof this.functionArr];    
  }

  onSubmitTestForm(){
    switch(this.testForm.value.component){
      case "ledRed" : 
        this.message = "LED RED is turned ";
        this.command = `LED ${this.testForm.value.function.toUpperCase()} 1;`;
        break;
      case "ledGreen": 
        this.message = "LED GREEN is turned ";
        this.command = `LED ${this.testForm.value.function.toUpperCase()} 2;`
        break;
      case "eeprom":
        this.message = "EEPROM is ";
        this.command = "EEPROM;";
        break;
      case "button1":
        this.message = "BUTTON 1 is ";
        this.command = "BUTTON 1;"
        break;
      case "button2":
        this.message = "BUTTON 2 is ";
        this.command = "BUTTON 2;"
        break;
    }   

    this.testService.testComponent(this.command).subscribe();
    this.testService.addTestDataListener();  
    this.testDataSubscription = this.testService.getTestDataSubject().subscribe(data => {   
      this.status.setValue(this.message + data);     
      this.testService.stopTestDataListener();
      this.testDataSubscription.unsubscribe();
    }); 
  }
}
