import { Component,AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
declare const CanvasJS: any;

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})
export class CaptureComponent {
    chartOptions = {
      title: {
        text: "Basic Column Chart in Angular"
      },
      data: [{
        type: "column",
        dataPoints: [
          {x: 20, y: 10 }
        ]
      }]                
    };
    
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


    // renderChart() {
    //   let dataPoints = [{x: new Date(),y:0}]; // Define or fetch your data points here
  
    //   const chart = new CanvasJS.Chart("chartContainer", {
    //     title: {
    //       text: "Dynamic Line Graph"
    //     },
    //     data: [{
    //       type: "line",
    //       dataPoints: dataPoints
    //     }]
    //   });
  
    //   chart.render();
  
    //   // Example: Updating the graph with new data
      

    startDataPlotting(){
      setInterval(() => {
         // Replace this with your updated data
        //this.chartOptions.data[0].dataPoints.push({ x: new Date(), y: Math.random() * 100 })
        // chart.render();
      }, 1000);
    }
}
