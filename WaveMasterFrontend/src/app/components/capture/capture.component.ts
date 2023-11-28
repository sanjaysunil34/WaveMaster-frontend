import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlotData } from 'src/app/models/plot-data';
import { CaptureService } from 'src/app/services/capture.service';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss']
})

export class CaptureComponent implements OnDestroy {
  @Output() captureEvent: EventEmitter<boolean> = new EventEmitter()

  // start/stop button status
  start: boolean = true

  //store id of the open accordion
  openAccordion: string = 'collapseOne';

  //status of capturing
  isCaptureOn: boolean = false;

  //graph controls
  xAxisIncrement = 0;
  xAxisScale = new FormControl(1)
  yAxisScale = new FormControl(1)
  dataAcquisitionRate = new FormControl(1)

  //signal controls
  frequency = new FormControl(0)
  peakToPeak = new FormControl(0)

  //plot parameters
  dataPoints: any[] = [];
  chart: any;
  chartOptions = {
    theme: "light2",
    zoomEnabled: true,
    title: {
      text: "Signal Data",
      fontColor: "#5375C7",
      fontSize: 25
    },
    data: [{
      type: "line",
      xValueType: "dateTime",
      dataPoints: this.dataPoints,

    }],
    toolTip: {
      contentFormatter: function (e: any) {
        var content = " ";
        for (var i = 0; i < e.entries.length; i++) {
          content += "Timestamp : " + new Date(e.entries[i].dataPoint.x) + "<br/>" + "Voltage : " + e.entries[i].dataPoint.y + " V";
          content += "<br/>";
        }
        return content;
      }
    },
    axisY: {
      title: "Voltage ( Volt )",
      minimum: 0,
      maximum: 3.3,
      interval: 0.1,
      tickLength: 15,
      labelFontSize: 13,
      titleFontSize: 25,

    },
    axisX: {
      title: "Time",
      valueFormatString: "hh:mm:ss:ff",
      gridThickness: 0,
      titleFontSize: 25,
      interval: 1,
      tickLength: 15,
      labelFontSize: 13,
    }
  }

  //hub connection 
  captureDataSubscription: Subscription = new Subscription();
  fetchDataSubscription: Subscription = new Subscription();
  captureControlDataSubscription: Subscription = new Subscription();

    constructor(private captureService: CaptureService) { 
      this.captureControlDataSubscription = this.captureService.getCaptureControlDataSubject().subscribe(data => {
        console.log(data);
        if(data == "START CAPTURE"){
          this.start = !this.start;
          this.isCaptureOn = true;
          this.captureService.plotCapture("START").subscribe();
          this.captureService.addPlotDataListener();  
          this. captureDataSubscription = this.captureService.getPlotDataSubject().subscribe(data => {                  
            this.addData(data);
          });  
        }else if(data == "STOP CAPTURE"){
          this.start = !this.start;
          this.isCaptureOn = false;
          this.captureService.stopPlotDataListener();
          this.captureDataSubscription.unsubscribe();
          this.captureControlDataSubscription.unsubscribe();
        }
      })
    }
    // Toggle accordion items
    toggleAccordion(accordionId: string): void {
      this.openAccordion = this.openAccordion === accordionId ? this.openAccordion : accordionId;
    }
    // Check if an accordion item is open
    isAccordionOpen(accordionId: string): boolean {
      return this.openAccordion === accordionId;
    }

  addData = (data: PlotData[]) => {
    data.forEach(d => {
      this.dataPoints.push({ label: formatDate(new Date(d.time), "hh:mm:ss:SS", 'en-us'), y: d.voltage, x: ++this.xAxisIncrement })

      if (this.dataPoints.length > 100) {
        this.dataPoints.shift();
      }
    });

    this.chart.render();
  }

  handleStart(){
    this.isCaptureOn = true;
    this.captureService.plotCapture("START").subscribe();
    this.captureService.addPlotDataListener();
    this.captureDataSubscription = this.captureService.getPlotDataSubject().subscribe(data => {
      this.addData(data);
    });
    this.captureControlDataSubscription = this.captureService.getCaptureControlDataSubject().subscribe(data => {
      console.log(data);
      if (data == "STOP CAPTURE") {
        this.start = !this.start;
        this.isCaptureOn = false;
        this.captureService.stopPlotDataListener();
        this.captureDataSubscription.unsubscribe();
        this.captureControlDataSubscription.unsubscribe();
      }
    })
  }

  handleStop(){
    this.isCaptureOn = false;
    this.captureService.plotCapture("STOP").subscribe();
    this.captureService.stopPlotDataListener();
    this.captureDataSubscription.unsubscribe();
    this.captureControlDataSubscription.unsubscribe();
  }

  //On click handler for start/stop button
  toggleStartStop() {
    this.start = !this.start
    if(!this.start){
      this.handleStart()
    }else{
      this.handleStop()
    }
    this.captureEvent.emit(this.isCaptureOn);
  }

  //plot scale control
  onXScaleChange(event: any) {
    this.chartOptions.axisX.labelFontSize = 13 * event.value;
    switch (event.value) {
      case "0.5": this.chartOptions.axisX.labelFontSize = 10;
        break;
      case "1": this.chartOptions.axisX.labelFontSize = 13;
        break;
      case "2": this.chartOptions.axisX.labelFontSize = 15;
        break;
    }
    this.chart.render();
  }

  onYScaleChange(event: any) {
    this.chartOptions.axisY.interval = 0.1 * event.value;
    this.chartOptions.axisY.labelFontSize = 13 * event.value;
    switch (event.value) {
      case "0.5": this.chartOptions.axisY.labelFontSize = 10;
        break;
      case "1": this.chartOptions.axisY.labelFontSize = 13;
        break;
      case "2": this.chartOptions.axisY.labelFontSize = 15;
        break;
    }
    this.chart.render();
  }

  onRateChange(event: any) {
    console.log(event.value);
    this.captureService.sendDataAcquisitionRate(event.value).subscribe()
  }

  handleSignalData(data : string){
    data = data.substring(data.indexOf("DATA"));
    this.frequency.setValue(parseFloat(data.split(";")[0].replace("DATA", "")))
    this.peakToPeak.setValue(parseFloat(data.split(";")[1].replace("DATA", "")) * (3.3 / 4096))
  }
  //fetch plot data from hardware
  fetchSignalData() {
    this.captureService.getSignalData().subscribe();
    this.captureService.addFetchDataListener();
    this.fetchDataSubscription = this.captureService.getFetchDataSubject().subscribe(data => {     
      this.handleSignalData(data)
      this.captureService.stopFetchDataListener();
      this.fetchDataSubscription.unsubscribe();
    });
  }

    getChartInstance(chart: object) {
      this.chart = chart;                
    }
    
    ngOnDestroy() {
      this.captureControlDataSubscription.unsubscribe();
      this.captureService.stopPlotDataListener();
      this.captureService.stopFetchDataListener();      
    }

}
