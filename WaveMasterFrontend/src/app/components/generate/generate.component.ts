import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent {
  generateForm: FormGroup;
  submitted = false;
  peakValue = new FormControl(0);
  frequencyValue = new FormControl(0);

  constructor(fb: FormBuilder){
    this.generateForm = fb.group({
      'signalType' : ['sine', Validators.required]
    })
    
    
  }

  onSubmitGenerateForm(){
    console.log(this.generateForm.value.signalType);    
    console.log(this.peakValue.value);
    console.log(this.frequencyValue.value);
  }

  handlePeakChange(v : any){
    console.log(v.value);
    if(v.value > 3.3){
      v.value = 3.3;
    }else if(v.value < 0){
      v.value = 0;
    }
    this.peakValue = new FormControl(parseFloat(v.value));
  }

  handleFrequencyChange(v : any){
    console.log(v.value);
    if(v.value > 1000){
      v.value = 1000;
    }else if(v.value < 100){
      v.value = 100;
    }
    this.frequencyValue = new FormControl(parseFloat(v.value));
  }
}
