import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent {
    start: boolean = true
    openAccordion: string = 'collapseOne';

    xAxisScale = new FormControl('0.5')
    yAxisScale = new FormControl('0.5') 
    dataAcquisitionRate = new FormControl(1)

    frequency = new FormControl('')
    peakToPeak = new FormControl('')

    // Toggle accordion items
    toggleAccordion(accordionId: string): void {
      this.openAccordion = this.openAccordion === accordionId ? this.openAccordion : accordionId;
    }
    // Check if an accordion item is open
    isAccordionOpen(accordionId: string): boolean {
      return this.openAccordion === accordionId;
    }
    toggleStartStop(){
      this.start = !this.start
    }

    onXScaleChange(event: any){
      console.log(this.xAxisScale.value)
      //change x-axis scale
    }

    onYScaleChange(event: any){
      console.log(this.yAxisScale.value)
      //change y axis scale
    }

    fetchData(){
      //fetch data from hardware
      this.frequency.setValue('100')
      this.peakToPeak.setValue('5')
    }
}
