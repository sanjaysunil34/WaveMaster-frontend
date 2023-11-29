import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';

/**
 * Component for testing the components in microcontroller.
 */
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  testForm: FormGroup;
  status: FormControl = new FormControl('')
  command : string = "";
  message : string = "";

  //List of all the components and their corresponing functions to be tested.
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

  /**
   * Constructor for Test Component.
   * @param fb - FormBuilder for creating the form group.
   * @param testService - Service for testing the components.
   */
  constructor(fb: FormBuilder, private testService: TestService){ 
    this.testForm = fb.group({
      'component' : ['eeprom', Validators.required],
      'function' : ['read', Validators.required],    
    })
  }

  /**
   * Detects the change in component dropdown and occupies the functions
   * corresponding to the selected component in the next dropdown.
   */
  handleComponentChange(){
    var sel = this.testForm.value.component;    
    this.str = this.functionArr[sel as keyof typeof this.functionArr][0];
    this.selectedFuncArr = this.functionArr[sel as keyof typeof this.functionArr];    
  }

  /**
   * Triggered on submitting the form, and sends the corresponding commands to the backend.
   * Receives the result obtained from the test hub.
   */
  onSubmitTestForm(){
    console.log(this.testForm.value.component + '-' + this.testForm.value.function);    
    //generates the command from the selected values in the dropdowns.
    if(this.testForm.value.component === "ledRed"){
      this.message = "LED RED is turned ";
      if(this.testForm.value.function === "on"){
        this.command = "LED ON 1;"
      }else{
        this.command = "LED OFF 1;"
      }
    }else if(this.testForm.value.component === "ledGreen"){
      this.message = "LED GREEN is turned ";
      if(this.testForm.value.function === "on"){
        this.command = "LED ON 2;"
      }else{
        this.command = "LED OFF 2;"
      }
    }else if(this.testForm.value.component === "eeprom"){
      this.message = "EEPROM is ";
      if(this.testForm.value.function === "read"){
        this.command = "EEPROM;"
      }else{
        this.command = "EEPROM;"
      }
    } else if(this.testForm.value.component === "button1"){
      this.message = "BUTTON 1 is ";
      this.command = "BUTTON 1;"
    } else if(this.testForm.value.component === "button2"){
      this.message = "BUTTON 2 is ";
      this.command = "BUTTON 2;"
    }

    //Sends the command using http service and then listens to the test hub for results.
    this.testService.testComponent(this.command).subscribe();
    this.testService.addTestDataListener();  
    this.testDataSubscription = this.testService.getTestDataSubject().subscribe(data => {   
      this.status.setValue(this.message + data);     
      this.testService.stopTestDataListener();
      this.testDataSubscription.unsubscribe();
    }); 
  }
}
