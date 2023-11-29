import { formatDate } from '@angular/common';
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
  //event to send capture status to dashboard component
  @Output() captureEvent: EventEmitter<boolean> = new EventEmitter()

  // start/stop button status
  start: boolean = true

  //store id of the open accordion
  openAccordion: string = 'collapseOne';

  //status of capturing
  isCaptureOn: boolean = false;

  //chart controls
  xAxisIncrement = 0;
  xAxisScale = new FormControl(1)
  yAxisScale = new FormControl(1)
  dataAcquisitionRate = new FormControl(1)

  //signal controls
  frequency = new FormControl(0)
  peakToPeak = new FormControl(0)

  //chart parameters
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
          content += "Timestamp : " + new Date(e.entries[i].dataPoint.x) + "<br/>" + "Voltage : " + e.entries[i].dataPoint.y + " V<br/>";
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
  
  //subscription details
  captureDataSubscription: Subscription = new Subscription();
  fetchDataSubscription: Subscription = new Subscription();
  captureControlDataSubscription: Subscription = new Subscription();

  constructor(private captureService: CaptureService) {
    captureService.addCaptureCommandsListener();
    this.captureControlDataSubscription = captureService.getCaptureControlDataSubject().subscribe(data => {
      console.log(data);
      if (data == "START CAPTURE") {
        this.isCaptureOn = true;        
        this.captureService.addPlotDataListener();
        this.captureDataSubscription = this.captureService.getPlotDataSubject().subscribe(data => {
          this.addData(data);
        });
      } else if (data == "STOP CAPTURE") {
        this.isCaptureOn = false;
        this.captureService.stopPlotDataListener();
        this.captureDataSubscription.unsubscribe();
      }
      this.captureEvent.emit(this.isCaptureOn);
    })
  }

  ngOnDestroy() {
    this.captureControlDataSubscription.unsubscribe();
    this.captureService.stopCaptureCommandsListener();
    this.captureService.stopPlotDataListener();
    this.captureService.stopFetchDataListener();
  }

  /**
   * sets the openAccordion variable to the id of accordian which is open
   * @param accordionId id of the accordian whose state is to be toggled
   */
  toggleAccordion(accordionId: string): void {
    this.openAccordion = (this.openAccordion === accordionId) ? this.openAccordion : accordionId;
  }

  /**
   * Check if an accordion item is open
   * @param accordionId name of the accordian
   * @returns if open returns true, otherwise returns false
   */
  isAccordionOpen(accordionId: string): boolean {
    return this.openAccordion === accordionId;
  }

  /**
   * format each of the PlotData objects and pushes into the chart dataPoints array and re-render the chart.
   * It also handles shifting the chart if number of points rendered is greater than hundred.
   * @param data list of PlotData objects
   */
  addData = (data: PlotData[]) => {
    data.forEach(d => {
      this.dataPoints.push({ label: formatDate(new Date(d.time), "hh:mm:ss:SS", 'en-us'), y: d.voltage, x: ++this.xAxisIncrement })
      if (this.dataPoints.length > 100) {
        this.dataPoints.shift();
      }
    });

    this.chart.render();
  }

  /**
   * handles start and stop of capture
   */
  toggleStartStop() {
    this.start = !this.start
    this.captureService.plotCapture( this.start ?  "STOP" : "START").subscribe();
  }

  onXScaleChange(event: any) {
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

  /**
   * Extracts values of frequency and peak to peak from the response received and updates ui
   * @param data string containing frequency and peak to peak value in the format DATA{frequency};DATA{peaktopeak};
   */
  handleSignalData(data: string) {
    var dataArray = data.substring(data.indexOf("DATA")).split(";");
    this.frequency.setValue(parseFloat(dataArray[0].replace("DATA", "")))
    this.peakToPeak.setValue(parseFloat(dataArray[1].replace("DATA", "")) * (3.3 / 4096))
  }
  
  /**
   * Request frequency and peak to peak of the captured signal and update the ui
   */
  fetchSignalData() {
    this.captureService.getSignalData().subscribe();
    this.captureService.addFetchDataListener();
    this.fetchDataSubscription = this.captureService.getFetchDataSubject().subscribe(data => {
      this.handleSignalData(data)
      this.captureService.stopFetchDataListener();
      this.fetchDataSubscription.unsubscribe();
    });
  }

  /**
   * Assigns a chart instance to the comeponents chart property.
   * Gets invoked when the chartInstance event is fired. 
   * @param chart The object instance to be assigned
   */
  getChartInstance(chart: object) {
    this.chart = chart;
  }  

}
