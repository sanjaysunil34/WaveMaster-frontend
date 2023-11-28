import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignalData } from 'src/app/models/signalData';
import { GenerateService } from 'src/app/services/generate.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})

export class GenerateComponent{
  generateForm: FormGroup;
  show : boolean = false

  constructor(fb: FormBuilder,private generateService: GenerateService){
    this.generateForm = fb.group({
      'signalType' : ['sine', Validators.required],
      'peakValue': [0,Validators.required],
      'frequencyValue': [0,Validators.required]
    })
    this.restorePreviousSettings()
  }

  toggleShow(){
    this.show = !this.show;
  }

  restorePreviousSettings(){
    this.generateService.restoreWave().subscribe(data => {      
      this.generateForm.controls["signalType"].setValue(data.signalType );
      this.generateForm.controls["peakValue"].setValue(data.peakToPeak );
      this.generateForm.controls["frequencyValue"].setValue(data.frequency );
    });
  }

  onSubmitGenerateForm(){  
    this.toggleShow()
    var signalData = new SignalData(
      this.generateForm.value.frequencyValue,
      this.generateForm.value.peakValue
    );
    signalData.signalType = this.generateForm.value.signalType
    this.generateService.generateWave(signalData).subscribe();
  }

  stopGenerate(){
    this.toggleShow()
    this.generateService.stopGenerateWave().subscribe();
  }

  handlePeakChange(v : any){
    if(v.value > 3.3){
      v.value = 3.3;
    }else if(v.value < 0){
      v.value = 0;
    }
    this.generateForm.value.peakValue = parseFloat(v.value);
  }

  handleFrequencyChange(v : any){
    if(v.value > 100){
      v.value = 100;
    }else if(v.value < 0){
      v.value = 0;
    }
    this.generateForm.value.frequencyValue = parseFloat(v.value);
  }
}
