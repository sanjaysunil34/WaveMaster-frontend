/**
 * represents the data to be plotted on chart
 */
export class PlotData{
    constructor(
        public voltage: number, //voltage of signal
        public time: Date // timestamp
    ) {}
}